/*
    what if I could make an assisted learn ai 
    where I tell the function how wrong it is
    + the same image is rotated numerous times 
    or I write a skeliton function and the program selects the best fit ??
*/


export const ModObject = {
    /*invertColors: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
          data[i] = data[i] ^ 255; // Invert Red
          data[i+1] = data[i+1] ^ 255; // Invert Green
          data[i+2] = data[i+2] ^ 255; // Invert Blue
        }
    },
    applyBrightness: (data) => {
        const brightness = 25
        for (let i = 0; i < data.length; i+= 4) {
          data[i] += 255 * (brightness / 100);
          data[i+1] += 255 * (brightness / 100);
          data[i+2] += 255 * (brightness / 100);
        }
    },
    applyContrast: (data) => {
        const contrast = 25
        let factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
      
        for (let i = 0; i < data.length; i+= 4) {
          data[i] = truncateColor(factor * (data[i] - 128.0) + 128.0);
          data[i+1] = truncateColor(factor * (data[i+1] - 128.0) + 128.0);
          data[i+2] = truncateColor(factor * (data[i+2] - 128.0) + 128.0);
        }
    },
    grayScaleV: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            //  ( (0.3 * R) + (0.59 * G) + (0.11 * B) )
          data[i] = Math.round(data[i] / 3); // Invert Red
          data[i+1] = Math.round(data[i+1] / 3); // Invert Green
          data[i+2] = Math.round(data[i+2] / 3); // Invert Blue
        }
    },
    undoGrayScaleV: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
          data[i] = Math.round(data[i] * 4 + 10); // Invert Red
          data[i+1] = Math.round(data[i+1]* 2.4 + 10); // Invert Green
          data[i+2] = Math.round(data[i+2]* 2 + 4); // Invert Blue
        }
    },
    polariseV: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            data[i] = ((3 * data[i] + 4) % 256);
            data[i+1] = data[i+1] ^ 255; // Invert Green
            data[i+2] = data[i+2] ^ 255; // Invert Blue
        }
    },
    expressGreenV: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            data[i] = ((3 * data[i] + 4) % 256);
            data[i+2] = data[i+2] ^ 255; // Invert Blue
        }
    },
    overBlueV: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            // data[i] = ((3 * data[i] + 4) % 256);
            // data[i] = data[i] ^ 255; // Invert Red
            // data[i+1] = data[i+1] ^ 255; // Invert Green
            data[i+2] = data[i+2] ^ 255; // Invert Blue
        }
    },
    skepiaV: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            data[i] = Math.abs(data[i] - 50); // Reduce Red
            data[i+1] = data[i+1] ^ 255; // Invert Green
            data[i+2] = data[i+2] ^ 255; // Invert Blue
        }
    },
    gradient: (data) => {
        let gradientColors = createGradient('#0096ff', '#ff00f0');

        for (let i = 0; i < data.length; i+= 4) {
            // Mapping the color values to the gradient index
            // Replacing the grayscale color value with a color for the duotone gradient
            data[i] = gradientColors[data[i]].r;
            data[i+1] = gradientColors[data[i+1]].g;
            data[i+2] = gradientColors[data[i+2]].b;
            // data[i+3] = 255;
        }

    },
    blur: (data, width, height) => {
        const filterMatrixConst = 5;
        const bxs = (filterMatrixConst * 2 + 1) ** 2;
        
        for (let i = 0; i < data.length; i+= 4) {
            const pxlArr = runFilter(filterMatrixConst, i, width, height); // red pixel indecies
            let rgb = [0, 0, 0];

            pxlArr.forEach(ii => {
                rgb = [
                    rgb[0] + data[ii],
                    rgb[1] + data[ii + 1],
                    rgb[2] + data[ii + 2]
                ]
            });

            data[i] = Math.floor(rgb[0] / bxs);
            data[i+1] = Math.floor(rgb[1] / bxs);
            data[i+2] = Math.floor(rgb[2] / bxs);
        }
    },
    noRed: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            data[i] = 0;
        }
    },
    onlyRed: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            data[i+1] = 0;
            data[i+2] = 0;
        }
    },
    killRed: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            if((data[i] > ((data[i + 1]) * 1.4)) && (data[i] > ((data[i + 2]) * 1.4))) {
                data[i] = 0;
                data[i+1] = 0;
                data[i+2] = 0;
            }
        }
    },
    noGreen: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            data[i+1] = 0;
        }
    },
    onlyGreen: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            data[i] = 0;
            data[i+2] = 0;
        }
    },
    killGreen: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            if((data[i + 1] > ((data[i]) * 1.4)) && (data[i + 1] > ((data[i + 2]) * 1.4))) {
                data[i] = 0;
                data[i+1] = 0;
                data[i+2] = 0;
            }
        }
    },
    noBlue: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            data[i+2] = 0;
        }
    },
    onlyBlue: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            data[i] = 0;
            data[i+1] = 0;
        }
    },
    killBlue: (data) => {
        for (let i = 0; i < data.length; i+= 4) {
            if((data[i + 2] > ((data[i]) * 1.4)) && (data[i + 2] > ((data[i + 1]) * 1.4))) {
                data[i] = 0;
                data[i+1] = 0;
                data[i+2] = 0;
            }
        }
    }, */
    edgeDetectVX: ({data, width, height}) => {
        // console.log({width, height})
       
        const colorDiff = 240; // any time there is difference in color we call that an edge
        let currH = 0;
        let col = 10; // the color we are currently useing

        for (let e = 0; e < data.length; e+= 4) {
            const currW = ((e / 4) - currH * width);
            
            // if(currW > (width - 2)) console.log({currH, currW})

            /* there are 8 pixels sorounding the selected pixel
                a b c
                d e f
                g h i
            */
            let isEdge = 0;
            [ // note this is for red pxls
                (currW > 0) && (currH > 0) ? e - ((width + 1) * 4) : null, // a
                currH > 0 ? e - (width * 4) : null, // b
                (currW < (width - 1)) && (currH > 0) ? e - ((width - 1) * 4) : null, // c
                currW > 0 ? e - 4 : null, // d
                // e, // selected
                currW < (width - 1) ? e + 4 : null, // f
                (currW > 0) && (currH < (height - 1)) ? e + ((width - 1) * 4) : null, // g
                currH < (height - 1) ? e + (width * 4) : null, // h
                (currW < (width - 1)) && (currH < (height - 1)) ? e + ((width + 1) * 4) : null, // i
            ].forEach(i => { // evaluate - is there an edge ?
                if((i !== null) && ((((data[i] - data[e]) ** 2) > colorDiff) && (((data[i + 1] - data[e + 1]) ** 2 ) > colorDiff) && (((data[i + 2] - data[e + 2]) ** 2) > colorDiff))) isEdge ++;
            });

            const val = (col * isEdge);

            // this fills
            // const val = Math.round(col / (isEdge + 1));

            if(isEdge >= 0) data[e] = val;
            if(isEdge >= 0) data[e + 1] = val;
            if(isEdge >= 0) data[e + 2] = val;

            // this outlines
            // data[e] = isEdge > 7 ? col : 0; // remove r
            // data[e + 1] = isEdge > 6 ? col : 0; // remove g
            // data[e + 2] = isEdge > 6 ? col : 0; // remove b

            if(currW === width - 1) currH ++; // at this point this may be a lie so do this last
        }
    },
    simBlurVX: ({data, width, height}) => { // blur similar colors into one another
        const originalData = data.map(k => k);
        // const colorDiff = 200; // any time there is difference in color we call that an edge
        let currH = 0;
        const roundToNearest = (num, rnd = 10) => num - (num % rnd);
        const withinRange = (v1, v2, range = 10) => Math.abs(v1 - v2) <= range;

        for (let e = 0; e < data.length; e+= 4) {
            const currW = ((e / 4) - currH * width);

            /* there are 8 pixels sorounding the selected pixel
                a b c
                d e f
                g h i
            */
            let count = 1;
            let similar = [originalData[e], originalData[e + 1], originalData[e + 2]];
            [ // note this is for red pxls
                (currW > 0) && (currH > 0) ? e - ((width + 1) * 4) : null, // a
                currH > 0 ? e - (width * 4) : null, // b
                (currW < (width - 1)) && (currH > 0) ? e - ((width - 1) * 4) : null, // c
                currW > 0 ? e - 4 : null, // d
                // e, // selected
                currW < (width - 1) ? e + 4 : null, // f
                (currW > 0) && (currH < (height - 1)) ? e + ((width - 1) * 4) : null, // g
                currH < (height - 1) ? e + (width * 4) : null, // h
                (currW < (width - 1)) && (currH < (height - 1)) ? e + ((width + 1) * 4) : null, // i
            ].forEach(i => { // evaluate - is there an edge ?
                if(
                    (i !== null) && 
                    (
                        //(((originalData[i] - originalData[e]) ** 2) < colorDiff) && // rather than comparing the square to an arbritrary
                        withinRange(originalData[i], originalData[e], 4) &&
                        //(((originalData[i + 1] - originalData[e + 1]) ** 2 ) < colorDiff) && // value lets just compare vals
                        withinRange(originalData[i + 1], originalData[e + 1], 4) &&
                        //(((originalData[i + 2] - originalData[e + 2]) ** 2) < colorDiff) // and get rid of colordiff
                        withinRange(originalData[i + 2], originalData[e + 2], 4)
                    )
                ) {
                    similar = similar.map((v, n) => v + originalData[e + n]);
                    count ++;
                }
            });

            // this fills 
            if(count > 1) {
                // if(e % 10000 === 0) console.log({similar, count})

                similar.forEach((v, i) => {
                    data[e + i] = roundToNearest(v / count, 100);
                });
            }

            // this outlines
            // data[e] = isEdge > 7 ? col : 0; // remove r
            // data[e + 1] = isEdge > 6 ? col : 0; // remove g
            // data[e + 2] = isEdge > 6 ? col : 0; // remove b

            if(currW === width - 1) currH ++; // at this point this may be a lie so do this last
        }
    },
    cutOutVX: ({data, width, height}) => { 
        // const originalData = data.map(k => k);
        let currH = 0;
        let alphaValue = 0; // since 0 is to be ignored in the same way as 255

        for(let rn = 0; rn < 2; rn ++){
            for (let e = rn ? data.length - 4 : 0; rn ? (e > -1) : (e < data.length); e+=(rn ? -4 : 4)) {
                const currW = ((e / 4) - currH * width);
                let pixelComparison = [];
    
                /* there are 8 pixels sorounding the selected pixel
                    a b c
                    d e f
                    g h i
                */
                [ // pxlIndecies rgba
                    (currW > 0) && (currH > 0) ? e - ((width + 1) * 4) : null, // a
                    currH > 0 ? e - (width * 4) : null, // b
                    (currW < (width - 1)) && (currH > 0) ? e - ((width - 1) * 4) : null, // c
                    currW > 0 ? e - 4 : null, // d
                    // e, // selected
                    currW < (width - 1) ? e + 4 : null, // f
                    (currW > 0) && (currH < (height - 1)) ? e + ((width - 1) * 4) : null, // g
                    currH < (height - 1) ? e + (width * 4) : null, // h
                    (currW < (width - 1)) && (currH < (height - 1)) ? e + ((width + 1) * 4) : null, // i
                ].forEach(i => {
                    if(i !== null && data[i + 3] < 255){
                        const pixelDiff = [
                            Math.abs(data[i] - data[e]),
                            Math.abs(data[i + 1] - data[e + 1]),
                            Math.abs(data[i + 2] - data[e + 2]),
                        ];
    
                        pixelComparison.push([pixelDiff, data[i + 3]]);
                    }
                })
    
                // at this point "pixelComparison" includes all the info we need to determine similarity
                let similar = {};
                pixelComparison.forEach(arr => {
                    // const pxlDiff = arr[0];
                    // const alpha = arr[1];
                    // does this pxl resemble any of the surrounding ones
                    const sum = arr[0][0] + arr[0][1] + arr[0][2];
                    if(
                        arr[0][0] < 7 &&
                        arr[0][1] < 7 &&
                        arr[0][2] < 7 // &&
                        // sum < 13
                    ) {
                        if(((similar[arr[1]]) && (similar[arr[1]] > sum)) || (!similar[arr[1]])) similar[arr[1]] = sum;
                    }
                })
    
                if(Object.keys(similar).length > 0){
                    // if(Object.keys(similar).length > 1) console.log(similar);
                    let min = [1000000, null];
                    Object.entries(similar).forEach(arr => { // use entries
                        if(arr[0] < min[0]) min = [arr[1], arr[0]];
                    })
    
                    data[e + 3] = min[1];
    
                } else if(alphaValue < 254) {
                    // console.log({alphaValue, e})
                    alphaValue++;
                    data[e + 3] = alphaValue;
                }
    
                if(currW === width - 1) currH ++; // at this point this may be a lie so do this last
            }
        }
    },
    cutOutMoreVX: ({data, width, height, pixColor, range}) => {  
        // there is one issue here - if a is similar to b and b is similar to c then c may not be similar to a 
        // const originalData = data.map(k => k);
        let currH = 0;
        let holdAlpha = [...new Array(data.length >> 2)].fill(-1);
        let pixelColorRef = {}; // to link alphaValue to color
        let alphaCount = [];
        let alphaValue = -1;

        for (let e = 0; e < data.length; e+=4) {
            const currW = ((e / 4) - currH * width);
            let pixelComparison = [];

            /* there are 8 pixels sorounding the selected pixel
                a b c
                d e f
                g h i
            */
            [ // pxlIndecies rgba
                (currW > 0) && (currH > 0) ? e - ((width + 1) * 4) : null, // a
                currH > 0 ? e - (width * 4) : null, // b
                (currW < (width - 1)) && (currH > 0) ? e - ((width - 1) * 4) : null, // c
                currW > 0 ? e - 4 : null, // d
                // e, // selected
                // currW < (width - 1) ? e + 4 : null, // f
                // (currW > 0) && (currH < (height - 1)) ? e + ((width - 1) * 4) : null, // g
                // currH < (height - 1) ? e + (width * 4) : null, // h
                // (currW < (width - 1)) && (currH < (height - 1)) ? e + ((width + 1) * 4) : null, // i
            ].forEach(i => { // only a -> d are needed for this
                const alpha = holdAlpha[(i >> 2)];
                if(i !== null && alpha > -1){
                    const pixelDiff = [
                        Math.abs(pixelColorRef[alpha][0] - data[e]),
                        Math.abs(pixelColorRef[alpha][1] - data[e + 1]),
                        Math.abs(pixelColorRef[alpha][2] - data[e + 2]),
                    ];

                    pixelComparison.push([pixelDiff, holdAlpha[(i >> 2)]]);
                }
            })

            // at this point "pixelComparison" includes all the info we need to determine similarity
            let similar = {};
            pixelComparison.forEach(arr => {
                // does this pxl resemble any of the surrounding ones
                const sum = arr[0][0] + arr[0][1] + arr[0][2];
                if(
                    arr[0][0] < range &&
                    arr[0][1] < range &&
                    arr[0][2] < range // &&
                    // sum < 13
                ) {
                    if(((similar[arr[1]]) && (similar[arr[1]] > sum)) || (!similar[arr[1]])) similar[arr[1]] = sum;
                }
            })

            if(Object.keys(similar).length > 0){
                // if(Object.keys(similar).length > 1) console.log(similar);
                let min = [1000000, null];
                Object.entries(similar).forEach(arr => {
                    if(arr[0] < min[0]) min = [arr[1], arr[0]];
                })

                holdAlpha[(e >> 2)] = min[1];
                pixelColorRef[alphaValue] = [data[e], data[e + 1], data[e + 2]];
                alphaCount[min[1]] += 1;

            } else {
                alphaValue++;
                holdAlpha[(e >> 2)] = alphaValue;
                pixelColorRef[alphaValue] = [data[e], data[e + 1], data[e + 2]];
                alphaCount.push(1);
            }

            if(currW === width - 1) currH ++; // at this point this may be a lie so do this last
        }

        // at this point alphaCount needs to be sorted and let us know what 255 values evist most often
        let obj = {}; // value: index
        const mx = 1; // 255
        alphaCount.map((v, n) => {
            return [v, n];
        }).toSorted((a, b) => b[0] - a[0]).filter((v, i) => i < mx).map(arr => arr[1]).forEach((v, i) => {
            obj[v] = i;
        });

        // now lets cut out some of the biggest sections
        holdAlpha.forEach((v, i) => {
            const alphaLocation = (i << 2) + 3;
            if(typeof obj[v] === 'number'){
                data[alphaLocation] = obj[v];
            }
        })

        // console.log(arr, obj)
    },
    killAlpha: ({data}) => {
        for (let i = 0; i < data.length; i+= 4) {
            if(data[i + 3] < 255) data[i + 3] = 0;
        }
    },
    resetAlpha: ({data}) => {
        for (let i = 0; i < data.length; i+= 4) {
            if(data[i + 3] < 255) {
                data[i] = 0
                data[i + 1] = 0
                data[i + 2] = 0
                data[i + 3] = 0
            };
        }
    },
    raizeCol: ({data, pixColor}) => {
        for (let i = 0; i < data.length; i+= 4) {
            if(
                Math.abs(data[i] - pixColor.r) < pixColor.rangeR &&
                Math.abs(data[i + 1] - pixColor.b) < pixColor.rangeG && 
                Math.abs(data[i + 2] - pixColor.g) < pixColor.rangeB
            ) {
                data[i + 3] = 0
            };
        }
    },
    depth: ({data}) => {
        /* I want to denote different layers of depth
            the further back the less focused it becomes
            so we will need multiple functions 
                isInFocus - yes no maybe
                isOutOfFocusBy - what out of focus value will we assume
                isConnectedTo - notes the connection type of a pixel to the pixels next to it 
                    (similar - disimilar - increasing - decreasing ...)
                    choose a point in the center and then compare to it if something is over or behind it
                texture - color is one thing but we need to determine things by texture else color paterns, tatoos etc will throw us off
            note: we need to create a concept
        */
    },
    blurSimilar: ({data}) => {
        /* 
            what if we blur similar fields ??? in effect avoiding edges and bluring the insides
        */
    }/*,
    raizeColVX: ({data, width, height, pixColor, range}) => {  
        // there is one issue here - if a is similar to b and b is similar to c then c may not be similar to a 
        // const originalData = data.map(k => k);
        let currH = 0;
        let holdAlpha = [...new Array(data.length >> 2)].fill(-1);
        let pixelColorRef = {}; // to link alphaValue to color
        let alphaCount = [];
        let alphaValue = -1;

        for (let e = 0; e < data.length; e+=4) {
            const currW = ((e / 4) - currH * width);
            let pixelComparison = [];

            /* there are 8 pixels sorounding the selected pixel
                a b c
                d e f
                g h i
            * /
            [ // pxlIndecies rgba
                (currW > 0) && (currH > 0) ? e - ((width + 1) * 4) : null, // a
                currH > 0 ? e - (width * 4) : null, // b
                (currW < (width - 1)) && (currH > 0) ? e - ((width - 1) * 4) : null, // c
                currW > 0 ? e - 4 : null, // d
                // e, // selected
                currW < (width - 1) ? e + 4 : null, // f
                (currW > 0) && (currH < (height - 1)) ? e + ((width - 1) * 4) : null, // g
                currH < (height - 1) ? e + (width * 4) : null, // h
                (currW < (width - 1)) && (currH < (height - 1)) ? e + ((width + 1) * 4) : null, // i
            ].forEach(i => { // only a -> d are needed for this
                const alpha = holdAlpha[(i >> 2)];
                if(i !== null && alpha > -1){
                    const pixelDiff = [
                        Math.abs(pixelColorRef[alpha][0] - data[e]),
                        Math.abs(pixelColorRef[alpha][1] - data[e + 1]),
                        Math.abs(pixelColorRef[alpha][2] - data[e + 2]),
                    ];

                    pixelComparison.push([pixelDiff, holdAlpha[(i >> 2)]]);
                }
            })

            // at this point "pixelComparison" includes all the info we need to determine similarity
            let similar = {};
            pixelComparison.forEach(arr => {
                // does this pxl resemble any of the surrounding ones
                const sum = arr[0][0] + arr[0][1] + arr[0][2];
                if(
                    arr[0][0] < range &&
                    arr[0][1] < range &&
                    arr[0][2] < range // &&
                    // sum < 13
                ) {
                    if(((similar[arr[1]]) && (similar[arr[1]] > sum)) || (!similar[arr[1]])) similar[arr[1]] = sum;
                }
            })

            if(Object.keys(similar).length > 0){
                // if(Object.keys(similar).length > 1) console.log(similar);
                let min = [1000000, null];
                Object.entries(similar).forEach(arr => {
                    if(arr[0] < min[0]) min = [arr[1], arr[0]];
                })

                holdAlpha[(e >> 2)] = min[1];
                pixelColorRef[alphaValue] = [data[e], data[e + 1], data[e + 2]];
                alphaCount[min[1]] += 1;

            } else {
                alphaValue++;
                holdAlpha[(e >> 2)] = alphaValue;
                pixelColorRef[alphaValue] = [data[e], data[e + 1], data[e + 2]];
                alphaCount.push(1);
            }

            if(currW === width - 1) currH ++; // at this point this may be a lie so do this last
        }

        // at this point alphaCount needs to be sorted and let us know what 255 values evist most often
        let obj = {}; // value: index
        const mx = 1; // 255
        alphaCount.map((v, n) => {
            return [v, n];
        }).toSorted((a, b) => b[0] - a[0]).filter((v, i) => i < mx).map(arr => arr[1]).forEach((v, i) => {
            obj[v] = i;
        });

        // now lets cut out some of the biggest sections
        holdAlpha.forEach((v, i) => {
            const alphaLocation = (i << 2) + 3;
            if(typeof obj[v] === 'number'){
                data[alphaLocation] = obj[v];
            }
        })

        // console.log(arr, obj)
    } */
}

