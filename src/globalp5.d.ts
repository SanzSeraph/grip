import p5module from '../node_modules/@types/p5/index';

declare global {
    let p5: typeof p5module;
    type p5 = p5module;
}