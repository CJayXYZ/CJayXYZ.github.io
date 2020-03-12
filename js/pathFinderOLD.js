function print(arg) {
    console.log(arg)
}
const canvas = document.querySelector('#pathFinder')
const ctx = canvas.getContext('2d')
canvas.height = 350
canvas.width = 350

let windowProp = {height: canvas.height, 
                    width: canvas.width,
                    gridSize: 40,
                    gridColor: 'green'
}

ctx.fillStyle = windowProp.gridColor
ctx.fillRect(0,40,40,40)

function makeLine(x1,y1,x2,y2) {
    ctx.beginPath()
    // ctx.strokeStyle = 'white'
    // print([x1,y1,x2,y2])
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.stroke()
}
ctx.strokeStyle = 'white'
ctx.lineWidth = '10'

function makeGrid(startLoc, pix) { //startLoc will specify where to start square
    x0 = startLoc[0]
    y0 = startLoc[1]
    xmax = canvas.width
    ymax = canvas.height
    x = -(pix - x0)
    y = -(pix - y0)
    while (x<=xmax) {
        makeLine(x,0, x, ymax)
        x =x +pix
    }
    while (y<=ymax) {
        makeLine(0,y, xmax, y)
        y =y +pix
    }
}

// Your code here ###########################################

makeGrid([20,20], 40)
let buttonClicked = -1
let lastLoc
let pix = 30
// canvas.style = "position:absolute;"


// documnet.addEventListener('click', print(4))
// canvas.addEventListener('onclick', print(16));


// var canvas = document.querySelector("canvas"),

    // print(23)
    
  // important: correct mouse position:
//   var rect = this.getBoundingClientRect(),
//       x = e.clientX - rect.left,
//       y = e.clientY - rect.top,
//       i = 0, r;
  
//   ctx.clearRect(0, 0, canvas.width, canvas.height); // for demo
   
//     ctx = canvas.getContext("2d"),
// while(r = rects[i++]) {
//     // add a single rect to path:
//     ctx.beginPath();
//     ctx.rect(r.x, r.y, r.w, r.h);    
    
//     // check if we hover it, fill red, if not fill it blue
//     ctx.fillStyle = ctx.isPointInPath(x, y) ? "red" : "blue";
//     ctx.fill();
//   }


let rects = [
        {x: 10, y: 10, w: 200, h: 50},
        {x: 50, y: 70, w: 150, h: 30}    // etc.
    ], i = 0, r;

// render initial rects.
while(r = rects[i++]) ctx.rect(r.x, r.y, r.w, r.h);
ctx.fillStyle = "blue"; ctx.fill();

canvas.onmousemove = function(e) {
  makeGrid([20,20], 40)
  print([event.clientX, event.clientY, event.button])
  if (buttonClicked == 0) {
    newLoc = [-lastLoc[00]+event.clientX, -lastLoc[1]+event.clientY]
    print([event.clientX, event.clientY, event.button, lastLoc[00], lastLoc[1]])
    print(newLoc)
  }
  makeGrid(newLoc, 30)
}

canvas.onmousewheel = function (e) {
    console.log(50)
}

canvas.onmousedown = function(e) {
    console.log('draging')
    buttonClicked = event.button
    lastLoc = [event.clientX, event.clientY]
    print(buttonClicked)
}

canvas.onmouseup = function(e) {
    console.log('release')
    buttonClicked = -1
    print(buttonClicked)
}
