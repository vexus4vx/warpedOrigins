const { saveFileData } = require("../io/fileIO");

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
                biases: Array.from({length: layerSize}, () => Math.random()),
                biasGradient: Array.from({length: layerSize}, () => 0),
                weightedInputs: [], // weightedInputs of the output nodes
                activationValues: [], // activation values of the output nodes
                outputIndex: layerIndex + 1 // the output layers index in this.layers
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
                let newLearnRate = this.learnRate + (this.learnRate / 100) * ((csts[2] < csts[0]) ? 1 : -1);
                if((newLearnRate < -max) || (newLearnRate > max) || (Math.abs(newLearnRate) < 0.00000001)) newLearnRate = 0.01618 * max;
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
                    const weight = obj.weights[activations.length * outputNodeIndex + activationIndex];
                    weightedInput += (weight * inputActivation);
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
        let oldNodeValues = [];

        // go through the layers in reverse order - not sure reverse order is required here but well ...
        for(let layerIndex = this.allLayers.length - 1; layerIndex >= 0; layerIndex--){
            const obj = this.allLayers[layerIndex];
            // const numberOfInputNodes = this.layers[obj.outputIndex - 1];
            const numberOfOutputNodes = this.layers[obj.outputIndex]; // === obj.activationValues.length
            let layerNodeValues = [];

            // loop over the numberOfOutputNodes
            obj.activationValues.forEach((outputLayerActivation, outputLayerActivationIndex) => {
                const activationDerivative = ActivationFunctDerivative(obj.weightedInputs[outputLayerActivationIndex]); // Da/Dz
                let nodeValue = 0;

                if(!oldNodeValues.length){ // for last layer
                    const costActivationDerivative = 2 * (outputLayerActivation - expectedOutputs[outputLayerActivationIndex]); // Dc/Da
                    nodeValue = costActivationDerivative * activationDerivative;
                }else { // for not last layer
                    oldNodeValues.forEach((previousNodeValue, ind) => {
                        nodeValue += (this.allLayers[layerIndex + 1].weights[oldNodeValues.length * outputLayerActivationIndex + ind] * previousNodeValue); // dz/da
                    })
                    nodeValue *= activationDerivative; // da/dz
                }

                // save nodeValues
                layerNodeValues.push(nodeValue);

                // get the partial derivative, inputActivation * nodevalue along the weight
                const inputActivations = (this.allLayers[layerIndex - 1]?.activationValues || input);
                inputActivations.forEach((inputActivation, inputActivationIndex) => {
                    const partialCostDerivative = inputActivation * nodeValue; // Dc/Dw
                    // update weightGradient
                    obj.weightGradient[inputActivations.length * outputLayerActivationIndex + inputActivationIndex] -= partialCostDerivative;
                })

                // update biasGradient
                obj.biasGradient[outputLayerActivationIndex] -= nodeValue; // since 1 * costDerivative * activationDerivative is the effect on the bias
            })

            // now save the nodevalues
            oldNodeValues = layerNodeValues;
        }
    }

    /**************Public API****************/
    /**
     * Save to file
     * @public
     */
    NeuralNetwork.prototype.save = function() {
        const allLayers = this.allLayers.map(obj => ({biases: obj.biases, weights: obj.weights, outputIndex: obj.outputIndex}));
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
                biases: obj.biases,
                biasGradient: Array.from({length: obj.biases.length}, () => 0)
            }
        })
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
     * run's a single datapoint through the network
     * @param {Array} input Input to the network. 
     * @param {Array} output Actual output.
     */
    NeuralNetwork.prototype.learnSingle = function(input, output) {
        //console.time('kkk')
        // Forward pass.
        this.predict(input, output);

        // Backward pass.
        this.backPropagation(input, output);
        //console.timeEnd('kkk')
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
        let chk = [0,0,0]; // test
        let trash = [];

        // lets log the best preforming and try head forward from there ...
        // - what if you never get out of local minima ... so add a counter and try say 30 times ...

        const slct  = 9; // to allow for EvaluateCostDiff to work

        // Learn it a couple of times.
        for (let i = 0; i < this.cycles; i++){
            let totalCost = 0; // cost accross all data points
            let trainingSubset = [];
            
            // **selective training** \\
            trainingData.forEach((a, ind) => {
                if((i % slct === 1) && trash.includes(ind)) trainingSubset.push(a); 
                else if((i % slct === 3) && trash.includes(ind)) trainingSubset.push(a);
            })
            if(!trainingSubset.length) trainingSubset = trainingData;
            // **selective training** \\

            trash = [];
            trainingSubset.forEach((obj, ind) => {
                this.learnSingle(obj.input, obj.output);
                totalCost += this.cost;
                // given the cost how well did we do
                if((i % slct === 0) && this.cost > 0.8) trash.push(ind);
                else if((i % slct === 2) && this.cost > 0.4 && this.cost < 0.6 && trash.length < (trainingData.length >> 1)) trash.push(ind);
            })

            const learnRateQuotient = this.learnRate / trainingSubset.length

            // at this point I need to update the weights and biases
            this.allLayers.forEach(obj => {
                // apply and update gradients
                obj.weightGradient.forEach((v, i) => {
                    obj.weights[i] += (v * learnRateQuotient);
                    obj.weightGradient[i] = 0;
                })
                obj.biasGradient.forEach((v, i) => {
                    obj.biases[i] += (v * learnRateQuotient);
                    obj.biasGradient[i] = 0;
                })
            })
            this.totalCost = totalCost / trainingSubset.length; // the intention of the network is now to minimise this value
            this.EvaluateCostDiff(); // to check if updating the learnRate would be beneficial

            if(!chk[0] && this.totalCost < 0.1) chk[0] = i+1; // test
            if(!chk[1] && this.totalCost < 0.01) chk[1] = i+1; // test
            if(!chk[2] && this.totalCost < 0.001) chk[2] = i+1; // test

            // ...
            console.log(`${i} of ${this.cycles}`,{totalCost: this.totalCost, chk});

            // kill switch
            if(this.kill){
                console.log(this.kill)
                this.kill = null;
                i = this.cycles;
            }
        }
    }

    NeuralNetwork.prototype.info = function () {
        // Learn it a couple of times.
        console.log(this)
    }

    return NeuralNetwork;
})();

// consider running a network and focusing on the data it gets wrong so 
// if for an xor 00, 01 and 10 are correct why not focus on 11 in the next cycle by taking the 
// trainingData and modifying it to select for its weaknesses
// note that at least 1 sample should have a certian degree of accuracy 
// otherwise everything will turn into 0.5
// so we could focus on the actual trainingData every third step 
// for another third if some of the data is correct (cost < 0.35) lets focus on the weaknesses
// for the final third bias the trainingData towards a random sample or a number of samples

// next maybe have 2 networks with opposite that is inverted inputs (a => 1 - a)
// we will then run the networks a few times and then start kulling connections (weights)
// or neurons in the hidden layers (biases + connecting weights) that are equally active for both
// test if doing this is of any benifit

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