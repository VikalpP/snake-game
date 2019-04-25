import { Directions } from "./Constants";

let randomVal = (min, max) => Math.floor(Math.random() * (max - min) + min);

// Generates random {x,y}
let getRandomXnY = (x, y) => ({
    x: randomVal(0, x),
    y: randomVal(0, y)
});

// Checks points' equality
let isEqualPoints = (Obj1, Obj2) => Obj1.x === Obj2.x && Obj1.y === Obj2.y;

// Generate random direction
let getRandomDirection = _ => Object.values(Directions)[randomVal(0, 3)];

export {
    randomVal, getRandomXnY, isEqualPoints, getRandomDirection
}