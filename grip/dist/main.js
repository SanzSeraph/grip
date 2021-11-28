import Game from './game/game.js';
const s = instance => {
    let g = null;
    instance.setup = function () {
        g = new Game(instance);
        g.start();
    };
    instance.draw = function () {
        g.draw();
    };
};
new p5(s);
//# sourceMappingURL=main.js.map