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
     */
    function Interface({windowWidth = 0, windowHeight = 0}) {
        this.zoom = 0;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        const triggerHeight = [windowHeight * 0.1, windowHeight * 0.9];
        const triggerWidth = [windowWidth * 0.06, windowWidth * 0.94];
        this.inTriggerBoundary = false;
        this.mouseIsPressed = false;
        this.updateCanvas = true;
        this.lastUpdated = 0;
        this.mousePosition = [windowWidth / 2, windowHeight / 2];

        // for interface location in virtualWorld
        this.cillaryFocus = 0; // ... -- onScroll
        this.location = [0, 0, 0] // screen location in space -- onMove
        this.viewDirection = [0, 0, 1] // the offset for a point on a sphere given that the center is assumed to be [0,0,0]

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
        if(windowHeight) {
            this.windowHeight = windowHeight;
            this.triggerHeight = [windowHeight * 0.1, windowHeight * 0.9];
        }
        if(windowWidth) {
            this.windowWidth = windowWidth;
            this.triggerWidth = [windowWidth * 0.06, windowWidth * 0.94];
        }
        this.mayIUpdate();
    }

    Interface.prototype.onEnterTriggerBoundary = function ({x, y}) {
        this.inTriggerBoundary = true;
        const horizontalTrigger = () => {
            if(x < this.triggerWidth[0]) {
                // turn left
            } else if(x > this.triggerWidth[1]){
                // turn right
            }
        }

        // rotate continguiously // trigger this constantly from the store ...
        this.mayIUpdate(40, () => {
            this.mousePosition = [x, y];
            // edit viewDiewction -- we need to figure out in what direction to change this
            // that is  up, down, left, right, or multiple ...
            if(y < this.triggerHeight[0]) {
                // turn up
                horizontalTrigger();
            } else if(y > this.triggerHeight[1]){
                // turn down
                horizontalTrigger();
            }
        });
    }

    Interface.prototype.onLeaveTriggerBoundary = function () {
        this.inTriggerBoundary = false;
        // stop rotateing
    }

    Interface.prototype.onMouseDown = function ({x, y}) {
        this.mouseIsPressed = true;
        // move forward ...
        this.mayIUpdate(40, () => {
            this.mousePosition = [x, y]; // we need to set mouse position because onMouseMove will require a reference to adjust its rotation when moveing
            // edit location -- move along viewDirection continguiously - keep adding viewDirection * scale  to position
        });
    }

    Interface.prototype.onMouseUp = function () {
        this.mouseIsPressed = false;
        // stop moveing forward
    }

    Interface.prototype.onMouseMove = function ({x, y, timeStamp, buttons}) {
        // when pressed change the direction we are moveing in : vVect
        if(this.mouseIsPressed || this.inTriggerBoundary) {
            this.mayIUpdate(30, () => {
                this.mousePosition = [x, y];

                // I think we should only have a single change to the viewDirection 
                // so we need to set the priority to either the triggerBoundary or the mouseIsPressed action

                if(this.inTriggerBoundary) {
                    // edit viewDirection
                } 
                if(this.mouseIsPressed) {
                    // edit viewDirection -- how ?
                    // edit position
                }
            });
        }
    }

    Interface.prototype.onScroll = function ({x, y, timeStamp, buttons, direction}) {
        // edit cillaryFocus
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

    return Interface;
})();