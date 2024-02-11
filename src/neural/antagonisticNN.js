const { saveFileData } = require("../io/fileIO");

// run 2 neural networks ..
// one with positive outputs and one with negative ones
// that is 
// state.reverseNet.learn(trainingData.map(obj => ({input: obj.input, output: obj.output.map(a => a ? 0 : 1)})));

/*
if both of these networks were training on the same data with different starting weights we would want to average them 
and adjust one in each cycle
however since they are in opposition the more similar the weights are the the less we care about those weights 
- should be different for the biases I think but lets try all 3 variations (only w, b, or both)
weight a is within close proximity of weight b 
so what we want to do is make them diverge so the higher one must get larger and the lower one must get lower

// lets go with the method below since the one above is a little volitile ?

- above we start with different weightings
but what if we take a system where we have the same weights
we then run the first which tries to make stuff better
then the second which makes stuff worse
as a result we have 2 new sets of weights and the original ones

if they drag the weights in the same direction ... average ??
else we give a little extra to the divergance ?

note the larger the change the the more wrong the were
*/

module.exports = (function() {
    /**
     * construct a neural-network.
     * 
     * @constructor
     * @public
     * @param {Array(Number)} layers an array of sizes for each of the layers.
     * @param {Object} props 
     */
    function NeuralNetwork(layers, props = null) {  // maybe create the layers in a way that each layer is an object of relevant data
        // set relavent parameters
        this.learnRate = props.learnRate || Math.PI / 10;
        this.cycles = props.cycles || 1024;
        this.breakConnectionList = [...layers].slice(1).map(() => []);

        // check layers
        let layersAreOk = true;

        if(Array.isArray(layers)){
            layers.forEach(val => {
                if(layersAreOk && typeof val !== 'number' || val < 1 || Math.floor(val) !== val) layersAreOk = false;
            })
        }else layersAreOk = false;

        if(layersAreOk) this.layers = layers;
        else return null;

        // set up weights and biases
        this.allLayers = props.allLayers || layers.slice(1).map((layerSize, layerIndex) => {
            return {
                weights: Array.from({length: layers[layerIndex] * layerSize}, () => Math.random()),
                weightGradient: Array.from({length: layers[layerIndex] * layerSize}, () => 0),
                reverseWeightGradient: Array.from({length: layers[layerIndex] * layerSize}, () => 0),
                biases: Array.from({length: layerSize}, () => Math.random()),
                biasGradient: Array.from({length: layerSize}, () => 0),
                reverseBiasGradient: Array.from({length: layerSize}, () => 0),
                weightedInputs: [], // weightedInputs of the output nodes
                activationValues: [], // activation values of the output nodes
                dead: []
            };
        })

        return this;
    }

    function ActivationFunct(a){
        return 1 / (1 + Math.exp(-a)); // sigmoid ...
        return a > 0 ? a : 0; // relu ...
    } 

    function ActivationFunctDerivative(a) { // if a gets too large we are screwed ... 
        const activation = 1 / (1 + Math.exp(-a)); // sigmoid ...
        return activation * (1 - activation); // sigmoid ...
        return a > 0 ? 1 : 0 // relu
    }

    function findFactor(a) {return a >= 0.1 ? 10 : a >= 0.01 ? 1 : a >= 0.001 ? 0.1 : a >= 0.0001 ? 0.01 : a >= 0.00001 ? 0.001 : a >= 0.000001 ? 0.0001 : 0.00001}

    NeuralNetwork.prototype.EvaluateCostDiff = function () {
        let csts = Array.isArray(this.previousCost) ? [...this.previousCost, this.totalCost] : [this.totalCost];

        if(csts.length === 3) {
            const max = 10;
            const grade = 10000 / findFactor(csts[2]);

            // if there is little difference between the values we will change the learnRate
            const diff = ((((csts[0] * grade) >> 1) + ((csts[1] * grade) >> 1)) / 2) - ((csts[2] * grade) >> 1);

            if(!diff) {
                const forPos = (this.learnRate > 0) ? 1 : -1;
                let newLearnRate = this.learnRate + (this.learnRate / max) * ((csts[2] < csts[0]) ? forPos : -forPos);
                if((newLearnRate < -max) || (newLearnRate > max) || (Math.abs(newLearnRate) < 0.00001)) newLearnRate = 0.01618 * max;
                this.learnRate = newLearnRate;
            }
        }

        this.previousCost = csts.length > 2 ? csts.slice(1) : csts;
    }

    /**
     * 
     * @param {*} input 
     */
    NeuralNetwork.prototype.forwardPropagation = function (input) {
        // run through allLayers
        this.allLayers.forEach((obj, inputLayerIndex) => {
            let activationValues = [], weightedInputs = [];
            // biases has same length as outputLayers + we need each bias so this is conveniant
            obj.biases.forEach((bias, outputNodeIndex) => {
                const activations = inputLayerIndex ? this.allLayers[inputLayerIndex - 1].activationValues : input;
                let weightedInput = bias; // weightedInput to a node = (sum of '((the activation value of a single input node) * weight)' for all input nodes + bias of outputNode)
                activations.forEach((inputActivation, activationIndex) => {
                    const index = activations.length * outputNodeIndex + activationIndex;
                    if(!obj.dead.includes(index)){
                        const weight = obj.weights[index];
                        weightedInput += (weight * inputActivation / activations.length); // if I don't devibe by activations.length the value of the weightedInput exceeds the value the sigmoid can accuratly handle so weights stop adjusting
                    }
                })
                weightedInputs.push(weightedInput);
                activationValues.push(ActivationFunct(weightedInput));
            })
    
            // update layer
            obj.activationValues = activationValues;
            obj.weightedInputs = weightedInputs;
        })
    }

    NeuralNetwork.prototype.backPropagation = function (input, expectedOutputs) {
        let oldNodeValues = [], reverseOldNodeValues = [];

        // go through the layers in reverse order - not sure reverse order is required here but well ...
        for(let layerIndex = this.allLayers.length - 1; layerIndex >= 0; layerIndex--){
            const obj = this.allLayers[layerIndex];
            let layerNodeValues = [], reverseLayerNodeValues = [];

            // loop over the numberOfOutputNodes
            obj.activationValues.forEach((outputLayerActivation, outputLayerActivationIndex) => {
                const activationDerivative = ActivationFunctDerivative(obj.weightedInputs[outputLayerActivationIndex]); // Da/Dz
                let nodeValue = 0, reverseNodeValue = 0;

                if(!oldNodeValues.length){ // for last layer
                    const costActivationDerivative = 2 * (outputLayerActivation - expectedOutputs[outputLayerActivationIndex]); // Dc/Da
                    const reverseCostActivationDerivative = 2 * (outputLayerActivation - (expectedOutputs[outputLayerActivationIndex] ? 0 : 1)); // Dc/Da rev
                    nodeValue = costActivationDerivative * activationDerivative;
                    reverseNodeValue = reverseCostActivationDerivative * activationDerivative;
                }else { // for not last layer
                    oldNodeValues.forEach((previousNodeValue, ind) => {
                        const index = oldNodeValues.length * outputLayerActivationIndex + ind;
                        if(!this.allLayers[layerIndex + 1].dead.includes(index)){
                            const partial = this.allLayers[layerIndex + 1].weights[index];
                            nodeValue += (partial * previousNodeValue); // dz/da
                            reverseNodeValue += (partial * reverseOldNodeValues[ind]); // dz/da rev
                        }
                    })
                    nodeValue *= activationDerivative; // da/dz
                    reverseNodeValue *= activationDerivative; // da/dz rev
                }

                // save nodeValues
                layerNodeValues.push(nodeValue);
                reverseLayerNodeValues.push(reverseNodeValue);

                // get the partial derivative, inputActivation * nodevalue along the weight
                const inputActivations = (this.allLayers[layerIndex - 1]?.activationValues || input);
                inputActivations.forEach((inputActivation, inputActivationIndex) => {
                    const index = inputActivations.length * outputLayerActivationIndex + inputActivationIndex;
                    if(!obj.dead.includes(index)){
                        const partialCostDerivative = inputActivation * nodeValue; // Dc/Dw
                        const reversePartialCostDerivative = inputActivation * reverseNodeValue; // Dc/Dw rev
                        // update weightGradient
                        obj.weightGradient[index] -= partialCostDerivative;
                        obj.reverseWeightGradient[index] -= reversePartialCostDerivative;
                    }
                })

                // update biasGradient
                obj.biasGradient[outputLayerActivationIndex] -= nodeValue; // since 1 * costDerivative * activationDerivative is the effect on the bias
                obj.reverseBiasGradient[outputLayerActivationIndex] -= reverseNodeValue; // ...
            })

            // now save the nodevalues
            oldNodeValues = layerNodeValues;
            reverseOldNodeValues = reverseLayerNodeValues;
        }
    }

    // can't think of what to do here
    NeuralNetwork.prototype.updateWeightsAndBiases = function (trainingSubsetLength) {
        const learnRateQuotient = this.learnRate / trainingSubsetLength;
        // const learnRateQuotient = 1 / trainingSubsetLength;

        // need to figure something out with the learnRate 

        /*console.log({
            previousCost: !this.previousCost ? [this.totalCost] : [...this.previousCost, this.totalCost],
            learnRate: this.learnRate
        }) */
    
        this.allLayers.forEach((obj, ind) => {
            // apply and update gradients
            obj.weightGradient.forEach((v, i) => { // v is the best possable change
                if(!obj.dead.includes(i)) {
                    const rv = obj.reverseWeightGradient[i]; // rv is the worst possable change
                    let vout = 0;
                    const range = Math.abs(v - rv) / trainingSubsetLength; // the abselute difference between worst and best - lets say this is 100%
                    // we could say that the learnRate is currently 1
                    // const ratio = v / rv; // the magnitude by which v > vr

                    if(range < 0.000000001618){ // if the values are too close, they are either where we want them | totally irrelevant
                        // add to breakConnectionList if ...
                        // gradient moves in same direction - i'll leave this // ((v < 0) ^ (rv < 0))
                        // breakConnectionList does not include i
                        // i is not dead
                        if(!this.breakConnectionList[ind].includes(i) && !obj.dead.includes(i)){
                            this.breakConnectionList[ind].push(i);
                        }
                    }else {
                        // same as before
                        vout = v * learnRateQuotient;
                        // remove from breakConnectionList
                        if(this.breakConnectionList[ind].includes(i)) {
                            this.breakConnectionList[ind] = this.breakConnectionList[ind].filter(a => a !== i);
                        }
                    }

                    obj.weights[i] += vout;
                    obj.weightGradient[i] = 0;
                    obj.reverseWeightGradient[i] = 0;
                }
            })
            obj.biasGradient.forEach((v, i) => { // v is the best possable change
                const rv = obj.reverseBiasGradient[i]; // rv is the worst possable change
                let vout = 0;

                const range = Math.abs(v - rv) / trainingSubsetLength; // the abselute difference between worst and best - lets say this is 100%
                // we could say that the learnRate is currently 1
                // const ratio = v / rv; // the magnitude by which v > vr
                
                if(range < 0.000000001618){
                    // if the values are too close, they are either where we want them | totally irrelevant
                    vout = 0;
                }else{
                    // same as before
                    vout = v * learnRateQuotient;
                }

                obj.biases[i] += vout;
                obj.biasGradient[i] = 0;
            })
        })
    }

    // choose 1 random connection to kill from the breakConnectionList list
    NeuralNetwork.prototype.killConnection = function(trainingData) {
        // make a large random whole number
        const rand = (Math.random() * 10000000) >> 1;
        // find the index of the array we want to select an index from, in the breakConnectionList
        const aInd = rand % this.breakConnectionList.length;
        // find the length of the array we want to select an index from
        const iLen = this.breakConnectionList[aInd]?.length;
        // ...
        if(iLen){
            // find the index we want to remove
            const wInd = this.breakConnectionList[aInd][rand % iLen];
            // cleanup - since either way this isn't needed in breakConnectionList anymore
            this.breakConnectionList[aInd] = this.breakConnectionList[aInd].filter(a => a !== wInd);
            // test 
            // run forward Pass through the trainingData to find an averageCost
            const before = this.predictAverageCost(trainingData);
            // set to Dead
            this.allLayers[aInd].dead.push(wInd);
            // run forward pass to find averageCost again
            const after = this.predictAverageCost(trainingData);
            // if the result gets worse we need this weight ...
            if(before < after){ // do I need to round the values here so that miniscule changes are ignored ??
                // revive ...
                this.allLayers[aInd].dead.pop();
            }
        }
    }

    NeuralNetwork.prototype.predictAverageCost = function(trainingData) {
        // find the cost
        let cost = 0;

        trainingData.forEach(obj => {
            this.forwardPropagation(obj.input);

            this.allLayers.slice(-1)[0].activationValues.forEach((val, i) => {
                cost += ((val - obj.output[i]) ** 2);
            })
        })

        return cost;
    }

    /**************Public API****************/
    /**
     * Save to file
     * @public
     */
    NeuralNetwork.prototype.save = function() {
        const allLayers = this.allLayers.map(obj => ({biases: obj.biases, weights: obj.weights}));
        saveFileData({allLayers, layers: this.layers, learnRate: this.learnRate, cycles: this.cycles}, 'basikNN'); 
    }

    /**
     * Load from file
     * @param {Object} data 
     * @public
     */
    NeuralNetwork.prototype.load = function(data) {
        const {allLayers, ...consts} = JSON.parse(data);
        Object.keys(consts).forEach(key => this[key] = consts[key]);
        this.allLayers = allLayers.map(obj => {
            return {
                activationValues : [],
                weightedInputs: [],
                weights: obj.weights,
                weightGradient: Array.from({length: obj.weights.length}, () => 0),
                reverseWeightGradient: Array.from({length: obj.weights.length}, () => 0),
                biases: obj.biases,
                biasGradient: Array.from({length: obj.biases.length}, () => 0),
                reverseBiasGradient: Array.from({length: obj.biases.length}, () => 0),
                dead: obj.dead || []
            }
        })
        this.breakConnectionList = [...consts.layers].slice(1).map(() => []);
    }

    /**
     * Given an input, predicts the output of the network.
     * If the output is supplied the cost will be logged.
     * @public
     * @param {Array} intput input values to the network.
     * @param {Array} output Actual output for the given input.
     * @returns {Array} output values of the network. 
     */
    NeuralNetwork.prototype.predict = function(input, output) {
        if (input.length !== this.layers[0]) {
            throw new Error('Length of input does not match.');
        }
        this.forwardPropagation(input);
        
        if(Array.isArray(output) && output.length === this.layers[this.layers.length - 1]){
            // find the cost
            let cost = 0;
            this.allLayers.slice(-1)[0].activationValues.forEach((val, i) => {
                cost += ((val - output[i]) ** 2);
            })
            this.cost = cost;
        }

        return this.allLayers.slice(-1)[0].activationValues;
    }

    /**
     * Use this function to train the network.
     * The trainingData should have the following format:
     * [
     *   { input: [...], output: [...] },
     *   ...
     * ]
     * @param {Array} trainingData 
     */
    NeuralNetwork.prototype.learn = function (trainingData) {
        // let chk = [0,0,0]; // test
        let trash = [];

        const slct  = 9; // to allow for EvaluateCostDiff to work

        // Learn it a couple of times.
        for (let i = 0; i < this.cycles; i++){
            let totalCost = 0; // cost accross all data points
            let trainingSubset = [];
            
            // **selective training** \\
            trainingData.forEach((a, ind) => {
                if([1, 3].includes(i % slct) && trash.includes(ind)) trainingSubset.push(a);
            })
            if(!trainingSubset.length) trainingSubset = trainingData;
            // **selective training** \\

            trash = [];
            trainingSubset.forEach((obj, ind) => {
                // Forward pass.
                this.predict(obj.input, obj.output);
                // Backward pass.
                this.backPropagation(obj.input, obj.output);
                // ...
                totalCost += this.cost;
                // given the cost how well did we do
                if((i % slct === 0) && this.cost > 0.8) trash.push(ind);
                else if((i % slct === 2) && this.cost > 0.4 && this.cost < 0.6 && trash.length < (trainingData.length >> 1)) trash.push(ind);
            })

            // the intention of the network is now to minimise this value
            this.totalCost = totalCost / trainingSubset.length; 

            // at this point I need to update the weights and biases
            this.updateWeightsAndBiases(trainingSubset.length);

            // to check if updating the learnRate would be beneficial
            this.EvaluateCostDiff(); 

            // try to remove weights - we need not attempt this for the times the trainingData was modified
            if((i % 99 === 77) && (i % slct) > 3) this.killConnection(trainingData);

            // ...
            if(i % 1 === 0) console.log(`${i} of ${this.cycles}`,{totalCost: this.totalCost});
        }
    }

    NeuralNetwork.prototype.info = function () {
        // Learn it a couple of times.
        console.log(this)
    }

    return NeuralNetwork;
})();

