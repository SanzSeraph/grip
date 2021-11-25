export default class RNG {
    generateWeighted(start, end, curve) {
        let range = end - start;
        return curve(Math.random()) * range + start;
    }
}
RNG.Square = x => x ** 2;
RNG.ReverseSquare = x => (1 - x) ** 2;
RNG.InvertedSquare = x => 1 - (1 - x) ** 2;
RNG.Cube = x => x ** 3;
RNG.SMean = x => {
    if (x < 0.5) {
        return RNG.InvertedSquare(x);
    }
    else {
        return RNG.Square(x);
    }
};
RNG.SExtremes = x => {
    if (x < 0.5) {
        return RNG.Square(x);
    }
    else {
        return RNG.InvertedSquare(x);
    }
};
//# sourceMappingURL=random.js.map