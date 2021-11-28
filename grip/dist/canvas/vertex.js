export default class Vertex2D {
    constructor(x, y, ...adjacents) {
        this.x = x;
        this.y = y;
        this.adjacents = adjacents || [];
    }
    addAdjacent(vertex) {
        this.adjacents.push(vertex);
    }
}
//# sourceMappingURL=vertex.js.map