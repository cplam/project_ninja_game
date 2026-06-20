class Heart {
  constructor({ x, y }) {
    this.x = x
    this.y = y
    this.width = 20
    this.height = 20
    this.center = { // store the center of player
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    }
    this.loaded = false
    this.image = new Image()
    this.image.onload = () => { // callback function
      this.loaded = true
    }
    this.image.src = './images/heart.png'
    this.currentSprite = {
        x: 0,
        y: 0,
        width: 16,
        height: 16,
        frameCount: 4,
    }
    this.status = 'full'
    this.currentFrame = this.status === 'full' ? 4: 0
  }
  

  draw(c) {
    if(this.loaded === false || this.weaponLoaded === false) {
      // Blue square debug code
      c.fillStyle = 'rgba(0, 0, 255, 0.5)'
      c.fillRect(this.x, this.y, this.width, this.height)
      return
    }

    else{
      c.drawImage(
        this.image,
        this.currentSprite.x + this.currentSprite.width * this.currentFrame, 
        this.currentSprite.y,
        this.currentSprite.width, 
        this.currentSprite.height, 
        this.x, 
        this.y, 
        this.width, 
        this.height,
      )

      }
    }

    lossHealth() {
      if (this.status === 'full') {
        this.status = 'empty'
        this.currentFrame = 0
        this.draw(c)
      }
    }

    gainHealth() {
      if (this.status === 'empty') {
        this.status = 'full'
        this.currentFrame = 4
        this.draw(c)
      }
    }

    // need to move the crop position first depending on walking state


}