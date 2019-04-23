let randomVal = (min, max) => Math.floor(Math.random() * (max - min) + min);

let getRandomXnY = (x, y) => ({
    x: randomVal(0, x),
    y: randomVal(0, y)
});


// Checks points equality
let isEqualPoints = (Obj1, Obj2) => Obj1.x === Obj2.x && Obj1.y === Obj2.y;

module.exports = {
    randomVal, getRandomXnY, isEqualPoints
}