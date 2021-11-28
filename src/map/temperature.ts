import Layer from './layer.js';
import { IGameMapOptions } from './map.js';

try {
  importScripts('./layer.js');
} catch (e) {
  console.log(e);
}

function latitudeCurve(this: Temperature, y: number) {
  let halfHeight = this.options.height / 2;
  
  return (-((y - halfHeight)**2) / halfHeight**2) + 1;
}

function coordinate(this: Temperature, x: number, y: number) {
  let xWave = (Math.sin(x / (this.options.width / (2 * Math.PI))) + 1) * 0.5;
  let zWave = Math.sin(x / (this.options.width / Math.PI));

  let absoluteXwave = xWave * (this.options.width / 3);
  let absoluteZwave = zWave * (this.options.width / 2);
  let normalTemperatureNoise = this.lib.noise(absoluteXwave * 0.01, y * 0.01, absoluteZwave * 0.01);
  let temperatureNoise = this.lib.map(normalTemperatureNoise, 0.1, 0.9, 0, 1);   
  let elevation = this.baseLayers[0].coordinate(x, y);
  let aboveSealevel = elevation - this.options.oceanLevel;

  if (aboveSealevel <= 0) {
    aboveSealevel = 0;
  }

  let aboveSealevelNormalized = this.lib.map(aboveSealevel, 0, 1 - this.options.oceanLevel, 0, 1);
  let latitude = latitudeCurve.call(this, y);

  let normalNetTemperature = latitude * (1 - aboveSealevelNormalized);
  normalNetTemperature = this.lib.lerp(normalNetTemperature, 1 - temperatureNoise, 0.15);

  let netTemperature = this.lib.map(normalNetTemperature, 0.2, 1, 0, 1);

  return netTemperature;
}

function render(this: Temperature) {
  this.image.loadPixels();
          
  this.lib.forPixels(this.options.width, this.options.height, (i, x, y) => {
    let currentColor = null;
    let temperature = coordinate.call(this, x, y);
    let absoluteTemperature = this.lib.map(temperature, 0, 1, -20, 32);

    if (absoluteTemperature <= -10) {   
      currentColor = this.lib.color(255, 255, 255, this.lib.map(absoluteTemperature, -20, -10, 255, 225));
    }
    else if (absoluteTemperature > -10 && absoluteTemperature <= 0) {
      currentColor = this.lib.color(255, 255, 255, this.lib.map(absoluteTemperature, -10, 0, 225, 0));
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

export default class Temperature extends Layer {
  private season: number;

  constructor(options: IGameMapOptions, season?: number, baseLayers?: Layer[]) {
    super(options, baseLayers);
    this.season = 0;
    this.options.seed = this.lib.map(this.lib.random(), 0, 1, 0, Number.MAX_SAFE_INTEGER);
    this.lib.noiseSeed(this.options.seed);
  }
  
  coordinate(x: number, y: number, z: number) {
    return coordinate.call(this, x, y);
  }
  
  render() {
    return new Promise<Temperature>((resolve, reject) => {
      let worker = new Worker('./temperature.js');

      worker.onmessage = e => {
        this.image.loadPixels();
        this.image.pixels.set(e.data);
        this.image.updatePixels();
        worker.terminate();
        resolve(this);
      };
    });
  }
}

try {
  if (self instanceof WorkerGlobalScope)
  {
    onmessage = e => {
      let options = <IGameMapOptions>e.data;
      let temperature = new Temperature(options);

      render.call(temperature);
      postMessage(temperature.image);
    };
  }
} catch (e) {
  console.log(e);
}