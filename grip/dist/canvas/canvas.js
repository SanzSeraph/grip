export default class Canvas {
    constructor(canvas, context = '2d') {
        this.context = context;
        this.canvas = canvas;
        this.renderingContext = this.canvas.getContext(context);
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    get renderingContext2d() {
        return this.renderingContext;
    }
    fill(color) {
        if (this.context == '2d') {
            let image = this.renderingContext2d.createImageData(this.canvas.width, this.canvas.height);
            for (let i = 0; i < image.data.length; i += 4) {
                for (let j = 0; j < 4; j++) {
                    image.data[i + j] = color.getComponent(j);
                }
            }
            this.renderingContext2d.putImageData(image, 0, 0);
        }
    }
    draw(path, x, y) {
        let canvasPath = new Path2D();
        canvasPath.moveTo(x, y);
        for (let i = 1; i < path.vertices.length; i++) {
            let vertex = path.vertices[i];
            canvasPath.lineTo(vertex.x + x, -vertex.y + y);
        }
        if (path.close) {
            canvasPath.closePath();
        }
        this.renderingContext2d.strokeStyle = 'rgb(255, 255, 255)';
        this.renderingContext2d.stroke(canvasPath);
    }
}
//# sourceMappingURL=canvas.js.map