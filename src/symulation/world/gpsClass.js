// I need a positioning system for this to work and putting it in the interface is just wrong
// the interface should simply be running the onPositionChange function thats it
// this function needs to 
/**
 * keep track of the position the screen is located at // position
 * keep track of the direction we are looking in // vVect
 * apply changes to the forementioned parameters
 * thats it!
 */
// we need to know the following
/**
 * the max height width and depth - note maxWidth = maxDepth = 2 * maxHeight
 */

module.exports = (function() {
    /**
     * handle position of window in the world
     * 
     * @constructor
     * @public
     * @param {Array(Number)} position ...
     * @param {Array(Number)} viewV ...
     */
    function Gps({position, viewV}) {
        this.position = position; // current view position
        this.viewV = viewV; // [east(+) or west(-), north(+) or south(-), up(+) or down(-)]

        return this;
    }

    Gps.prototype.onMove = function (obj) {
        console.log('move', obj)
    }

    /* Gps.prototype.onMoveTo = function (obj) {
        console.log('moveTo', obj)
    } */

    Gps.prototype.onRotate = function (obj) {
        console.log('rotate - edit vVect', obj)
    }

    // we need to recieve the position and do our analysis in respect to it

    return Gps;
})();