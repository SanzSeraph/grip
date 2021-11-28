import Land from './land.js';
import Layer from './layer.js';
import { IGameMapOptions } from './map.js';

try {
  importScripts('./layer.js');
} catch (e) {
  console.log(e);
}

function coordinate(this: Ocean, x: number, y: number) {
  return this.baseLayers[0].coordinate(x, y);
}

function render(this: Ocean) {
  let oceanColor = this.lib.color(255 / 4, 255 / 4 * 2, 255, 140);
  let beachColor = this.lib.color(255, 255, 227, 200);
  let currentColor = null;
  let margin = 0.03;
  let beachLevel = this.options.oceanLevel - margin;

  this.image.loadPixels();        

  this.lib.forPixels(this.options.width, this.options.height, (i, x, y) => {
    let elevation = coordinate.call(this, x, y);

    if (elevation < this.options.oceanLevel) {
      currentColor = this.lib.lerpColor(oceanColor, beachColor, (elevation - beachLevel) / margin);
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

export default class Ocean extends Layer {
  constructor(options: IGameMapOptions, baseLayers?: Layer[]) {
    super(options, baseLayers);
  }
  
  coordinate(x, y) {
    return coordinate.call(this, x, y);    
  }
  
  render() {
    return new Promise<Ocean>((resolve, reject) => {
      let worker = new Worker('./ocean.js');
      
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
  if (self instanceof WorkerGlobalScope)
  {
    onmessage = e => {
      let options = <IGameMapOptions>e.data;
      let ocean = new Ocean(options, [ new Land(options) ]);

      render.call(ocean);
      postMessage(ocean.image);
    };
  }
} catch (e) {
  console.log(e);
}