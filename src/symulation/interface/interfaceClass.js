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
        this.inTriggerBoundary = false;
        this.updateDelay = 40;
        this.mouseIsPressed = false;
        this.updateCanvas = true;

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

    Interface.prototype.onEnterTriggerBoundary = function () {
        this.inTriggerBoundary = true;
    }

    Interface.prototype.onLeaveTriggerBoundary = function () {
        this.inTriggerBoundary = false;
    }

    Interface.prototype.onMouseDown = function () {
        this.mouseIsPressed = true;
    }

    Interface.prototype.onMouseUp = function () {
        this.mouseIsPressed = false;
    }

    Interface.prototype.onMouseMove = function ({x, y, timeStamp, buttons}) {
        // kinda special
        // console.log({x, y})
    }

    Interface.prototype.onScroll = function ({x, y, timeStamp, buttons}) {
        // edit zoom
        // console.log('scrl', {x, y, timeStamp, buttons})
        this.updateCanvas = true;
    }

    Interface.prototype.onKeyDown = function (key) {
        // onKeyHold ...
        // console.log(key)
    }

    Interface.prototype.onKeyUp = function (key) {
        // console.log(key)
    }

    // we need to recieve the position and do our analysis in respect to it
    // we need to only allow updates to mouse and keyboard triggers at certain offsets timewise - see updateDelay

    // on hold and on drag follows from the data

    return Interface;
})();