/**
 * pass another arr with weights to this and return the indexes with their weight
 * @param {*} filterMatrixConst 0 for a 1*1 filter, 1 for a 3*3 filter 2 for a 5*5 filter ...
 * @param {*} currentPixelLocation ...
 * @param {*} width in px
 * @param {*} height in px
 * @returns an array of relevant indexes
 */
function runFilter(filterMatrixConst = 1, currentPixelLocation, width, height) {
    // calculate the i values required for the filter to run

    // filterMatrixConst = 0
    // i

    // filterMatrixConst = 1
    // i-4-w  i-w  i+4-w
    // i-4    i    i+4
    // i-4+w  i+w  i+4+w

    // filterMatrixConst = 2
    // i-8-2w  i-4-2w  i-2w  i+4-2w   i+8-2w
    // i-8-w   i-4-w   i-w   i+4-w    i+8-w
    // i-8     i-4     i     i+4      i+8
    // i-8+w   i-4+w   i+w   i+4+w    i+8+w
    // i-8+2w  i-4+2w  i+2w  i+4+2w   i+8+2w

    const cpl = currentPixelLocation >> 2; // cause pixels so every 4

    const w = cpl % width
    const h = (cpl - w) / width

    let arr = [];
    let hei = 1 - filterMatrixConst;

    for(let wk = -filterMatrixConst; wk <= filterMatrixConst; wk++){
        const curH = h + wk;
      
        for(let j = -filterMatrixConst; j <= filterMatrixConst; j++){
            const curW = w + j;
            if(curW >= 0 && curW < width && curH >= 0 && curH < height) arr.push(((j + (width * wk)) << 2) + currentPixelLocation); // << 2 cause pixels so * 4 
        }
        hei ++;
    }

    return arr
}

