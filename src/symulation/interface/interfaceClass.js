module.exports = (function() {
    /**
     * handle mouse and keyboard input
     * 
     * @constructor
     * @public
     * @param {Number} windowWidth ...
     * @param {Number} windowHeight ...
     */
    function Interface({windowWidth, windowHeight}) {
        this.zoom = 0;
        this.windowWidth = windowWidth || 0;
        this.windowHeight = windowHeight || 0;

        return this;
    }

    /**
     * update width and height
     * @param {Array<Number>} from viewing from
     */
    Interface.prototype.updateDimentions = function ({windowHeight, windowWidth}) {
        if(windowHeight) this.windowHeight = windowHeight;
        if(windowWidth) this.windowWidth = windowWidth;
    }

    // onKeyDown 
    // onKeyUp
    // ... onKeyHold

    // on enter triggerBoundary
    // on click
    // on hold
    // on scroll

    return Interface;
})();