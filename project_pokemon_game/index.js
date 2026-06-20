const canvas = document.querySelector('canvas')
// reference any element within our html file
// console.log('helloworld') // print the 'helloworld' to the console


const c = canvas.getContext('2d') // this time we want 3d context
canvas.width = 1024
canvas.height = 576

c.fillStyle = 'white' // color of the rectangle
c.fillRect(0, 0, canvas.width, canvas.height) // x,y,width,height, by default is in black colour

const image = new Image() // Don't put the image into constructor
image.src = './img/Pellet Town.png'
console.log(image) // log the image into console
// c.drawImage("./img/Pellet Town.png") // this will not work, we need to reference the image element

// c.drawImage(image, 0, 0) // reference the html image element, x,y position
// But the image is not loaded yet, so we need to wait for it to load first
// Need draw Image before the image is loaded
image.onload = () => { // Error function, explicity draw after the image is loaded
    c.drawImage(image, -700, -500) // Only call function
}


// console.log(canvas)