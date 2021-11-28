import Vertex2D from './vertex.js';
import RNG from '../random.js';
import Angle from './angle.js';
export default class Path {
    constructor() {
        this.vertices = [];
    }
    static generate(complexity, minLength, maxLength, minAngle, maxAngle, close, appendTo) {
        let path = new Path();
        path.close = close;
        if (appendTo) {
            path.addVertex(appendTo.vertices[appendTo.vertices.length - 1]);
        }
        else {
            path.addVertex(new Vertex2D(0, 0));
        }
        for (let i = 0; i <= complexity; i++) {
            let last = path.vertices[path.vertices.length - 1];
            let angle = path.generateAngle(minAngle, maxAngle);
            let length = path.generateLength(minLength, maxLength);
            let relativeX = path.calculateX(angle, length);
            let relativeY = path.calculateY(angle, length);
            let absoluteX = last.x + relativeX;
            let absoluteY = last.y + relativeY;
            path.addVertex(new Vertex2D(absoluteX, absoluteY));
        }
        return path;
    }
    static generatePolygon(complexity, minSide, maxSide, minAngle, maxAngle) {
        let path = new Path();
        path.close = true;
        path.addVertex(new Vertex2D(0, 0));
        let lastAngle = 0;
        for (let i = 1; i < complexity; i++) {
            let angle = new Angle(path.generateAngle(minAngle, maxAngle).degrees + lastAngle);
            let length = path.generateLength(minSide, maxSide);
            let relativeX = path.calculateX(angle, length);
            let relativeY = path.calculateY(angle, length);
            path.addVertex(new Vertex2D(relativeX, relativeY));
            lastAngle = angle.degrees;
        }
        return path;
    }
    addVertex(vertex) {
        if (this.vertices.length) {
            vertex.addAdjacent(this.vertices[this.vertices.length - 1]);
        }
        this.vertices.push(vertex);
    }
    generateAngle(min, max) {
        let rng = new RNG();
        let degrees = rng.generateWeighted(min, max, RNG.SMean);
        return new Angle(degrees);
    }
    generateLength(min, max) {
        let rng = new RNG();
        return rng.generateWeighted(min, max, RNG.SMean);
    }
    calculateX(angle, length) {
        return Math.cos(angle.radians) * length;
    }
    calculateY(angle, length) {
        return Math.sin(angle.radians) * length;
    }
}
//# sourceMappingURL=path.js.map