function truncateColor(value) {
    if (value < 0) {
      value = 0;
    } else if (value > 255) {
      value = 255;
    }
  
    return value;
}

function getRGBColor(hex)
{
  var colorValue;

  if (hex[0] === '#') {
    hex = hex.substr(1);
  }
  
  colorValue = parseInt(hex, 16);
  
  return {
    r: colorValue >> 16,
    g: (colorValue >> 8) & 255,
    b: colorValue & 255
  }
}

function createGradient(colorA, colorB) {   
    // Values of the gradient from colorA to colorB
    var gradient = [];
    // the maximum color value is 255
    var maxValue = 255;
    // Convert the hex color values to RGB object
    var from = getRGBColor(colorA);
    var to = getRGBColor(colorB);
    
    // Creates 256 colors from Color A to Color B
    for (var i = 0; i <= maxValue; i++) {
      // IntensityB will go from 0 to 255
      // IntensityA will go from 255 to 0
      // IntensityA will decrease intensity while instensityB will increase
      // What this means is that ColorA will start solid and slowly transform into ColorB
      // If you look at it in other way the transparency of color A will increase and the transparency of color B will decrease
      var intensityB = i;
      var intensityA = maxValue - intensityB;
      
      // The formula below combines the two color based on their intensity
      // (IntensityA * ColorA + IntensityB * ColorB) / maxValue
      gradient[i] = {
        r: (intensityA*from.r + intensityB*to.r) / maxValue,
        g: (intensityA*from.g + intensityB*to.g) / maxValue,
        b: (intensityA*from.b + intensityB*to.b) / maxValue
      };
    }
  
    return gradient;
}