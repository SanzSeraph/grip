import * as p5 from 'p5';
import UI from '../ui/ui.js';
import { GameMap } from '../map/map.js';

export default class Grip {
  private lib: p5;
  private map: GameMap;
  private ui: UI;

  constructor(p5: p5)
  {
    this.lib = p5;
    this.lib.createCanvas(1536, 768);
    this.ui = this.ui = new UI(this.lib, this.lib.select('#ui'));
  }

  start() {
    this.lib.select('canvas').hide();
    this.map = new GameMap(this.lib, {
      seed: this.lib.generateSeed(),
      detail: 16,
      width: this.lib.width * this.lib.pixelDensity(),
      height: this.lib.height * this.lib.pixelDensity(),
      oceanLevel: 0.6
    });
    
    this.map.render();
    this.lib.image(this.map.image, 0, 0);
  }
}