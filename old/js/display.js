const canvas = document.querySelector('#testLoop');
const ctx = canvas.getContext('2d');
let mainOffset = 50;
canvas.width = window.innerWidth - mainOffset;
canvas.height = window.innerHeight - mainOffset;
let maxWidth = canvas.width;
let maxHeight = canvas.height;
let t = 0;
let pix = 75;
let pixLimit = [1e-1, 1e4]
let cubes = [];
let shakeby = 5;
let stepSize = 33;
let timer;
let rate = 1;
let color_rate = 300;
let fadeSpeed = .0005;
let canvasLoc = canvas.getBoundingClientRect();
let controls= 2;
let wallFactor = 4;

cubes.push(new Cube(600, 200));
cubes.push(new Cube(100, 20));
let grid = new Grid();
let cubesManager = new CubesManager();
let wallsManager = new WallsManager();

function mainLoop() {
    ctx.clearRect(0, 0, 10000, 10000);
    grid.draw();
    wallsManager.draw();
    cubesManager.draw();
    // console.log(123)
    grid.drawOrigin();
    // test();
}

function loop() {
    timer = setInterval(mainLoop, stepSize)
}
loop()

function update() {
    canvas.width = window.innerWidth - mainOffset;
    canvas.height = window.innerHeight - mainOffset;
    grid.maxHeight = canvas.height;
    grid.maxWidth = canvas.width;
}

canvas.addEventListener('contextmenu', event => event.preventDefault());
canvas.onclick = function (event) {
    clearInterval(timer)
    grid.newEvent(event)
    timer = setInterval(mainLoop, stepSize);
}

window.onresize = function (event) {
    clearInterval(timer);
    this.update();
    // console.log(1)
    mainLoop()
    timer = setInterval(mainLoop, stepSize);
}

window.onmouseout = function (event) {
    clearInterval(timer);
    grid.newEvent(event);
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
}

window.onmousemove = function (event) {
    clearInterval(timer);
    grid.newEvent(event);
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
}

window.onmousedown = function (event) {
    clearInterval(timer)
    grid.newEvent(event)
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
}

window.onmouseup = function (event) {
    clearInterval(timer)
    grid.newEvent(event)
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
}

window.onmousewheel = function (event) {
    clearInterval(timer)
    grid.newEvent(event)
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
    print(Math.floor(pix))
}

function test() {
    ctx.fillStyle = '#f00';
    let coordinates = [[150, 150], [350,150], [300,300], [150,300]]
    drawPolygon(rotateAll(coordinates, 0));
}