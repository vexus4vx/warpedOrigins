import { updateDelay } from '../consts';

export default (function() {
    /**
     * handle mouse and keyboard input
     * handle Gps adjustments
     * 
     * @constructor
     * @public
     * @param {Number} windowWidth ...
     * @param {Number} windowHeight ...
     * @param {Class} GpsClass ...
     */
    function Interface({windowWidth, windowHeight, GpsClass}) {
        this.zoom = 0;
        this.windowWidth = windowWidth || 0;
        this.windowHeight = windowHeight || 0;
        this.inTriggerBoundary = false;
        this.mouseIsPressed = false;
        this.updateCanvas = true;
        this.gps = GpsClass;
        this.lastUpdated = 0;

        return this;
    }

    Interface.prototype.mayIUpdate = function (delay = 0, doThis) {
        const now = Date.now();
        if((now - this.lastUpdated) > updateDelay) {
            this.lastUpdated = now + 10 + delay;
            this.updateCanvas = true;
            if(typeof doThis === 'function') doThis();
        }
    }

    /**
     * update width and height
     * @param {Array<Number>} from viewing from
     */
    Interface.prototype.updateDimentions = function ({windowHeight, windowWidth}) {
        if(windowHeight) this.windowHeight = windowHeight;
        if(windowWidth) this.windowWidth = windowWidth;
        this.mayIUpdate();
    }

    Interface.prototype.onEnterTriggerBoundary = function ({x, y}) {
        this.inTriggerBoundary = true;
        // rotate continguiously - depending on position
        this.mayIUpdate(40, () => this.gps.onRotate({x, y}));
        // we need to know whee we are on the screen here so we need the screen height + width and boundaryWidth
    }

    Interface.prototype.onLeaveTriggerBoundary = function () {
        this.inTriggerBoundary = false;
        // stop rotateing
    }

    Interface.prototype.onMouseDown = function ({x, y}) {
        this.mouseIsPressed = true;
        // move forward ...
        this.mayIUpdate(40, () => this.gps.onMove({x, y})); 
        // we need to set mouse position because onMouseMove will require a reference to adjust its rotation when moveing
    }

    Interface.prototype.onMouseUp = function () {
        this.mouseIsPressed = false;
        // stop moveing forward
    }

    Interface.prototype.onMouseMove = function ({x, y, timeStamp, buttons}) {
        // when pressed change the direction we are moveing in : vVect
        if(this.mouseIsPressed) {
            this.mayIUpdate(30, () => this.gps.onRotate({x, y}));
        }
    }

    Interface.prototype.onScroll = function ({x, y, timeStamp, buttons, direction}) {
        // edit zoom
        this.mayIUpdate(300, () => {
            // we have to zoom in or out {x, y, direction}
        });
    }

    Interface.prototype.onKeyDown = function (key) {
        // onKeyHold ...
        // console.log(key)
    }

    Interface.prototype.onKeyUp = function (key) {
        // console.log(key)
    }

    // on hold and on drag follows from the data

    return Interface;
})();