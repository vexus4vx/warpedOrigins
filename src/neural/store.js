import { create } from 'zustand';
const DEBUGs = 0;
const DEBUGf = 0;
const DEBUGb = 0;

export const neuralNetworkStore = create(set => ({
    input: [0, 1], //[1, 2, 10, 18, 32, 34, 11,1, 7, 8, 16, 32, 39, 40,4, 7, 9, 12, 21, 42, 41].map(a => (a - 1) / 46),
    weightsAndBiases: {},
    nudge: 0.00001,
    semiStaticData: {  
        layers: [2, 1],// [3, 4, 2],//[100, 47],
        learnRate: 0.1
    },
    // ActivationFunct: (a) => a <= 0 ? 0 : (a / 100) > 1 ? 1 : a / 100,
    // ActivationFunctDerivative: (a) => (a <= 0) || ((a / 100) > 1) ? 0 : 0.01,
    ActivationFunct: (a) => 1 / (1 + Math.exp(-a)),
    //        a / (1 + Math.exp(-a))        ||       (Math.exp(2*a) - 1) / (Math.exp(2*a) + 1)     ||      
    ActivationFunctDerivative: (a) => {
        const activation = 1 / (1 + Math.exp(-a));
        return activation * (1 - activation);
    },
    setState: ({layers, learnRate, ActivationFunct, weights, biases, ...obj}) => {
        console.log('setState')
        if(layers || learnRate || weights || biases){
            set(state => {
                let toSet = {}
                if(layers || learnRate){
                    let semiStatic = state.semiStaticData
                    if(layers) semiStatic.layers = layers
                    if(learnRate) semiStatic.learnRate = learnRate
                    toSet.semiStaticData = semiStatic
                }
                if(weights || biases){
                    toSet.weightsAndBiases = {
                        weights: weights || state.weightsAndBiases.weight, 
                        biases: biases || state.weightsAndBiases.biases
                    }
                }

                return {...obj, ...toSet}
            })
        }else set(state => ({...obj}))
    },
    Cost: ({input, expectedOutputs, newWeight, newBias}) => {
        console.log('Cost')
        let allCost = 0
        set(state => {
            const layers = state.semiStaticData.layers
            let {weights, biases} = state.weightsAndBiases
            const neuralSegment = state.neuralSegment

            if(newWeight) weights[newWeight.k][newWeight.index] += state.nudge
            if(newBias) biases[newBias.k][newBias.outputNode] += state.nudge

            input.forEach(node => {
                let nodesIn = [node]
                layers.forEach((nodesOut, k) => {
                    nodesIn = neuralSegment({nodesIn, nodesOut, weights: weights[k], biases: biases[k]}).activationVals
                });
                let cst = 0
                nodesIn.forEach((nodeOut, k) => {
                    cst += ((nodeOut - expectedOutputs[k]) ** 2)
                })
                allCost += cst
            })

            return {}
        })
        return allCost / input.length
    },
    NodeCostDerivative: (activationValue, expectedOutput) => {
        return (expectedOutput - activationValue) ** 2;
    },
    learnInefficiently: (trainingData) => {
        console.log('learnInefficiently')
        set(state => {
            const {layers, learnRate} = state.semiStaticData
            const {weights, biases} = state.weightsAndBiases
            const Cost = state.Cost

            const cost = (obj) => Cost({...trainingData, ...obj})

            const originalCost = cost()
            let weightedGradient = layers.map(a => []), biasedGradient = [...weightedGradient]

            layers.forEach((nodesOut, k) => {
                for(let nodesIn = 0; nodesIn < (k === 0 ? trainingData.input.length : layers[k - 1]); nodesIn++){
                    for(let outputNode = 0; outputNode < nodesOut; outputNode++){
                        let index = nodesIn * nodesOut + outputNode
                        let costDifference = cost({newWeight: {k, index}}) - originalCost
                        weightedGradient[k].push(weights[k][index] - (learnRate * costDifference / state.nudge))
                    }
                }
        
                for(let outputNode = 0; outputNode < nodesOut; outputNode++){
                    let costDifference = cost({newBias: {k, outputNode}}) - originalCost
                    biasedGradient[k].push(biases[k][outputNode] - (learnRate * costDifference / state.nudge))
                }
            })

            return {weightsAndBiases: { weights: weightedGradient, biases: biasedGradient }}
        })
    },
    neuralSegment: ({nodesIn, nodesOut, weights, biases}, thenRun) => { // a single layer
        // console.log('neuralSegment',{nodesIn, nodesOut, weights, biases, thenRun})
        let activationVals = []
        let weightedInputs = []
        set(state => {
            const ActivationFunct = state.ActivationFunct
            for(let i = 0; i < nodesOut; i++){
                let weightedInput = biases[i]
                nodesIn.forEach((v, k) => {
                    weightedInput += (v * weights[i * nodesIn.length + k])
                })
                weightedInputs.push(weightedInput)
                activationVals.push(ActivationFunct(weightedInput))
            }
            return {}
        })
        if(thenRun) thenRun(activationVals, weightedInputs)
        return {activationVals, weightedInputVals: weightedInputs}
    },
    setWeightsAndBiases: () => {
        set(state => {
            const layers = state.semiStaticData.layers
            let weightsAndBiases = {...state.weightsAndBiases}
            let ran = 0
            
            if(!weightsAndBiases.weights || weightsAndBiases.weights.length !== layers.length){
                let randomWeights = [], nodesIn = state.input.length
        
                layers.forEach(nodesOut => {
                    randomWeights.push(Array.from({length: nodesIn * nodesOut}, () => Math.random()))
                    nodesIn = nodesOut
                })
                weightsAndBiases.weights = randomWeights
                ran++
            }

            if(!weightsAndBiases.biases || weightsAndBiases.biases.length !== layers.length){
                let randomBiases = []
        
                layers.forEach(nodesOut => {
                    randomBiases.push(Array.from({length: nodesOut}, () => Math.random()))
                })
                weightsAndBiases.biases = randomBiases
                ran++
            }

            console.log(ran, '<= have weightsAndBiases been set ?', weightsAndBiases)
            return ran ? {weightsAndBiases} : {}
        })
    },
    NeuralNetwork: (askForValidation, predictOutput) => {
        console.log('NeuralNetwork')
        set(state => {
            state.setWeightsAndBiases()
            return {}
        })

        set(state => {
            const layers = state.semiStaticData.layers
            const input = state.input
            let activationValues = [], weightedInputs = []

            const adjustData = ({userInput, prediction, learn}) => {
                let cost = state.Cost({input, expectedOutputs: userInput}) // calculate cost
                console.log({cost})
    
                console.log(`Largest probability: ${JSON.stringify(predictOutput(prediction))}`) // find largest probability
    
                // learn ... -- set this
                if(learn){
                    state.learnInefficiently({input, expectedOutputs: userInput})
                }
            }

            let nodesIn = [...input]
            layers.forEach((nodesOut, k) => {
                const {activationVals, weightedInputVals} = state.neuralSegment({nodesIn, nodesOut, weights: state.weightsAndBiases.weights[k], biases: state.weightsAndBiases.biases[k]}, ((k === (layers.length - 1)) && (typeof askForValidation === 'function')) ? (prediction) => askForValidation(prediction, adjustData) : null)
                nodesIn = activationVals
                
                if(!askForValidation) {
                    activationValues.push(activationVals)
                    weightedInputs.push(weightedInputVals)
                }
            });

            return {activationValues, weightedInputs}
        })
    },
    /* from video */
    activationValues: [], // [[], [], ...] same length and map as layers
    weightedInputs: [], // [[], [], ...] same length and map as layers
    /* my try */
    
    // need - layers, input
    // layers -> [num, num, num, ...] // describes the length of each layer after the initial layer - min lenght 1
    // input -> [num, num, num, ...] // the nodeValues of the initial layer - min length 1
    // secondary need - weights, biases
    // weights -> [[weights so that the first n (where n === length of current layer (output layer)) numbers are the weights between the first input Node and the respectiive output node (length === input layer * output layer)], [...], [...], ...] // same lenght as layers
    // biases -> [[biases for each node in this layer (lenght === lenght of current layer)], [...], [...], ...] // same lenght as layers
    // - activation the value of the node  --- collectively same size as biases except that this is an array of numbers (change biases to this too ?)
    // - 
    setupNetwork: (trainingData) => {
        // check for layers and input
        let expectedOutputLength, layers, input;
        set(state => {
            expectedOutputLength = state.semiStaticData.layers[state.semiStaticData.layers.length - 1];
            input = state.input;
            layers = state.semiStaticData.layers;
            return {}
        })

        if(DEBUGs) console.log('Try Setup', {expectedOutputLength, layers, input})

        if(!layers.length || !input.length) {
            console.log(!layers.length && input.length ? 'set up layers' : layers.length && !input.length ? 'set up input' : 'set up layers and inputs');
            return null;
        };

        if(trainingData) {
            if(DEBUGs) console.log('Try Train', trainingData)

            // check for data set match to current layer and input schema
            if(typeof trainingData !== 'object' || !trainingData.length){
                console.log('Training Failed - no data')
                return null
            }

            let verifiedTrainingData = [];

            trainingData.forEach(obj => {
                if((obj.input.length === input.length) && (obj.expectedOutputs.length === expectedOutputLength)) verifiedTrainingData.push(obj)
            })

            if(!verifiedTrainingData.length) {
                console.log('Training Failed - currupted data');
                return null;
            }

            // check / set up weights and biases
            set(state => {
                state.setWeightsAndBiases()
                return {}
            })

            if(DEBUGs) console.log('Training setup complete - Now Backprop')

            // train system
            set(state => {
                for(let i = 0; i < 1; i++){
                    state.backPropagation({verifiedTrainingData, layers})
                }
                return {}
            })
        }else {
            if(DEBUGs) console.log('Try Run Network')

            // check / set up weights and biases
            set(state => {
                state.setWeightsAndBiases()
                return {}
            })

            set(state => {
                state.forwardPropagation({layers, input})
                return {}
            })
        }
    },
    forwardPropagation: ({layers, input}) => {
        console.log('forwardPropagation')
        if(DEBUGf) console.log({layers, input})

        // get weights and biases
        let weights = [], biases = [], activationFunction;
        set(state => {
            const obj = state.weightsAndBiases;
            weights = [...obj.weights];
            biases = [...obj.biases];
            activationFunction = state.ActivationFunct;
            return {}
        })

        if(DEBUGf) console.log({weights, biases, activationFunction})

        // go through every layer and record the activations
        let allActivations = [], weightedInputs = []
        let activationValues = input;
        layers.forEach((outputLayerSize, layerIndex) => { // layerIndex === inputLayerIndex
            let newActivationValues = [], newWeightedInputs = [];
            // the new activationValue for this index is calculated as follows
            // -> activationFunction( inputActivation0 * weightBetween[0 in and current out] + inputActivation1 * weightBetweenTheNodes[1 in and current out] + ... + inputActivationFinal * weightBetweenTheNodes[final in and current out] + biasForOutputNode )

            
            for(let outputNodeIndex = 0; outputNodeIndex < outputLayerSize; outputNodeIndex++){
                let weightedInputSum = 0; // sum of the weights * activations

                activationValues.forEach((inputLayerActivation, activationIndex) => {
                    // [00,01,02,03,04,10,12,13,14,20,21,22,23,24] // what weights[layerIndex] look like if layer has 3 inputs and 5 outputs
                    // the ones I need here are [00, 10, 20]
                    const weight = weights[layerIndex][activationValues.length * outputNodeIndex + activationIndex] // #### at this point I want to note that if the weights were ordered from the output layer to the input layer instead ([00,10,20,30,...] rather than the current [00,01,02,03,...]) then this step would be really simple since I would need to multiply all weights[?] * the output nodeValue
                    const weightedInput = weight * inputLayerActivation // might need these for backpropagation
                    weightedInputSum += weightedInput
                })

                // add bias
                weightedInputSum += biases[layerIndex][outputNodeIndex]
                newWeightedInputs.push(weightedInputSum)

                let newActivation = activationFunction(weightedInputSum)
                newActivationValues.push(newActivation)
            }

            // update activationvalues
            activationValues = newActivationValues;
            allActivations.push(newActivationValues);
            weightedInputs.push(newWeightedInputs);
            newActivationValues = [];
            newWeightedInputs = [];
        })

        if(DEBUGf) console.log({allActivations, weightedInputs})

        // save allActivations since we need this for backpropagation
        set(state => { return {activationValues: allActivations, weightedInputs} })

        console.log(activationValues, {weights, biases}) // resulting activations on final layer
    },
    backPropagation: ({verifiedTrainingData, layers, learnrate = 0.1618}) => {
        console.log('backPropagation')
        const learnRateAverage = -learnrate / verifiedTrainingData.length;
        let weights, biasNudges, weightNudges, ActivationFunctDerivative;

        set(state => { 
            const obj = state.weightsAndBiases;
            weights = [...obj.weights];
            biasNudges = obj.biases.map(arr => arr.map(v => v));
            weightNudges = obj.biases.map(arr => arr.map(v => v));
            ActivationFunctDerivative = state.ActivationFunctDerivative;
            return {} 
        })

        // loop through the training subsets
        verifiedTrainingData.forEach(obj => {
            // forward pass sets the weightedInputs and cativationValues
            set(state => {
                state.forwardPropagation({layers, input: obj.input})
                return {}
            })

            // now get these that have been set by runnung the forward pass
            let activationValues, weightedInputs;

            set(state => {
                activationValues = [...state.activationValues]//.reverse();
                weightedInputs = [...state.weightedInputs]//.reverse();
                return {}
            })

            let oldNodeValues = [];

            // go through the layers in reverse order - not sur reverse order is required here but well ...
            [...layers].reverse().forEach((numOfNodesInLayer, layerIndex) => {
                const forwardLayerIndex = layers.length - 1 - layerIndex; // the current layerIndex (unreversed)
                const inputNodeCount = layers[forwardLayerIndex - 1] || obj.input.length // [layers.length - 1 - layerIndex - 1]
                const outputNodeCount = numOfNodesInLayer; // === layers[forwardLayerIndex]

                let layerNodeValues = [];

                // console.log({forwardLayerIndex}, layerIndex)

                // loop over the outputNodeCount
                for(let i = 0; i < outputNodeCount; i++){

                    // console.log(weightedInputs[forwardLayerIndex], {weightedInputs, forwardLayerIndex, i}, weightedInputs[forwardLayerIndex][i])
                    
                    let nodeValue = 0;
                    const activationDerivative = ActivationFunctDerivative(weightedInputs[forwardLayerIndex][i]) // Da/Dz

                    if(!layerIndex){ // last layer calculations
                        // calculate nodeValues for this layer - which is actually just : (Da/Dz * Dc/Da)
                        const costDerivative = 2 * (activationValues[forwardLayerIndex][i] - obj.expectedOutputs[i]) // Dc/Da
                        nodeValue = costDerivative * activationDerivative;
                    }else {
                        // calculate node values for any layer that is not the last layer

                        for(let j = 0; j < oldNodeValues.length; j++){
                            nodeValue += (weights[forwardLayerIndex][i * oldNodeValues.length + j] * oldNodeValues[j])
                        }
                        nodeValue *= activationDerivative; // is this ok ? or do we need the sum of the activations that hit this node ?
                    }

                    layerNodeValues.push(nodeValue);

                    // update biases
                    // setNudges({biasVal: nodeValue * learnRateAverage, bLoc: [forwardLayerIndex, i] });
                    biasNudges[forwardLayerIndex][i] -= (nodeValue * learnRateAverage) // since 1 * costDerivative * activationDerivative is the effect on the bias
                }

                // lets quickly update the weights
                // [00,01,02,03,04,10,12,13,14,20,21,22,23,24] // what weights[layerIndex] look like if layer has 3 inputs and 5 outputs
                for(let i = 0; i < inputNodeCount; i++){
                    for(let j = 0; j < outputNodeCount; j++){
                        // get the partial derivative : Dw/Dc   
                        const weightCostDerivative = (forwardLayerIndex ?  activationValues[forwardLayerIndex - 1][i] : obj.input[i]) * layerNodeValues[j]; 
                        weightNudges[forwardLayerIndex][i * outputNodeCount + j] -= (learnRateAverage * weightCostDerivative)
                        // setNudges({weightVal: learnRateAverage * weightCostDerivative, wLoc: [forwardLayerIndex, i * outputNodeCount + j] })
                    }
                }

                // now save the nodevalues
                oldNodeValues = layerNodeValues;
            })
        })

        // set new weights and biases
        /*set(state => {
            return {weightsAndBiases: {biases: state.biasNudges, weights: state.weightNudges}}
        })*/

        //console.log({weights, biases})
    },
    biasNudges: [],
    weightNudges: [],
    setNudges: ({weightVal, biasVal, bLoc, wLoc, init}) => {
        if(init) {
            console.log('init Nudges')
            set(state => {
                const obj = state.weightsAndBiases;
                return {biasNudges: [...obj.biases], weightNudges: [...obj.weights]} 
            })
        }else {
            // this updates weightsAndBiases unintentionally
            if(weightVal && wLoc.length === 2){
                set(state => {
                    let weightNudges = [...state.weightNudges];
                    weightNudges[wLoc[0]][wLoc[1]] += weightVal;

                    //console.log({weightNudges})

                    return {weightNudges} 
                })
            }
            if(biasVal && bLoc.length === 2){
                set(state => {
                    let biasNudges = [...state.biasNudges];
                    biasNudges[bLoc[0]][bLoc[1]] += biasVal;

                    //console.log({biasNudges})

                    return {biasNudges};
                })
            }
        }
    },

    /**
     out of intrest / curiosity 
        say we set up 2 neural networks with a different or the same number of layers and nodes but the same inputs
        then we feed the inputs into network A and do this for a batch of n input sets
        the result is then taken to be correct and used to tune network B
        once network B is tuned we run a number of sets through network B and tune network A this is then repeated 
        finally the accuracy is tested in a few data sets - the assumption is that these 2 networks will be equally correct
        - to increase the accuracy of this a number of 'correctly' weighted results should be supplied so that 
            every time the above itterative tuning process is preformed some of these are added and hence work as a bias 
            for the networks 
     */
}));