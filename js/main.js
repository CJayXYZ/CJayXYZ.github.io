function wait(ms)
{
var d = new Date();
var d2 = null;
do { d2 = new Date(); }
while(d2-d < ms);
}


let i = 0

function loop() {
    // wait(1000/i)
    let tag = document.querySelector('.terminal')
    tag.innerHTML = i
    size = (.01*i) + 'em'
    tag.style.fontSize = size
    i++
    // console.log(i);
    if (i <800 +1) {
    window.requestAnimationFrame(loop) 
}
}

// loop()

// var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");

// // Red rectangle
// ctx.beginPath();
// ctx.lineWidth = "6";
// ctx.strokeStyle = "red";
// ctx.rect(5, 5, 290, 140);
// ctx.stroke();

// // Green rectangle
// ctx.beginPath();
// ctx.lineWidth = "4";
// ctx.strokeStyle = "green";
// ctx.rect(30, 30, 50, 50);
// ctx.stroke();

// // Blue rectangle
// ctx.beginPath();
// ctx.lineWidth = "10";
// ctx.strokeStyle = "blue";
// ctx.rect(50, 50, 150, 80);
// ctx.stroke();

let height = window.innerHeight - window.innerHeight/4.5
let width = window.innerWidth - window.innerWidth/10

const cvs = document.getElementById('myCanvas')
cvs.height = height
cvs.width = width
let ctx = cvs.getContext("2d");

function detectSize() {
    // console.log(window.innerWidth, window.innerHeight)
    cvs.width = window.innerWidth - window.innerWidth/10
    cvs.height = window.innerHeight - window.innerHeight/4.5
}

window.addEventListener('resize', detectSize);

function makeRect(locX, locY, width, height, color) {
    ctx.fillStyle = color
    ctx.fillRect(locX, locY, width, height)
}

makeRect(50,150, 150,150, 'red')
makeRect(200,150, 150,150, 'green')
makeRect(350,150, 150,150, 'blue')
