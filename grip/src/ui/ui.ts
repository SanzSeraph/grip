import Component from './component.js';

export default class UI extends Component {
  constructor(p5: p5, container: p5.Element) {
    super(p5, container, './ui/ui.html');
  }
}