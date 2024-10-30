const { saveFileData } = require("../io/fileIO");

/*
    in this NN we take in the training data and select what datapoints we train 
    based on a gausian distribution of the cost.
    we also take one or more random points.
*/

module.exports = (function() {
    /**
     * construct a neural-network.
     * @public
     * @param {Array(Number)} layers an array of sizes for each of the layers.
     * @param {Array(Object)} trainingData ...
     * @param {Object} props 
     */
    function NeuralNetwork(layers, trainingData, props = null) {
        console.log({layers, trainingData, props})
        // set relavent parameters
        this.learnRate = props.learnRate || 0.001618// Math.PI / 10;
        this.cycles = props.cycles || 1024;
        this.breakConnectionList = [...layers].slice(1).map(() => []);
        this.gausDistNums = props.findG || 9;
        this.randDistNums = props.findR || 1;
        this.adjustOnce = !!props.adjustOnce;
        this.trainingForNum = props.trainingForNum;
        this.increment = 0.0000001618; // 0.0001618

        // check layers
        let layersAreOk = true;

        if(Array.isArray(layers)){
            layers.forEach(val => {
                if(layersAreOk && typeof val !== 'number' || val < 1 || Math.floor(val) !== val) layersAreOk = false;
            })
        }else layersAreOk = false;

        if(layersAreOk) this.layers = layers;
        else return null;

        // check trainingData
        let trainableData = [];
        trainingData.forEach(obj => {
            if(obj.input.length === layers[0] && obj.output.length === layers[layers.length - 1]) trainableData.push(obj);
        })
        this.trainableData = trainableData;

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

    // a random function where we get the same amount of possable outputs as the input number // since Math.random() gives : (0 <= v < 1) 
    const findRandom = (n) => (2 * n) % (Math.floor(Math.random() * n * 2 + 1));

    /**
     * find the locations of the gausian distribution
     * @returns an array of locations in trainableData
     */
    NeuralNetwork.prototype.findGausian = function () {
        // first we need to distribute the values, so costDist = [[cost, locationInTrainableData], ...]
        let costDist = [];
        this.trainableData.forEach((obj, i) => {
            this.predict(obj.input, obj.output);
            costDist.push([this.cost ,i]);
        })

        // then we sort costDist according to the cost and save for reference
        costDist.sort((a, b) => a[0] - b[0]);
        console.log({costDist});
        this.costDist = costDist;

        // then we select the specified amount of values (gausDistNums) and return the trainable Datapoints
        let out = [];
            // lets cheat here and do something quick
        const step  = Math.floor(costDist.length / this.gausDistNums);
        for(let i = 0; i < this.gausDistNums; i++) out.push(this.trainableData[costDist[i * step][1]]);
        return out;
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
                        weightedInput += (weight * inputActivation / activations.length); // if I don't devide by activations.length the value of the weightedInput exceeds the value the sigmoid can accuratly handle so weights stop adjusting
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

    // Manually go through the network and adjust the values for a single data set -- kinda long winded so I need to restrict the use
    NeuralNetwork.prototype.manualLearn = function(datapoint) {
        // needs to edit and test the weight or bias
        const testAndUpdate = ({weight, bias, index, loc}) => {
            let costArr = [];
            for(let i = -1; i < 2; i++){
                const toAdd = (i === -1 ? -1 : 1) * this.increment;
                // edit selected weight or bias
                if(weight) this.allLayers[index].weights[loc] += toAdd;
                else if(bias) this.allLayers[index].biases[loc] += toAdd;
                costArr.push(this.predictAverageCost([datapoint]));
            } // at this point the value is set at +1
            // filter costArr by lowest or ...
            const best = ((costArr[0] < costArr[1]) && (costArr[0] < costArr[2])) ? -2 : (costArr[2] < costArr[0]) && (costArr[2] < costArr[1]) ? 0 : -1;
            if(best !== 0) {
                // update weights and biases
                if(weight) {
                    const oldWeight = this.allLayers[index].weights[loc];
                    const newWeight = oldWeight + (best * this.increment);
                    if(Math.abs(newWeight) <= 1){
                        this.allLayers[index].weights[loc] = newWeight;
                    }else if(Math.abs(newWeight) > 10){
                        // console.log("reset weight", newWeight, oldWeight / 10 + (best * this.increment));
                        // this causes a spontanious reset issue in weights ...
                        this.allLayers[index].weights[loc] = oldWeight / 10 + (best * this.increment);
                    }
                }
                else if(bias) {
                    const oldBias = this.allLayers[index].biases[loc];
                    const newBias = oldBias + (best * this.increment);
                    if(Math.abs(newBias) <= 1){
                        this.allLayers[index].biases[loc] = newBias;
                    }else if(Math.abs(newBias) > 10){
                        console.log("reset bias", newBias, oldBias / 10 + (best * this.increment));
                        // this causes a spontanious reset issue in biases ...
                        this.allLayers[index].biases[loc] = oldBias / 10 + (best * this.increment);
                    }
                }
            }
        }

        // need to loop through all weights and all biases
        this.allLayers.forEach(({weights, biases}, index) => {
            biases.forEach((bias, loc) => {
                testAndUpdate({bias, index, loc});
            })
            weights.forEach((weight, loc) => {
                testAndUpdate({weight, index, loc});
            })
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
        saveFileData({
            allLayers, 
            layers: this.layers, 
            learnRate: this.learnRate, 
            cycles: this.cycles, 
            itr: this.itr,
            gausDistNums: this.gausDistNums,
            randDistNums: this.randDistNums,
            trainableData: this.trainableData,
            trainingForNum: this.trainingForNum
        }, `ir-${this.trainingForNum}-gaus`); 
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
            console.log(input.length, this.layers[0])
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

        return this.allLayers.slice(-1)[0].activationValues.map((v, i) => [Math.floor(v * 1000)/ 10, i + 1]).sort((a, b) => b[0] - a[0]);
    }

    /**
     * Use this function to train the network.
     */
    NeuralNetwork.prototype.learn = function () {
        for(let n = 0; n < 100; n++){ // for speed ?
            // select subset of datapoints to train on 
            let trainingSubset = this.findGausian();

            // note worst training subset
            const worst = trainingSubset[trainingSubset.length - 1];

            // add some random subsets
            for(let i = 0; i < (this.randDistNums); i++) {
                trainingSubset.push(this.trainableData[findRandom(this.trainableData.length)]);
            }

            // Learn a couple of times.
            for (let i = 0; i < this.cycles; i++){
                let totalCost = 0; // cost accross all data points

                trainingSubset.forEach((obj, ind) => {
                    // Forward pass.
                    this.predict(obj.input, obj.output);
                    // Backward pass.
                    this.backPropagation(obj.input, obj.output);
                    // ...
                    totalCost += this.cost;
                })

                // the intention of the network is now to minimise this value
                this.totalCost = totalCost / trainingSubset.length; 

                // at this point I need to update the weights and biases
                if(!this.previousCost || (this.previousCost.length < 2 || this.previousCost[1] > this.totalCost)){ //update only when cost decreases
                    this.updateWeightsAndBiases(trainingSubset.length);
                    this.itr = 1 + (this.itr || 0);
                }else {
                    this.learnRate = (Math.round(Math.random()) < 1 ? -10 : 10) * Math.random();
                }

                // ...
                if(i % 1000 === 0) console.log(`${n}% & ${i} of ${this.cycles}`,{totalCost: this.totalCost});
            }

            if(this.adjustOnce) this.manualLearn(worst);
        }
    }

    NeuralNetwork.prototype.info = function () {
        // Learn it a couple of times.
        console.log(this)
    }

    return NeuralNetwork;
})();
