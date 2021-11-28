import p5module from '../../node_modules/@types/p5/index'

interface p5InstanceExtensions {
  forPixels(width: number, height: number, callback: (i: number, x: number, y: number) => void): void; 
  generateSeed(): number; 
  invertedSquare(x: number): number;
  reverseSquare(x: number): number;
  reverseInvertedSquare(x: number): number;
  sCurve(x: number): number;
  loadText(file: string, callback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): object;
}

p5.p5.prototype.forPixels = function(width, height, callback) {
    let i = 0;
    let x = 0;
    let y = 0;
    let pixelsLength = width * height * 4;

    while (i < pixelsLength) {
      callback(i, x, y);

      x++;

      if (x >= width) {
        x = 0;
        y++;
      }

      i += 4;
    }
};

p5.prototype.generateSeed = function() {
  return this.map(this.random(), 0, 1, 0, Number.MAX_SAFE_INTEGER);
};

p5.prototype.invertedSquare = function(x) { return (1 - x)**2; };
p5.prototype.reverseSquare = function(x) { return 1 - x**2; };
p5.prototype.reverseInvertedSquare = function(x) { return 1 - (1 - x**2); };
p5.prototype.sCurve = function(x) {
  if (x < 0.5) {
    return this.reverseInvertedSquare(x);
  }
  else {
    return x**2;
  }
};

p5.prototype.loadText = function(url, callback, errorCallback) {
  let bytesToText = data => {
    let text = new TextDecoder().decode(data.bytes);
    callback(text);
  };
  
  return this.loadBytes(url, bytesToText, errorCallback);
};