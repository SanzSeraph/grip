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
    let normalElevation = this.lib.noise(absoluteXwave * 0.01, y * 0.01, absoluteZwave * 0.005);
    return this.lib.map(normalElevation, 0.1, 0.9, 0, 1);
}
function render() {
    this.image.loadPixels();
    this.lib.forPixels(this.options.width, this.options.height, (i, x, y) => {
        let elevation = this.coordinate(x, y);
        let greyscale = Math.floor(this.lib.map(elevation, 0, 1, 30, 255));
        for (let j = 0; j < 3; j++) {
            this.image.pixels[i + j] = greyscale;
        }
        this.image.pixels[i + 3] = 255;
    });
    this.image.updatePixels();
}
export default class Land extends Layer {
    constructor(options, baseLayers) {
        super(options, baseLayers);
    }
    coordinate(x, y) {
        return coordinate.call(this, x, y);
    }
    render() {
        return new Promise((resolve, reject) => {
            let worker = new Worker('./land.js');
            worker.onmessage = (e) => {
                this.image.loadPixels();
                this.image.pixels.set(e.data);
                this.image.updatePixels();
                resolve(this);
                worker.terminate();
            };
            worker.postMessage(this.options);
        });
    }
}
try {
    if (self instanceof WorkerGlobalScope) {
        onmessage = (d) => {
            let options = d.data;
            let land = new Land(options);
            render.call(land);
            postMessage(land.image);
        };
    }
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=land.js.map