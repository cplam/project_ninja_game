const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
console.log("The canvas size is your window size.")
console.log("This is same as typing: canvas.width = window.innerWidth; canvas.height = window.innerHeight;")

class Player {
    constructor(){
        this.position = {
            x: 200,
            y: 200
        }

        this.velocity = {
            x: 20,
            y: 0
        }

        const image = new Image()
        image.src = './img/spaceship.png'

        this.image = image
        this.width = 100
        this.height = 100

    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player()
player.draw()

function animate(){
    requestAnimationFrame(animate)
    // create animation loop, which will call the animate function again and again, creating a loop
    // call the function again and again

    c.fillStyle = 'black'
    // Actually no need to specify the color

    c.fillRect(0,0,canvas.width,canvas.height)
    player.draw()
}

animate()