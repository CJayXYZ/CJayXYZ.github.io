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
    size = (.1*i) + 'em'
    tag.style.fontSize = size
    i++
    // console.log(i);
    if (i <800 +1) {
    window.requestAnimationFrame(loop) 
}
}

loop()