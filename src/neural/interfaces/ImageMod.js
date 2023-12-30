
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
          data[i] = Math.round(data[i] / 3); // Invert Red
          data[i+1] = Math.round(data[i+1] / 3); // Invert Green
          data[i+2] = Math.round(data[i+2] / 3); // Invert Blue
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
        const filterMatrixConst = 1; // 3*3

        for (let i = 0; i < data.length; i+= 4) {
            const pxlArr = runFilter(filterMatrixConst, i, width, height); // red pixel indecies
            let rgb = [0, 0, 0];
            const valArr = arr.forEach(a => {
                // atm 'a' is kinda wrong cause we don't account for the offset bing 4 instead of 1
                // so we get the relevant i values that we need to identify the pixel...
                let iVal = a << 2;

                rgb = [
                    rgb[0] + data[iVal],
                    rgb[1] + data[iVal + 1],
                    rgb[2] + data[iVal + 2]
                ]
            });

            data[i] = Math.floor(rgb[0] / 9); // Reduce Red
            data[i+1] = Math.floor(rgb[1] / 9); // Invert Green
            data[i+2] = Math.floor(rgb[2] / 9); // Invert Blue
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

    const w = currentPixelLocation % width
    const h = (currentPixelLocation - w) / width

    let arr = [];
    let hei = 1 - filterMatrixConst;

    for(let wk = -filterMatrixConst; wk <= filterMatrixConst; wk++){
        const curH = h + wk;
      
        for(let j = -filterMatrixConst; j <= filterMatrixConst; j++){
            const curW = w + j;
            if(curW >= 0 && curW < width && curH >= 0 && curH < height) arr.push(j + (width * wk) + currentPixelLocation)
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