// sometimes something decreases perfectly but then gets bigger - probably because of the learnRate being too high ... - since I vary it quite a lot
// can we log the best vallue and then keep trying to improve theiron ?


// the way I heard gans described 
// made me think of something
// so for the descriminater we feed in the outputs of the generator
// so I wonder what if the ai asks our opinion ? - kinda tedious
// ok so we run 2 descriminators if they agree we assume they are right
// note we need to train them on some images first ...
// we then use gradient descent all the way back towards the generator
// ...
// we weould need to do this twice once for the discriminator
// so here we assume fake or real as 0 or 1 and since the discriminator wants to get more accurate 
// it needs to work towards either - so we train it with real and fake data seperatly somehow
// however the generator wants the descriminator to not know - so we would need to preform gradient descent
// for 0.5 as output and then only update the generators weights
// however I wonder is that correct since ultimatly it wants the generator to class the image as real
// since we are using gradient descent that means updating the generator so that
// it gets more accurate - so it's probably sensible to assume 1
// ... sumary 
// ... (and note that the binary cross entropy of the descriminator is used to update both in the wild ...)
// option1: train the descriminator first, then assume 1 and backprop through both networks
// option2: train descriminator and generator at same time, we save the descriminators weights...
//          and assume 0.5 as descriminator output to train the generator, 
//          for the descriminator we assume the value it is closer to - note to keep training it with fake and real data
// option3: use 2 descriminators do as in step 2 but assume the generators are correct if they have the same opinion
//          this way we always update the generator twice but only update the descriminators if they agree
// probs need to reduce
// 1px to a value between 1 and 0 or more likely -1 to +1 
// fine by me can do this per channel or per px ...
// - need to make image to 1D array by applying filters and whatnot (pooling) ------- image to 1D vector
// - and the reverse (upsampling) -------- 1D vector to image