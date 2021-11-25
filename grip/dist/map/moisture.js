import Layer from './layer.js';
try {
    importScripts('./layer.js');
}
catch (e) {
    console.log(e);
}
function coordinate(x, y) {
    let xWave = (Math.sin(x / (this.options.width / (2 * Math.PI))) + 1) * 0.5;
    let zWave = Math.sin(x / (this.options.width / Math.PI));
    let absoluteXwave = xWave * (this.options.width / 3);
    let absoluteZwave = zWave * (this.options.width / 2);
    let normalMoisture = this.lib.noise(absoluteXwave * 0.01, y * 0.01, absoluteZwave * 0.01);
    let moisture = this.lib.map(normalMoisture, 0.1, 0.9, 0, 1);
    let elevation = this.baseLayers[0].coordinate(x, y);
    let aboveSealevel = this.lib.map(elevation, this.options.oceanLevel, 1, 0, 1);
    let normalNetMoisture = this.lib.lerp(1 - aboveSealevel, moisture, 0.85);
    let netMoisture = this.lib.map(normalNetMoisture, 0.2, 1, 0, 1);
    return netMoisture;
}
function render() {
    this.image.loadPixels();
    let beachColor = this.lib.color(255, 255, 227, 180);
    let vegetationColor = this.lib.color(0, 160, 0, 200);
    this.lib.forPixels(this.options.width, this.options.height, (i, x, y) => {
        let currentColor = null;
        let elevation = this.baseLayers[0].coordinate(x, y);
        let moisture = coordinate.call(this, x, y);
        if (elevation > this.options.oceanLevel) {
            currentColor = this.lib.lerpColor(beachColor, vegetationColor, moisture);
        }
        else {
            currentColor = this.lib.color(0, 0, 0, 0);
        }
        for (let j = 0; j < 4; j++) {
            this.image.pixels[i + j] = currentColor.levels[j];
        }
    });
    this.image.updatePixels();
}
export default class Moisture extends Layer {
    constructor(options, baseLayers) {
        super(options, baseLayers);
        this.options.seed = this.lib.generateSeed();
        this.lib.noiseSeed(this.options.seed);
    }
    coordinate(x, y, z) {
        return coordinate.call(this, x, y, z);
    }
    render() {
        return new Promise((resolve, reject) => {
            let worker = new Worker('./moisture.js');
            worker.onmessage = e => {
                this.image.loadPixels();
                this.image.pixels.set(e.data);
                this.image.updatePixels();
                worker.terminate();
                resolve(this);
            };
            worker.postMessage(this.options);
        });
    }
}
try {
    if (self instanceof WorkerGlobalScope) {
        onmessage = e => {
            let options = e.data;
            let moisture = new Moisture(options);
            render.call(moisture);
            postMessage(moisture.image);
        };
    }
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=moisture.js.map