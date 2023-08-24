// a random function based on time
function rand1 (seed){
    let f = Math.abs(seed) / Date.now()
    while (f <= 0.1) f*=10
    while (f > 1) f/=10
    return f
}

// a random function based on 1D position
function rand2 (n, seed){
    let f = seed / ((n / ((n ** 2) + 1)) + 1)
    while (Math.abs(f) <= 0.1) f*=10
    while (Math.abs(f) > 1) f/=10
    return f
}

// a random function based on 2D position
export function rand3 (x, y, seed, k = 0.001){
    const v = seed / ((x / ((x ** 2) + k)) + k)
    const q = seed / ((y / ((y ** 2) + k)) + k)

    let m = (q - seed) / (v - seed)
    let b = y - (m * x)

    if(!b) return b
    let damp = 0

    while (Math.abs(b) <= 0.1) {
        b*=10
        damp++
    }
    while (Math.abs(b) > 1) {
        b/=10
        damp++
    }

    return damp * b / 10
}

export function speedTest(funct){
    console.time('start')
    funct()
    console.timeEnd('start')
}

/*
function sinusoide(deg){
    let ang = deg % 360 
    if(deg < 0)  ang += 360

    const f1 = (x) => (-((x - 90) ** 2 / 90) + 90) / 90
    const f2 = (x) => (((x - 270) ** 2 / 90) - 90) / 90

    return ang < 180 ? f1(ang) : f2(ang)
} // a lot slower than Math.sin

function sinusoide(deg){
    const ang = deg % 360 + ((deg < 0) ? 360 : 0)

    return ang < 180 ? (-((ang - 90) ** 2 / 90) + 90) / 90 : (((ang - 270) ** 2 / 90) - 90) / 90
} // comparable to Math.sin - bit slower maybe

function sinusoide(deg){
    const ang = deg % 360 + ((deg < 0) ? 270 : -90)

    return ang < 90 ? (-(ang ** 2 / 90) + 90) / 90 : (((ang - 180) ** 2 / 90) - 90) / 90
}// comparable to Math.sin - bit slower maybe

function sinusoide(deg){
    const ang = deg % 360 + ((deg < 0) ? 270 : -90)

    return ang < 90 ? (-(ang ** 2 / 90) + 90) / 90 : (((ang - 180) ** 2 / 90) - 90) / 90
}// comparable to Math.sin - bit slower maybe // */

function sinusoide(deg){ // fastest so far but still slower than Math.sin 90% of the time
    const ang = deg % 360 + ((deg < 0) ? 270 : -90)

    return ang < 90 ? 1 - ((ang / 90) ** 2) : (((ang / 90) - 2) ** 2) - 1
}
