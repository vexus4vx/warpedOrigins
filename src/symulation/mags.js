// and he spoke "let there be light" and there was light and he saw that it was good.


/** - testing 
 * symulate a single light particles path
 * @param {boolean} typ -1 or 1 but we will use 0 and 1 for simplicity - at least for now
 * @param {float} freq this will decide the radius of the path (thoroidal) of the particle - note : the speed of light can be assumed to be constant, however the distance to be covered changes with frequency since the light particle will have to cover more distance, hence we get an overall different speed for different frequencies - see sangyak experiment for proof
 * @returns the location of the particle of light at any given time
 */
export function LightParticle({typ, freq}) {
    return 0
}

/// below see what frequences will not allow stability etc

/** - testing
 * symulate multy frequency light
 * @param {coordinate} loc location we are interested in
 * @param {Array<Array>} freqs how many mags of each typ and freq : [[typ, freq, num], ...]
 * @returns the location and typ of light particles at any given time
 */
export function Light({loc, freqs}) {
    return 0
}

/** - testing
 * symulate concentrated multi frequency light - same is atom
 * @param {coordinate} loc location we are interested in
 * @param {Array<Array>} freqs how many mags of each typ and freq : [[typ, freq, num], ...]
 * @returns the location and typ of light particles at any given time
 */
export function ConcentratedLight({loc, freqs}) {
    return 0
}


// a function that returnes the location of a particle and / or the vector denoting its current motion
// given the frequency of the particle, its phase offset and the cycle depth which will be assumed to be a constant
export function thoroidalOrbit({freq = 1, phase = 0, cycleDepth = 364}) {
// - like this
//        .            .
//    .         .          .
//        .            .
// - not this ?
//        .       .
//     .     . .     .
//    .       .       . 
//     .     . .     .
//        .       .   
    return 0;
}