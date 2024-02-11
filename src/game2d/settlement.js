//import unit from "./unit";

// lets create a settlement class
module.exports = (function() {
    /**
     * setup settlement
     * 
     * @constructor
     * @public
     * @param {Object} props 
     */
    function Settlement(props = null) {  
        // set relavent parameters
        // for the units living in the settlement or visiting etc I think we need to 
        // just store their id's here
        this.units = props.units || [];//Array.from({length: numberOfUnits}, () => createUnit(Math.random() * 1000000000)); // units their weapons, stats, affinaties and energy natur + special bloodlines ...
        this.facilities = props.facilities || []; // capacity, occupied state // facilities are simply buildings where people work but not live
        this.houseing = props.houseing || []; // ...
        this.inventory = props.inventory || []; // unused weapons tools or items
        this.livestock = props.livestock || [];

        return this;
    }

    /*
    function createUnit(n, parents) {
        let out = {
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

        if(parents){
            //... attribute stats based on parents
        }else {
            // random stats age ...
        }

        return out;
    }*/

    function createFacility(capacity = 1, grade = 0) {
        return {
            capacity,
            workingHere: [],
            grade, // the higher this is the better the facility
            id: '....'
        }
    }

    function createHouseing(capacity, grade) {
        return {
            capacity,
            residents: [],
            id: '...',
            grade // the higher this is the more of a mantion it is
        }
    }

    function createInventory() {
        return {
            // just add an item to the list ...
        }
    }

    /**************Public API****************/

    Settlement.prototype.toJson = function() { //to do
        return JSON.stringify(this, null, 4);
    }

    Settlement.prototype.addUnit = function(data) {
        //console.log(data);
        //...
    }

    return Settlement;
})();