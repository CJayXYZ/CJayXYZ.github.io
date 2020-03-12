// setTimeout(function() {
//     alert('hey there');
// }, 50);
// alert()
// document.getElementsByTagName('div')
// document.getElementsByClassName('done')
// document.getElementById('my-id')
// document.querySelector('#my-id')
// document.querySelectorAll('.classname')

// Once you have selected an html element, you can modify it:
// document.getElementById('my-id').innerHTML = "new html"
// document.getElementById('my-id').className = "newclass otherclass"

function add(first, last) {
    return first+last
}

let sum = add(1,44);

let list =['Hi', sum, add, 1];

if (sum<7) {
    // console.log(sum)
} else if (sum>14){
    // console.log('more than 14', sum)
}

let t =6, i =0;
while (i<t) {
    // console.log('while', i)
    i++
}

for (i = 0; i<list.length; i++) {
    // console.log('for', i, list[i])
}

// offsetWidth: 1610
// offsetHeight: 833
let clientheight = document.getElementsByClassName('main-box');

// console.log(clientheight.offsetHeight)
document.getElementsByClassName('main-box')[0].offsetWidth = 20;

// console.log(document.getElementsByClassName('main-box')[0].offsetWidth)

function wait(ms)
{
var d = new Date();
var d2 = null;
do { d2 = new Date(); }
while(d2-d < ms);
}

// let output = undefined;
let startText = ''

function output(message) {
    // document.querySelector('terminal')
    let tag = document.querySelectorAll('div')[5]
    console.log(message);
    tag.innerHTML = message
    tag.style.fontSize = '2em'

}

// wait(1000)

// output('Nice')
// // output(document)
// wait(1000)

// output(4)
i = 0

function loop() {
    i++
    j = i
    let tag = document.querySelectorAll('div')[5]
    tag.innerHTML = i
    tag.style.fontSize = '2em'
    // console.log(i);
    window.requestAnimationFrame(loop)
}

loop()