import { create } from 'zustand';

export const neuralNetworkStore = create(set => ({
    input: [0, 1], //[1, 2, 10, 18, 32, 34, 11,1, 7, 8, 16, 32, 39, 40,4, 7, 9, 12, 21, 42, 41].map(a => (a - 1) / 46),
    weightsAndBiases: {},
    nudge: 0.00001,
    semiStaticData: {  
        layers: [3, 4, 2],//[100, 47],
        learnRate: 0.1
    },
    ActivationFunct: (a) => a <= 0 ? 0 : (a / 100) > 1 ? 1 : a / 100,
    ActivationFunctDerivative: (a) => (a <= 0) || ((a / 100) > 1) ? 0 : 0.01,
    setState: ({layers, learnRate, ActivationFunct, weights, biases, ...obj}) => {
        // console.log('setState')
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
        // console.log('Cost', {input, expectedOutputs})
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
        // console.log(activationValue, expectedOutput)
        // ...
        return expectedOutput - activationValue /// what do I output here ??
    },
    learnInefficiently: (trainingData) => {
        // console.log('learnInefficiently', {trainingData})
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
        // console.log('setWeightsAndBiases')
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
    NeuralNetwork: (askForValidation, predictOutput) => {
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
    TrainNetwork: (TrainingData) => {
        set(state => {
            state.setWeightsAndBiases()

            console.log('training')
            /*TrainingData.forEach((trainingData, k) => {
                console.log('index: ', k + 1, '/', TrainingData.length)
                console.time('learn')
                state.learnInefficiently(trainingData)
                console.timeEnd('learn')
            }) */
            // state.learnEfficiently(TrainingData)
            state.Train(TrainingData)
            console.log('done training')

            return {}
        })
    },
    /* from video */
    costGradients: {},
    setupCostGradients: () => {
        set(state => {
            let biases = [], weights = [];

            [...state.weightsAndBiases.biases].forEach(arr => {
                biases.push(...[...arr.map(a => 0)])
            });

            [...state.weightsAndBiases.weights].forEach(arr => {
                weights.push(...[...arr.map(a => 0)])
            });

            return {
                costGradients: {
                    weights,
                    biases
                }
            }
        })
    },
    ApplyAllGradients: (sampleSize) => { // rename to ... 
        set(state => {
            const learnRate = state.semiStaticData.learnRate / sampleSize
            const costGradients = state.costGradients
            const {weights, biases} = state.weightsAndBiases

            let newBiases = [], newWeights = []
            biases.forEach((biasValArr, k) => {
                newBiases.push(biases[k].map((bias, n) => bias - (costGradients.biases[n] * learnRate)))

                newWeights.push(weights[k].map((weight, n) => weight - (costGradients.weights[k][n] * learnRate)))
            })

            state.setupCostGradients()

            return {weightsAndBiases: { weights: newWeights, biases: newBiases }}
        })
    },
    updateGradients: (nodeValues, layerIndex) => {
        set(state => {
            const maxNodesOut = state.semiStaticData.layers[layerIndex]

            const costGradientB = state.costGradients.biases
            const costGradientW = state.costGradients.weights
            console.log(state.costGradients.weights, "llll")

            // console.log({costGradientW, costGradientB, weightsAndBiases: state.weightsAndBiases})

            for(let nodesOut = 0; nodesOut < maxNodesOut; nodesOut ++){

                // console.log(layerIndex ? state.semiStaticData.layers[layerIndex - 1] : state.input.length)

                for(let nodesIn = 0; nodesIn < (layerIndex ? state.semiStaticData.layers[layerIndex - 1] : state.input.length); nodesIn ++){
                // for(let nodesIn = 0; nodesIn < state.semiStaticData.layers[layerIndex - 1]; nodesIn ++){ // not running since index === -1
                    // evaluate partial derivative: cost / weight of current connection
                    const derivativeCostWrtWeight = state.input[nodesIn] * nodeValues[nodesOut]
                    // the costGradient stores the partial derivatives for each weight
                    // ... the derivative is added to the array here because ultimatly we want to calculate the average gradient across all the data in the training batch
                    const index = nodesIn * maxNodesOut + nodesOut // test !!!!
                    // console.log({index, maxNodesOut, costGradientW, layerIndex})
                    // layerindex ?? 
                    costGradientW[layerIndex * maxNodesOut + index] += derivativeCostWrtWeight // I think that this is the incorrect index for the cost gradients
                }
        
                // evaluate the partial derivative:  cost / bias of the current node
                const derivativeCostWrtBias = 1 * nodeValues[nodesOut]

                // console.log(derivativeCostWrtBias)
                costGradientB[nodesOut] += derivativeCostWrtBias
            }

            console.log({costGradientW}, 'll')

            return {costGradients: {weights: costGradientW, biases: costGradientB}}
        })
    },
    CalculateOutputLayerNodeValues: (expectedOutputs) => {
        const nodeValues = []
        set(state => {
            let layerSize = state.semiStaticData.layers.length - 1

            expectedOutputs.forEach((expectedOutput, k) => {
                const costDerivative = state.NodeCostDerivative(state.activationValues[layerSize][k], expectedOutput)
                const activationDerivatives = state.ActivationFunctDerivative(state.weightedInputs[layerSize][k])
                nodeValues.push(activationDerivatives * costDerivative)
            })
            // update weights and bias gradients
            state.updateGradients(nodeValues, state.semiStaticData.layers.length - 1)
            return {}
        })
        return nodeValues
    },
    CalculateHiddenLayerNodeValues(hidenLayerIndex, oldNodeValues){
        const newNodeValues = []
        set(state => {
            const atIndexLayerLenght = state.Layers[hidenLayerIndex]

            for(let newNodeIndex = 0; newNodeIndex < atIndexLayerLenght; newNodeIndex ++){
                const newNodeValue = 0
                for(let oldNodeIndex = 0; oldNodeIndex < oldNodeValues.length; oldNodeIndex ++){
                    // partial derivatives of the weighted input with respect to the input
                    const weightedInputDerivative = state.setWeightsAndBiases.weights[hidenLayerIndex - 1][newNodeIndex * atIndexLayerLenght + oldNodeIndex]
                    newNodeValue += weightedInputDerivative * oldNodeValues[oldNodeIndex]
                }
                newNodeValue *= state.ActivationFunctDerivative(state.weightedInputs[hidenLayerIndex][newNodeIndex])
                newNodeValues.push(newNodeValue)
            }

            state.updateGradients(newNodeValues, hidenLayerIndex)
            return {}
        })
        return newNodeValues
    },
    activationValues: [], // [[], [], ...] same length and map as layers
    weightedInputs: [], // [[], [], ...] same length and map as layers
    updateActivationValues: (arr, arr2) => {
        set(state => {
            return {
                activationValues: [...state.activationValues, arr],
                weightedInputs: [...state.weightedInputs, arr2]
            }
        })
    },
    recordActivationValues: () => { // fuse this with neuralNetwork ?
        // for the backpropagation to work we need to know the activation values - these will be returned by each neuralSegmant step

        set(state => {
            // Clear activation Values ...
            state.setState({activationValues: [], weightedInputs: []})
            
            let nodesIn = [...state.input]
            state.semiStaticData.layers.forEach((nodesOut, k) => {
                nodesIn = state.neuralSegment({nodesIn, nodesOut, weights: state.weightsAndBiases.weights[k], biases: state.weightsAndBiases.biases[k]}, state.updateActivationValues).activationVals
            });
            
            return {}
        })
    },
    learnEfficiently: (trainingData) => {
        // console.log('learnEfficiently', {trainingData})
        set(state => {
            state.setWeightsAndBiases()
            state.setupCostGradients()
            return {}
        })

        trainingData.forEach((datapoint, i) => {
            // use Backpropagation Algorithm to calculte the gradient of the cost function
            // this is done for each point and then the gradients are added together

            set(state => { return {input: datapoint.input} })
            
            set(state => {
                /*console.log({
                    i, 
                    biases: state.weightsAndBiases.biases, 
                    weights: state.weightsAndBiases.weights
                }) */
                // run the inputs through the network.
                // During this process each layer will store the values we need, such as weighted inputs and activations

                // run through the entire network ...  
                state.recordActivationValues() // sets the activationValues 

                // for output layer
                let nodeValues = state.CalculateOutputLayerNodeValues(datapoint.expectedOutputs)

                // for hidden layers
                // loop back through all hidden layers and update their gradients
                for(let hidenLayerIndex = state.semiStaticData.layers.length -2; hidenLayerIndex >= 0; hidenLayerIndex --){
                    nodeValues = state.CalculateHiddenLayerNodeValues(hidenLayerIndex, nodeValues)
                }

                console.log(state.costGradients.weights)

                state.ApplyAllGradients(trainingData.length) // update all weights and biases
                return {}
            })
        })
    },
    /* from video */

    /* my try */
    // for backpropogation I basically need to run everything through the netwerk backwords
    UpdateAllGradients: (datapoint) => {
        // a datapoint is the input to the system so if we have 10 inputs this task will need to be preformed 10 times
        // we need to record the weightedInputs and activations for each layer
        // - we know the weightedInputs since they are the weights we only need their locations but I don't think we need to worry about calculating them here
        // the activations are the outputs of each layer

    },
    Train: (trainingData) => {
        set(state => {
            state.NeuralNetwork() // save up all activationValues and weightedInputs
            // note: if this were run on a layer basis it would help to keep the values incorperating the newly changed ones but since we don't update them till the end it's perfectly fine this way
            return {}
        })

        trainingData.forEach(dataSet => {
            const {input, expectedOutputs} = dataSet

            // we will need to work ourselves through each layer in reverse
            set(state => {
                const layers = [...state.semiStaticData.layers]
                const allNodes = [state.input.length, ...layers].reverse()
                const activationValues = state.activationValues

                // let nodeValues = [] // remember these are in partial reverse ----- handle

                layers.reverse().forEach((numberOfOutputNodes, i) => {
                    const numberOfNodesIn = allNodes[i + 1]
                    const layerNodeValues = [] // correct order for the current layer

                    // we need to calculate the nodeValues of the outputs for the layer
                    for(let j = 0; j < numberOfOutputNodes; j++){
                        if(i === 0){
                            const costDerivative = state.NodeCostDerivative(activationValues[layers.length - 1 - i][j], expectedOutputs[j])
                            const activationDerivative = state.ActivationFunctDerivative(state.weightedInputs[layers.length - 1 - i][j])
                            layerNodeValues.push(costDerivative * activationDerivative)
                        }else {
                            // ...
                        }
                    }

                    // final slope for cost
                    // do here since this needs number of nodes In, out and the correctly ordered layerNodeValues
                })

                // 

                // console.log({nodeValues})

                return {}
            })
        })

        // test
        set(state => {
            // console.log(state.weightedInputs, 'tst')
            return {}
        })
    }
    /* my try */
}));