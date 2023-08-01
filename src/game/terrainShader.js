const regions = [
    {height: 0.1, key: 'brownGray'},
    {height: 0.29, key: 'sandy'},
    {height: 0.30, key: 'cliffGray'},
    {height: 0.45, key: 'greenLight'},
    {height: 0.5, key: 'greenLush'},
    {height: 0.65, key: 'greenDeep'},
    {height: 0.70, key: 'wastedGreen'},
    {height: 0.75, key: 'brown'},
    {height: 0.95, key: 'brownGray'},
    {height: 0.98, key: 'grayDark'},
    {height: 0.99, key: 'grayLight'},
    {height: 1, key: 'white'}
]

const colors = {
    white: [[1,1,1], [0.99,1,1], [0.99, 0.99, 0.99], [1, 0.989, 0.99]],
    grayLight: [[0.9,0.91,0.9], [0.87,0.86,0.86], [0.78, 0.8, 0.81], [0.92, 0.91, 0.87]],
    grayDark: [[0.41,0.41,0.4], [0.5,0.52,0.51], [0.3, 0.3, 0.3], [0.21, 0.21, 0.2]],
    brownGray: [[0.3176, 0.3569, 0.302], [0.298, 0.2588, 0.188], [0.247, 0.2, 0.1098], [0.35686, 0.341176, 0.30588]],
    wastedGreen: [[0.243, 0.4392, 0.28235], [0.149, 0.4196, 0.2039], [0.2941, 0.40784, 0.262745]],
    greenDeep: [[0.08235, 0.2471, 0.07451], [0.023529, 0.266667, 0.12941]],
    greenLush: [[0.0588, 0.349, 0.0549], [0.0470588, 0.4196, 0.027491]],
    greenLight: [[0.2916, 0.5294, 0.0862745], [0.2916, 0.607843, 0.05098], [0.145, 0.65882, 0.117647]],
    cliffGray: [[0.41,0.41,0.4], [0.3, 0.3, 0.3], [0.87,0.86,0.86]],
    sandy: [[0.7882, 0.7255, 0.447], [0.95686, 0.90588, 0.67843], [0.898, 0.870588, 0.75294]],
    brown: [[0.2470588, 0.1921568, 0.470588], [0.2078431, 0.1764705, 0.823529], [0.22745098, 0.2078431, 0.1528411], [0.2588235, 0.25098, 0.231372549]]
}

function finalColor(arr){
    const arr1 = arr[rand() % arr.length]
    const arr2 =  arr[(rand() + 3) % arr.length]
    const min = minerColorMutation()
    return [
       ((arr1[0] + arr2[0]) / 2) + min,
       ((arr1[1] + arr2[1]) / 2) + min,
       ((arr1[2] + arr2[2]) / 2) + min
    ]
}

const minerColorMutation = () => Math.random() / 100
const rand = () => Math.round((Math.random() * 10) + 1)
  
export function terrainShader(h, monocrome = false) {
    let col = [h, h, h];
    if(monocrome) return col;
  
    for(let i = 0; i < regions.length; i++) {
      if(h <= regions[i].height) {
        col = finalColor(colors[regions[i].key])
        break;
      }
    }
  
    return col
}