import { create } from 'zustand';

export const neuralNetworkStore = create(set => ({
    input: [0, 0, 0, 0, 0, 0, 0],
    weightsAndBiases: {},
    semiStaticData: {  
        layers: [100, 40, 7],
        learnRate: 0.1,
        ActivationFunct: (a) => a <= 0 ? 0 : a > 1 ? 1 : a 
    },
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
    Cost: ({input, expectedOutputs}) => {
        // console.log('Cost', {input, expectedOutputs})
        let allCost = 0
        set(state => {
            const layers = state.semiStaticData.layers
            const {weights, biases} = state.weightsAndBiases
            const basicNeuralNetwork = state.basicNeuralNetwork

            input.forEach(node => {
                let nodesIn = [node]
                layers.forEach((nodesOut, k) => {
                    nodesIn = [...basicNeuralNetwork({nodesIn, nodesOut, weights: weights[k], biases: biases[k]})]
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
    learnInefficiently: (trainingData) => {
        // console.log('learnInefficiently', {trainingData})
        set(state => {
            const {layers, learnRate} = state.semiStaticData
            const {weights, biases} = state.weightsAndBiases
            const Cost = state.Cost

            const h = 0.0001  /// ..................
            const cost = () => Cost({...trainingData})

            const originalCost = cost()
            let weightedGradient = layers.map(a => []), biasedGradient = [...weightedGradient]

            layers.forEach((nodesOut, k) => {
                for(let nodesIn = 0; nodesIn < (k === 0 ? trainingData.input.length : layers[k - 1]); nodesIn++){
                    for(let outputNode = 0; outputNode < nodesOut; outputNode++){
                        let index = nodesIn * nodesOut + outputNode
                        weights[k][index] += h
                        let costDifference = cost() - originalCost
                        weights[k][index] -= h
                        weightedGradient[k].push(weights[k][index] - (learnRate * costDifference / h))
                    }
                }
        
                for(let outputNode = 0; outputNode < nodesOut; outputNode++){
                    biases[k][outputNode] += h
                    let costDifference = cost() - originalCost
                    biases[k][outputNode] -= h
                    biasedGradient[k].push(biases[k][outputNode] - (learnRate * costDifference / h))
                }
            })

            return {weightsAndBiases: { weights: weightedGradient, biases: biasedGradient }}
        })
    },
    basicNeuralNetwork: ({nodesIn, nodesOut, weights, biases}, askForValidation) => { // rename to neuralSegment ?
        // console.log('basicNeuralNetwork',{nodesIn, nodesOut, weights, biases, askForValidation})
        let activationVals = []
        set(state => {
            const ActivationFunct = state.semiStaticData.ActivationFunct
            // const {weights, biases} = state.weightsAndBiases // since the weights here are inside the arreys

            for(let i = 0; i < nodesOut; i++){
                let weightedInput = biases[i]
                nodesIn.forEach((v, k) => {
                    weightedInput += (v * weights[i * nodesIn.length + k])
                })
                activationVals.push(ActivationFunct(weightedInput))
            }
            return {}
        })
        if(askForValidation) askForValidation(activationVals)
        return activationVals
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
    NeuralNetwork: (askForValidation) => {
        set(state => {
            state.setWeightsAndBiases()
            return {}
        })

        set(state => {
            const layers = state.semiStaticData.layers
            const input = state.input

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
                nodesIn = [...state.basicNeuralNetwork({nodesIn, nodesOut, weights: state.weightsAndBiases.weights[k], biases: state.weightsAndBiases.biases[k]}, k === (layers.length - 1) ? (prediction) => askForValidation(prediction, adjustData) : null)]
            });

            return {}
        })
    },
    TrainNetwork: (TrainingData) => {
        set(state => {
            state.setWeightsAndBiases()

            console.log('training')
            TrainingData.forEach(trainingData => state.learnInefficiently(trainingData))
            console.log('done training')

            return {}
        })
    }
}));

function predictOutput(prediction){
    let out = [0, 0]
    prediction.forEach((v, k) => {
        if(v > out[0]) out = [v, k]
    })
    return out
}