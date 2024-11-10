const { saveFileData } = require("../io/fileIO");
const vxTerrainClass = require("./vxTerrainClass");

module.exports = (function() {
    /**
     * construct a game-class.
     * 
     * @constructor
     * @public
     * @param {Object} props 
     */
    function GameClass(props) { // set relavent parameters
        this.mapData = props?.mapData || [];

        return this;
    }

    /**************Public API****************/
    /**
     * Save to file
     * @public
     */
    GameClass.prototype.save = function() {
        saveFileData({test: this.test}, 'autoSave'); 
    }

    /**
     * Load from file
     * @param {Object} data 
     * @public
     */
    GameClass.prototype.load = function(data) {
        const {...consts} = JSON.parse(data);
        Object.keys(consts).forEach(key => this[key] = consts[key]);
    }

    GameClass.prototype.newGame = function () {
        // initiate a new game
        // step 1 : create the map data from scratch
        this.landscape = new vxTerrainClass();
        // step 2 : create the charackters
        // step 3 : pick attributes etc
    }

    GameClass.prototype.info = function () {
        // for testing
        console.log(this)
    }

    return GameClass;
})();