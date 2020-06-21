const canvas = document.querySelector('#testLoop');
const ctx = canvas.getContext('2d');
let mainOffset = 50;
// canvas.width = window.innerWidth - mainOffset;
// canvas.height = window.innerHeight - mainOffset;
let maxWidth = canvas.offsetWidth;
let maxHeight = canvas.offsetHeight;
canvas.width = maxWidth;
canvas.height = maxHeight;
// console.log(canvas, ctx, maxWidth, maxHeight);
let t = 0;
let pix = 25;
let pixLimit = [1e-1, 1e4]
let cubes = [];
let shakeby = 5;
let stepSize = 33;
let timer;
let rate = 1;
let color_rate = 300;
let fadeSpeed = .0002;
let canvasLoc = canvas.getBoundingClientRect();
let controlButton = 2;
let wallFactor = 10;

let grid = new Grid();
let cubesManager = new CubesManager();
let wallsManager = new WallsManager();
let controls = new Controls();
let io = new IO();
let bfs = new BFS();

let findPathBool = false;
// let clearSearchCubes = false;

function mainLoop() {
    ctx.clearRect(0, 0, 10000, 10000);
    // controls.draw();
    // grid.draw();'
    // if  (clearSearchCubes){
    //     clearSearchCubes();
    //     clearSearchCubes = false;
    // }
    // if (findPathBool) {
    //     io.findPath();
    // }
    io.run();
    wallsManager.draw();
    cubesManager.draw();
    // grid.drawOrigin();
    // test();
}

function loop() {
    timer = setInterval(mainLoop, stepSize)
}
loop()

function update() {
    // canvas.width = window.innerWidth - mainOffset;
    // canvas.height = window.innerHeight - mainOffset;
    let maxWidth = canvas.offsetWidth;
    let maxHeight = canvas.offsetHeight;
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    grid.maxHeight = canvas.height;
    grid.maxWidth = canvas.width;
    console.log(grid.maxWidth, grid.maxHeight)
}


canvas.addEventListener('contextmenu', event => event.preventDefault());

canvas.onclick = function (event) {
    clearInterval(timer)
    grid.eventHandler(event)
    mainLoop()
    timer = setInterval(mainLoop, stepSize);
}

window.onresize = function (event) {
    clearInterval(timer);
    this.update();
    grid.eventHandler(event);
    mainLoop()
    timer = setInterval(mainLoop, stepSize);
}

window.onmouseout = function (event) {
    clearInterval(timer);
    grid.eventHandler(event);
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
}

window.onmousemove = function (event) {
    clearInterval(timer);
    grid.eventHandler(event);
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
}

window.onmousedown = function (event) {
    clearInterval(timer)
    grid.eventHandler(event)
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
}

window.onmouseup = function (event) {
    clearInterval(timer)
    grid.eventHandler(event)
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
}

canvas.onmousewheel = function (event) {
    // window.addEventListener('wheel', event => event.preventDefault());
    event.preventDefault();
    clearInterval(timer)
    grid.eventHandler(event)
    mainLoop();
    timer = setInterval(mainLoop, stepSize);
    print(Math.floor(pix))
}
window.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    // console.log(event)
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        //   io.deleteSearchCube();
        io.clear();
        io.start();
    }
    else if (event.keyCode === 46) {

        event.preventDefault();
        io.clear();
    }
    else if (event.key === 'w') {
        
        event.preventDefault();
        io.clear();
        io.createDefaultWalls();
    }
    else if (event.key === 'm') {
        
        event.preventDefault();
        io.clear();
        io.createMaze();
    }

});

function test() {
    ctx.fillStyle = '#f00';
    let coordinates = [[150, 150], [350, 150], [300, 300], [150, 300]]
    drawPolygon(rotateAll(coordinates, 0));
}