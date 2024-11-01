const { saveFileData } = require("../io/fileIO");

module.exports = (function() {
    /**
     * construct a game-class.
     * 
     * @constructor
     * @public
     * @param {Object} props 
     */
    function GameClass(props) { // set relavent parameters
        this.test = props?.test || 0;

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
    }

    GameClass.prototype.info = function () {
        // for testing
        console.log(this)
    }

    return GameClass;
})();