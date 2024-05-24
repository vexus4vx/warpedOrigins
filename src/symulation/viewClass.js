module.exports = (function() {
    /**
     * provides a window of variable size where the user can view the virtualSpace.
     * 
     * @constructor
     * @public
     * @param {Number} boundaries max length, width and height
     * @param {Object} location {from: [x, y, d], to: [x, y, d]}
     * @param {Array<Number>} screenSize [canvasWidth, canvasHeight]
     */
    function Interface({boundaries, location, screenSize}) {
        // set relavent parameters
        this.boundaries = boundaries || 144000;
        this.zoom = 100; // 100%
        this.location = location || {
            from: [0, 0, 0], // left/right, up/down, depth
            to: [0, 0, 10] // ...
        }
        // the screenSize will be used to determine the field of view
        this.viewWidth = screenSize[0];
        this.viewHeight = screenSize[1];
        this.time = 0;

        return this;
    }

    /**
     * parameters are assumed the same unless denoted
     * @param {Array<Number>} from viewing from
     * @param {Array<Number>} to focosing on
     */
    Interface.prototype.move = function ({from, to}) {
        if(
            (this.location.from[0] !== from[0]) || 
            (this.location.from[1] !== from[1]) || 
            (this.location.from[2] !== from[2]) || 
            (this.location.to[0] !== to[0]) || 
            (this.location.to[1] !== to[1]) || 
            (this.location.to[2] !== to[2])
        ) {
            // update the view ?
        }
    }

    /*
        to truly view we need to a fully functioning system of light
        so that when I want to know the current values of light from a given direction I can display them
        this isn't even point to area it's more like area from direction
        hence we need to know the location of light at a given time in it's cycle
    */

    return Interface;
})();