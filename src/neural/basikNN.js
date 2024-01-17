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
                biases: Array.from({length: layerSize}, () => Math.random()),
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

    function calcCst(actvatd, expctd) {
        let out = 0;
        actvatd.forEach(a => {
            expctd.forEach(e => {
                out += (a - e);
            })
        })
        return out / expctd.length;
    }

    NeuralNetwork.prototype.forwardPropagation = function (input) {
        this.allLayers.forEach((obj, inputLayerIndex) => {
            let newActivationValues = [], newWeightedInputs = [];
            

            obj.biases.forEach((bias, outputNodeIndex) => {
                let weightedInputSum = 0; // sum of the weights * activations

                const activations = inputLayerIndex ? this.allLayers[inputLayerIndex - 1].activationValues : input;
                activations.forEach((inputLayerActivation, activationIndex) => {
                    const weight = obj.weights[activations.length * outputNodeIndex + activationIndex]; // #### at this point I want to note that if the weights were ordered from the output layer to the input layer instead ([00,10,20,30,...] rather than the current [00,01,02,03,...]) then this step would be really simple since I would need to multiply all weights[?] * the output nodeValue
                    const weightedInput = weight * inputLayerActivation;
                    weightedInputSum += (weightedInput / activations.length);
                })
    
                // add bias
                weightedInputSum += (bias / obj.biases.length)  // try average
                newWeightedInputs.push(weightedInputSum);
    
                let newActivation = ActivationFunct(weightedInputSum);
                //console.log({newActivation, weightedInputSum}); // ... < 1 && > 0
                newActivationValues.push(newActivation);
            })
    
            // update activationvalues
            obj.activationValues = newActivationValues;
            obj.weightedInputs = newWeightedInputs;
        })
    }

    NeuralNetwork.prototype.backPropagation = function (input, expectedOutputs) {
        let oldNodeValues = [];

        // go through the layers in reverse order - not sure reverse order is required here but well ...
        for(let layerIndex = this.allLayers.length - 1; layerIndex >= 0; layerIndex--){
            const obj = this.allLayers[layerIndex];
            
            const inputNodeCount = this.layers[obj.outputIndex - 1];
            const outputNodeCount = this.layers[obj.outputIndex];

            let layerNodeValues = [];
//*
            // loop over the outputNodeCount
            for(let i = 0; i < outputNodeCount; i++){
                let nodeValue = 0;
                const activationDerivative = ActivationFunctDerivative(obj.weightedInputs[i]) // Da/Dz

                //*
                if(!layerIndex){ // for last layer
                    const cst = calcCst(obj.activationValues, expectedOutputs)
                    // console.log({cst})

                    const costDerivative = 2 * cst; // Dc/Da
                    nodeValue = costDerivative * activationDerivative;
                }else {
                    // calculate node values for any layer that is not the last layer
                    //*
                    for(let j = 0; j < oldNodeValues.length; j++){
                        nodeValue += (this.allLayers[layerIndex - 1].weights[i * oldNodeValues.length + j] * oldNodeValues[j])
                    } //*/
                    nodeValue *= activationDerivative;
                } //*/

                //*
                layerNodeValues.push(nodeValue);

                for(let j = 0; j < inputNodeCount; j++){
                    // get the partial derivative : Dc/Dw
                    
                    const weightCostDerivative = (obj.outputIndex > 1 ?  this.allLayers[layerIndex - 1].activationValues[j] : input[j]) * nodeValue;
                    obj.weights[j * outputNodeCount + i] -= (this.learnRate * weightCostDerivative)
                } //*/

                // update biases
                obj.biases[i] -= (nodeValue * this.learnRate) // since 1 * costDerivative * activationDerivative is the effect on the bias
            }
//*/
            // now save the nodevalues
            oldNodeValues = layerNodeValues;
        }
    }

    /**************Public API****************/
    /**
     * Visilize the network in JSON.
     * @public
     * @returns a JSON representation of the network.
     */
    NeuralNetwork.prototype.toJson = function() {
        //console.log(this);
        return JSON.stringify(this, null, 4);
    }

    NeuralNetwork.prototype.onLoad = function(data) {
        //console.log(data);
        const obj = JSON.parse(data)
        Object.keys(obj).forEach(key => this[key] = obj[key]); // do please test this
    } // test this please since I don't really know how this works

    /**
     * Given an input, predicts the output of the network.
     * This method is also used in forward propagation.
     * @public
     * @param {Array} intput input values to the network.
     * @returns {Array} output values of the network. 
     */
    NeuralNetwork.prototype.predict = function(input) {
        if (input.length !== this.layers[0]) {
            throw new Error('Length of input does not match.');
        }
        this.forwardPropagation(input);
        return this.activationValues.slice(-1);
    }

    /**
     * 
     * @param {Array} input Input to the network. 
     * @param {Array} output Actual output.
     */
    NeuralNetwork.prototype.learnSingle = function(input, output) {
        // Forward pass.
        this.predict(input);

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
    NeuralNetwork.prototype.learn = function (train_data) { // not learning over the entire training set but individually ...
        // Learn it a couple of times.
        for (let i = 0; i < this.cycles; i++)
            for (const obj of train_data) {
                this.learnSingle(obj.input, obj.output);
            }
    }

    NeuralNetwork.prototype.info = function () {
        // Learn it a couple of times.
        console.log(this)
    }

    return NeuralNetwork;
})();