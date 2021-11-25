import * as p5 from '../../node_modules/@types/p5/index';
try {
    importScripts('../../p5/p5.js', '../map.js');
}
catch (e) {
    console.log(e);
}
export default class Layer {
    constructor(options, baseLayers = []) {
        this.lib = new p5(s => s);
        this.options = options || {
            seed: this.lib.generateSeed(),
            detail: 16,
            width: 1536,
            height: 768,
            oceanLevel: 0.55
        };
        this.baseLayers = baseLayers;
        this.lib.noiseSeed(this.options.seed);
        this.lib.noiseDetail(this.options.detail, 0.5);
        this.image = this.lib.createImage(this.options.width, this.options.height);
    }
}
//# sourceMappingURL=layer.js.map