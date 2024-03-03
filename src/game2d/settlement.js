const { Unit } = require("./unit");

// lets create a settlement class
module.exports = (function() {
    /**
     * setup settlement
     * 
     * @constructor
     * @public
     * @param {Object} props 
     */
    function Settlement({init, race, ...props}) {
        this.name = init;
        this.fortifications = [0]; // using an array allows for fortified layers
        this.wall = [0]; // using an array allows for inner walls
        this.stage = 0; // area covered ...

        // for the units living in the settlement or visiting etc I think we need to just store their id's here
        this.units = props.units || []; // never create internally
        this.facilities = props.facilities || [];
        this.houseing = props.houseing || [];
        this.inventory = props.inventory || [];
        this.livestock = props.livestock || []; // not here

        return this;
    }

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

    Settlement.prototype.addUnits = function(units) {
        if(Array.isArray(units)) {
            units.forEach(unitId => {
                if(!this.units.includes(unitId)){
                    this.units.push(unitId);
                }
            })
        }
    }

    Settlement.prototype.removeUnits = function(units) {
        if(Array.isArray(units)) {
            units.forEach(unitId => {
                if(this.units.includes(unitId)){
                    this.units = this.units.filter(id => id !== unitId)
                }
            })
        }
    }

    return Settlement;
})();