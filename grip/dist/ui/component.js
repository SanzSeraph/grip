export default class Component {
    constructor(p5, container, templateUrl) {
        this.lib = p5;
        this.container = container;
        this.templateUrl = templateUrl;
        this.load();
    }
    load() {
        return new Promise((resolve, reject) => {
            this.lib.loadText(this.templateUrl, html => {
                this.container.html(html);
                resolve(this);
            }, error => console.log(error));
        });
    }
}
//# sourceMappingURL=component.js.map