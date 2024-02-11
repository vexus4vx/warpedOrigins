const inputSensoryNeurons = [
    //
];

const internalNeurons = [
    //
];

const outputActionNeurons = [
    //
];

module.exports = (function() {
    /**
     * setup unit
     * conditions for selective expansion
     * condition 1 - the organism must be self replicating
     * condition 2 - there must be a blueprint for the organisms construction
     * condition 3 - the blueprint must be inherited
     * condition 4 - variations must occur once in a while in the genome
     * condition 5 - selection criteria must exist
     * @constructor
     * @public
     * @param {Array(Number)} genomeA each number is 1 byte, this is a uint_8 clamped array
     * @param {Array(Number)} genomeB each number is 1 byte, this is a uint_8 clamped array
     */
    function Unit(genomeA, genomeB) {  
        // set relavent parameters
        let basic = {
            weapons: [],
            stats: {
                strength,
                endurance,
                intelect,
                toughness,
                agility,
                energy,
                flexability
            },
            affinities: [], // ... like fire water wind poison ...
            energyNature: [], // required
            seed: '', // this should enable us to draw it ...
            bloodlines: [], // really really rare - race dependant
            level: 0,
            age: 0, // big role in game adjust according to race
            profession: [], // primary, secondary, ... // [{name: ..., level: ...}]
            personality: '' // would like to have this be a randomly initialised ai
        }

        // for their brain we need
        // inputSensoryNeurons // produce a num from 0 to 1
        // internalNeurons // how to replicate these ...
        // actionOutputNeurons // in short the results
        // each gene specifies 1 neural connection
        // these connections are eithere exititory or inhibitory
        //

        // genome length is like number of connections
        // we also need to specify the number of internal neurons
        let rand = Math.random();
        this.genome = createGenome(rand > 0.5 ? genomeA : genomeB, rand > 0.5 ? genomeB : genomeA);

        return this;
    }

    function createGenome(genomeA, genomeB) {
        return genomeA.map((v, i) => {
            const w = splitByte(genomeB[i]);
            // could average and round ...
            // or use logic gates ...
            // lets do this: if the bits are the same we pass on that bit else it will depend on the index of the bit
            let out = 0;
            splitByte(v).forEach((val, j) => {
                const bit = (j % 2) ? val : w[j]; // if they are the same they stay else we alternate ...
                out = (out << 1) + bit;
            })
            return out;
        });
    }

    function splitByte(b){
        let out = [0,0,0,0,0,0,0,0];
        for(let i = 7; i >= 0; i--){
            out[i] = (b % 2);
            b >> 1;
        }
        return out;
    }

    /**************Public API****************/

    Settlement.prototype.toJson = function() { //to do
        // return JSON.stringify(this, null, 4);
    }

    Settlement.prototype.updateWeapon = function() { //to do
        // return JSON.stringify(this, null, 4);
    }

    Settlement.prototype.updateStats = function() { //to do
        // return JSON.stringify(this, null, 4);
    }

    /**
     * 
     * @returns the genome passed onto the child
     */
    Settlement.prototype.onReproduce = function() {
        return this.genome.map(a => {
            const variation = (Math.random() * 400000) >> 3; 
            // so 0 to 50000, that gives us a 1 in 25000 chance of a gene variation to occur per gene
            // and a 1 in (25000 / genome.length) for a mutation to occur, 1 in 50 should be ok
            return variation === 7 ? a + 1 : variation === 77 ? a - 1 : a;
        });
    }

    return Unit;
})();