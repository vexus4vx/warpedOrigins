import { create } from 'zustand';
import BasikNeuralNetwork from './basikNN';

const DEBUGs = 0;
const DEBUGf = 0;
const DEBUGb = 0;

// running with file in test folder
// [0.5079398807680949]

// let us test the network - I want to see how stable the increase is 
/* - stable (0) 
*/

// lets try adding a function to modify the learnrate dynamically - I hope this speeds things up

export const neuralNetworkStore = create(set => ({
    input: [0, 0],
    weights: null,
    biases: null,
    layers: [3, 4, 1], // so 6+12+4 = 22 w and 3+4+1 = 8 b
    learnRate: 0.1618,
    previousCostAverage: 0,
    ActivationFunct: (a) => a > 0 ? a : 0, // relu ...
    ActivationFunctDerivative: (a) => a > 0 ? 1 : 0, // ...
    setState: (obj) => set(state => ({...obj})),
    setWeightsAndBiases: () => {
        set(state => {
            const layers = state.layers;
            let weights = state.weights || [];
            let biases = state.biases || [];
            let ran = 0;
            
            if(!weights || weights.length !== layers.length){
                let randomWeights = [], nodesIn = state.input.length
        
                layers.forEach(nodesOut => {
                    randomWeights.push(Array.from({length: nodesIn * nodesOut}, () => Math.random()))
                    nodesIn = nodesOut
                })
                weights = randomWeights
                ran++
            }

            if(!biases || biases.length !== layers.length){
                let randomBiases = []
        
                layers.forEach(nodesOut => {
                    randomBiases.push(Array.from({length: nodesOut}, () => Math.random()))
                })
                biases = randomBiases
                ran++
            }

            return ran ? {weights, biases} : {};
        })
    },
    activationValues: [],
    weightedInputs: [],
    setupNetwork: (trainingData, loopover = 100) => {
        // check for layers and input
        let expectedOutputLength, layers, input;
        set(state => {
            expectedOutputLength = state.layers[state.layers.length - 1];
            input = state.input;
            layers = state.layers;
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
                for(let i = 0; i < loopover; i++){
                    console.log(`Itteration ${i} of ${loopover}`)
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
    forwardPropagation: ({layers, input}, hide) => {
        let weights = [], biases = [], activationFunction;
        set(state => {
            weights = [...state.weights];
            biases = [...state.biases];
            activationFunction = state.ActivationFunct;
            return {}
        })

        if(DEBUGf) console.log({weights, biases, activationFunction})

        // go through every layer and record the activations
        let allActivations = [], weightedInputs = []
        let activationValues = [...input];
        layers.forEach((outputLayerSize, layerIndex) => { // layerIndex === inputLayerIndex
            let newActivationValues = [], newWeightedInputs = [];
            // the new activationValue for this index is calculated as follows
            // -> activationFunction( inputActivation0 * weightBetween[0 in and current out] + inputActivation1 * weightBetweenTheNodes[1 in and current out] + ... + inputActivationFinal * weightBetweenTheNodes[final in and current out] + biasForOutputNode )

            for(let outputNodeIndex = 0; outputNodeIndex < outputLayerSize; outputNodeIndex++){
                let weightedInputSum = 0; // sum of the weights * activations

                const avl = activationValues.length /// try average

                activationValues.forEach((inputLayerActivation, activationIndex) => {
                    // [00,01,02,03,04,10,12,13,14,20,21,22,23,24] // what weights[layerIndex] look like if layer has 3 inputs and 5 outputs
                    // the ones I need here are [00, 10, 20]
                    const weight = weights[layerIndex][activationValues.length * outputNodeIndex + activationIndex] // #### at this point I want to note that if the weights were ordered from the output layer to the input layer instead ([00,10,20,30,...] rather than the current [00,01,02,03,...]) then this step would be really simple since I would need to multiply all weights[?] * the output nodeValue
                    const weightedInput = weight * inputLayerActivation // might need these for backpropagation
                    weightedInputSum += (weightedInput / avl)
                })

                // add bias
                weightedInputSum += (biases[layerIndex][outputNodeIndex] / biases[layerIndex].length)  // try average
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

        if(!hide) console.log(activationValues) // resulting activations on final layer
    },
    backPropagation: ({verifiedTrainingData, layers}) => {
        let weights, biasNudges, weightNudges, ActivationFunctDerivative, learnrate, costAvr = 0;

        set(state => { 
            weights = [...state.weights];
            biasNudges = state.biases.map(arr => arr.map(v => v));
            weightNudges = state.weights.map(arr => arr.map(v => v));
            ActivationFunctDerivative = state.ActivationFunctDerivative;
            learnrate = state.learnRate;
            return {} 
        })

        if(!learnrate) return null; // precaution

        const learnRateAverage = -learnrate / verifiedTrainingData.length;

        // loop through the training subsets
        verifiedTrainingData.forEach(obj => {
            // forward pass sets the weightedInputs and cativationValues
            set(state => {
                state.forwardPropagation({layers, input: obj.input}, true)
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

                // loop over the outputNodeCount
                for(let i = 0; i < outputNodeCount; i++){
                    let nodeValue = 0;
                    const activationDerivative = ActivationFunctDerivative(weightedInputs[forwardLayerIndex][i]) // Da/Dz

                    if(!layerIndex){ // for last layer
                        const cst = activationValues[forwardLayerIndex][i] - obj.expectedOutputs[i];
                        costAvr = (cst ** 2) / obj.expectedOutputs.length;

                        // console.log({cst})

                        const costDerivative = 2 * cst; // Dc/Da
                        nodeValue = costDerivative * activationDerivative;
                    }else {
                        // calculate node values for any layer that is not the last layer
                        for(let j = 0; j < oldNodeValues.length; j++){
                            nodeValue += (weights[forwardLayerIndex + 1][i * oldNodeValues.length + j] * oldNodeValues[j])
                        } 
                        nodeValue *= activationDerivative;
                    }

                    layerNodeValues.push(nodeValue);

                    for(let j = 0; j < inputNodeCount; j++){
                        // get the partial derivative : Dc/Dw
                        const weightCostDerivative = (forwardLayerIndex ?  activationValues[forwardLayerIndex - 1][j] : obj.input[j]) * nodeValue; 
                        weightNudges[forwardLayerIndex][j * outputNodeCount + i] += (learnRateAverage * weightCostDerivative)
                    }

                    // update biases
                    biasNudges[forwardLayerIndex][i] += (nodeValue * learnRateAverage) // since 1 * costDerivative * activationDerivative is the effect on the bias
                }

                // now save the nodevalues
                oldNodeValues = layerNodeValues;
            })
        })

        // set new weights and biases
        set(state => {

            if(DEBUGb){
                let difs = 0;

                state.biases.forEach((arr, ind) => {
                    arr.forEach((v, i) => {
                        if(v !== biasNudges[ind][i]) difs++;
                    })
                })

                console.log(difs)
            }

            const diff = costAvr - state.previousCostAverage
            const diffsqrd = diff ** 2
            console.log({costAvr, previousCostAverage: state.previousCostAverage, learnrate, diff, diffsqrd})

            return {biases: biasNudges, weights: weightNudges, previousCostAverage: costAvr} // , learnRate: costAvr
            // learnRate: state.learnRate + (diff ? 1 / diff : 0)
        })

        if(DEBUGb) console.log({biasNudges, weightNudges})
    },
    exampleNet: new BasikNeuralNetwork([2, 3, 2], {cycles: 1}),
    containedNetworkTrain: () => {
        set(state => {
            const neural = state.exampleNet
            const train_data = [
                {output: [1,0], input: [0,0]},
                //{output: [0,1], input: [0,1]},
                //{output: [0,1], input: [1,0]},
                //{output: [1,0], input: [1,1]}
            ]
            neural.learn(train_data);
            neural.info()
            return {};
        })
    },
    containedNetworkRun: () => {
        set(state => {
            const neural = state.exampleNet
            const result1 = neural.predict([0,0], [1,0])
            const result2 = neural.predict([1,0], [0,1])
            const result3 = neural.predict([0,1], [0,1])
            const result4 = neural.predict([1,1], [1,0])

            console.log(result1, result2, result3, result4)
            return {};
        })
    },
    setWeights: (weights) => {
        set(state => {
            const neural = state.exampleNet
            
            console.log({weights})
            console.log(neural)
            return {};
        })
    },
    seIsStagnant: () => {
        set(state => {
            const neural = state.exampleNet
            neural.info();
            return {};
        })
    }
}));

export const neuralNetworkStore0 = create(set => ({
    input: [1, 2, 10, 18, 32, 34, 11,1, 7, 8, 16, 32, 39, 40,4, 7, 9, 12, 21, 42, 41].map(a => (a - 1) / 46),
    weightsAndBiases: {},
    semiStaticData: {  
        layers: [120, 100, 47],
        learnRate: 0.1618
    },
    // ActivationFunct: (a) => a <= 0 ? 0 : (a / 100) > 1 ? 1 : a / 100,
    // ActivationFunctDerivative: (a) => (a <= 0) || ((a / 100) > 1) ? 0 : 0.01,
    ActivationFunct: (a) => 1 / (1 + Math.exp(-a/100)),
    //        a / (1 + Math.exp(-a))        ||       (Math.exp(2*a) - 1) / (Math.exp(2*a) + 1)     ||      
    ActivationFunctDerivative: (a) => {
        const activation = 1 / (1 + Math.exp(-a/100));
        if((activation > 1) || !activation) console.log('ERROR', activation)
        return (activation * (1 - activation) / 100);
    },
    setState: ({layers, learnRate, ActivationFunct, weights, biases, ...obj}) => {
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

            return ran ? {weightsAndBiases} : {}
        })
    },
    activationValues: [], // [[], [], ...] same length and map as layers
    weightedInputs: [], // [[], [], ...] same length and map as layers
    /* my try */

    setupNetwork: (trainingData, loopover = 100) => {
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
                for(let i = 0; i < loopover; i++){
                    console.log(`Itteration ${i} of ${loopover}`)
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
    forwardPropagation: ({layers, input}, hide) => {
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

        if(!hide) console.log(activationValues) // resulting activations on final layer
    },
    backPropagation: ({verifiedTrainingData, layers}) => {
        let weights, biasNudges, weightNudges, ActivationFunctDerivative, learnrate;

        set(state => { 
            const obj = state.weightsAndBiases;
            weights = [...obj.weights];
            biasNudges = obj.biases.map(arr => arr.map(v => v));
            weightNudges = obj.weights.map(arr => arr.map(v => v));
            ActivationFunctDerivative = state.ActivationFunctDerivative;
            learnrate = state.semiStaticData.learnRate;
            return {} 
        })

        const learnRateAverage = -learnrate / verifiedTrainingData.length;

        // loop through the training subsets
        verifiedTrainingData.forEach(obj => {
            // forward pass sets the weightedInputs and cativationValues
            set(state => {
                state.forwardPropagation({layers, input: obj.input}, true)
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

                // loop over the outputNodeCount
                for(let i = 0; i < outputNodeCount; i++){
                    let nodeValue = 0;
                    const activationDerivative = ActivationFunctDerivative(weightedInputs[forwardLayerIndex][i]) // Da/Dz

                    if(!layerIndex){ // for last layer
                        const costDerivative = 2 * (activationValues[forwardLayerIndex][i] - obj.expectedOutputs[i]) // Dc/Da
                        nodeValue = costDerivative * activationDerivative;
                    }else {
                        // calculate node values for any layer that is not the last layer
                        for(let j = 0; j < oldNodeValues.length; j++){
                            nodeValue += (weights[forwardLayerIndex + 1][i * oldNodeValues.length + j] * oldNodeValues[j])
                        } 
                        nodeValue *= activationDerivative;
                    }

                    layerNodeValues.push(nodeValue);

                    for(let j = 0; j < inputNodeCount; j++){
                        // get the partial derivative : Dc/Dw
                        const weightCostDerivative = (forwardLayerIndex ?  activationValues[forwardLayerIndex - 1][j] : obj.input[j]) * nodeValue; 
                        weightNudges[forwardLayerIndex][j * outputNodeCount + i] += (learnRateAverage * weightCostDerivative)
                    }

                    // update biases
                    biasNudges[forwardLayerIndex][i] += (nodeValue * learnRateAverage) // since 1 * costDerivative * activationDerivative is the effect on the bias
                }

                // now save the nodevalues
                oldNodeValues = layerNodeValues;
            })
        })

        // set new weights and biases
        set(state => {

            if(DEBUGb){
                let difs = 0;

                state.weightsAndBiases.biases.forEach((arr, ind) => {
                    arr.forEach((v, i) => {
                        if(v !== biasNudges[ind][i]) difs++;
                    })
                })

                console.log(difs)
            }

            return {weightsAndBiases: {biases: biasNudges, weights: weightNudges}}
        })

        if(DEBUGb) console.log({biasNudges, weightNudges})
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