export class Color {
    constructor(r, g, b, a) {
        this.components = [];
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    get r() {
        return this.components[0];
    }
    set r(value) {
        this.components[0] = value;
    }
    get g() {
        return this.components[1];
    }
    set g(value) {
        this.components[1] = value;
    }
    get b() {
        return this.components[2];
    }
    set b(value) {
        this.components[2] = value;
    }
    get a() {
        return this.components[3];
    }
    set a(value) {
        this.components[3] = value;
    }
    getComponent(index) {
        return this.components[index];
    }
}
//# sourceMappingURL=color.js.map