
export const ModObject = {
    invertColors: (data) => {
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
    },/*
    edgeDetectVX_crochet: (data, width, height) => {
        // console.log({width, height})
       
        const colorDiff = 400; // any time there is difference in color we call that an edge
        let currH = 0;
        let col = 140; // the color we are currently useing

        for (let e = 0; e < data.length; e+= 4) {
            const currW = ((e / 4) - currH * width);
            
            // if(currW > (width - 2)) console.log({currH, currW})

            /* there are 8 pixels sorounding the selected pixel
                a b c
                d e f
                g h i
            * /
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
                if((i !== null) && ((((data[i] - data[e]) ** 2) > colorDiff) || (((data[i + 1] - data[e + 1]) ** 2 ) > colorDiff) || (((data[i + 2] - data[e + 2]) ** 2) > colorDiff))) isEdge ++;
            });

            // this fills 
            if(isEdge > 2) data[e] = col;
            // if(isEdge > 2) data[e + 1] = col;
            // if(isEdge > 2) data[e + 2] = col;

            // this outlines
            //data[e] = isEdge > 7 ? col : 0; // remove r
            data[e + 1] = isEdge > 4 ? col : 0; // remove g
            data[e + 2] = isEdge > 6 ? col : 0; // remove b

            if(currW === width - 1) currH ++; // at this point this may be a lie so do this last
        }
    }, */
    edgeDetectVX: (data, width, height) => {
        // console.log({width, height})
       
        const colorDiff = 200; // any time there is difference in color we call that an edge
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

            // this fills 
            const val = (col * isEdge);

            if(isEdge >= 0) data[e] = val;
            if(isEdge >= 0) data[e + 1] = val;
            if(isEdge >= 0) data[e + 2] = val;

            // this outlines
            // data[e] = isEdge > 7 ? col : 0; // remove r
            // data[e + 1] = isEdge > 6 ? col : 0; // remove g
            // data[e + 2] = isEdge > 6 ? col : 0; // remove b

            if(currW === width - 1) currH ++; // at this point this may be a lie so do this last
        }
    }
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