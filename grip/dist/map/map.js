import Land from './land.js';
import Ocean from './ocean.js';
import Moisture from './moisture.js';
import Temperature from './temperature.js';
export class GameMap {
    constructor(p5, options) {
        this.lib = p5;
        this.options = options || {};
        this.land = new Land(this.options);
        this.ocean = new Ocean(this.options, [this.land]);
        this.moisture = new Moisture(this.options, [this.land]);
        let optionsClone = Object.assign(this.options);
        optionsClone.detail = 1.5 * this.options.detail;
        this.temperature = new Temperature(optionsClone, 0, [this.land]);
        this.image = this.lib.createImage(this.options.width, this.options.height);
    }
    render() {
        let renderLand = this.land.render();
        let renderOcean = this.ocean.render();
        let renderMoisture = this.moisture.render();
        let renderTemperature = this.temperature.render();
        Promise.all([renderLand, renderOcean, renderMoisture, renderTemperature]).then((layers) => {
            this.image.copy(this.land.image, 0, 0, this.options.width, this.options.height, 0, 0, this.options.width, this.options.height);
            this.blend(this.ocean.image);
            this.blend(this.moisture.image);
            this.blend(this.temperature.image);
        });
    }
    blend(image) {
        this.image.blend(image, 0, 0, this.options.width, this.options.height, 0, 0, this.options.width, this.options.height, this.lib.BLEND);
    }
}
//# sourceMappingURL=map.js.map