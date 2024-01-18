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
                        nodeValue += (this.allLayers[layerIndex + 1].weights[oldNodeValues.length * outputLayerActivationIndex + ind] * previousNodeValue);
                    })
                    nodeValue *= activationDerivative;
                }

                // save nodeValues
                layerNodeValues.push(nodeValue);

                // get the partial derivative, inputActivation * nodevalue along the weight
                (obj.outputIndex > 1 ?  this.allLayers[layerIndex - 1].activationValues : input).forEach((inputActivation, inputActivationIndex) => {
                    const partialCostDerivative = inputActivation * nodeValue; // Dc/Dw
                    // update weightGradient
                    // - are the indecies here correct ...
                    obj.weightGradient[numberOfOutputNodes * inputActivationIndex + outputLayerActivationIndex] -= partialCostDerivative;
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
        // Forward pass.
        this.predict(input, output);

        // Backward pass.
        this.backPropagation(input, output);
    }

    /**
     * Use this function to train the network.
     * The train_data should have the following format:
     * [
     *   { input: [...], output: [...] },
     *   ...
     * ]
     * @param {Array} train_data 
     */
    NeuralNetwork.prototype.learn = function (train_data) {
        const learnRateQuotient = this.learnRate / train_data.length;
        // Learn it a couple of times.
        for (let i = 0; i < this.cycles; i++){
            let totalCost = 0; // cost accross all data points
            for (const obj of train_data) {
                this.learnSingle(obj.input, obj.output);
                totalCost += this.cost;
                // console.log({partialCost: this.cost}); // cost of previous itteration
            }

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
            this.totalCost = totalCost / train_data.length; // the intention of the network is now to minimise this value
            console.log({totalCost: this.totalCost})
        }
    }

    NeuralNetwork.prototype.info = function () {
        // Learn it a couple of times.
        console.log(this)
    }

    return NeuralNetwork;
})();