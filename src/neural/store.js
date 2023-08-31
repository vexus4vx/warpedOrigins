import { create } from 'zustand';

export const neuralNetworkStore = create(set => ({
    input: [],
    weightsAndBiases: {},
    semiStaticData: {  
        layers: [],
        learnRate: 0.1,
        ActivationFunct: (a) => a <= 0 ? 0 : a > 1 ? 1 : a 
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
    Cost: ({input, expectedOutputs}) => {
        let allCost = 0
        set(state => {
            const {layers, ActivationFunct} = state.semiStaticData
            const {weights, biases} = state.weightsAndBiases
            const basicNeuralNetwork = state.basicNeuralNetwork

            input.forEach(node => {
                let nodesIn = [node]
                layers.forEach((nodesOut, k) => {
                    nodesIn = [...basicNeuralNetwork({nodesIn, nodesOut, weights: weights[k], biases: biases[k], ActivationFunct})]
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
    learnInefficiently: ({trainingData}) => {
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
        let activationVals = []
        set(state => {
            const ActivationFunct = state.semiStaticData.ActivationFunct
            // const {weights, biases} = state.weightsAndBiases

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
    }
}));