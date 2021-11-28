import * as p5 from '../../node_modules/@types/p5/index';

export default class Component {
  private lib: p5;
  private container: p5.Element;
  private templateUrl: string;

  constructor(p5: p5, container: p5.Element, templateUrl: string) {
    this.lib = p5;
    this.container = container;
    this.templateUrl = templateUrl;
    this.load();
  }
  
  load() {
    return new Promise<Component>((resolve, reject) => {
      this.lib.loadText(this.templateUrl, html => {
        this.container.html(html);
        resolve(this);
      }, error => console.log(error));
    });
  }
} 