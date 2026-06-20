class Sprite {
  constructor({ x, y , imageSrc = './images/leaf.png', velocity}) {
    this.x = x
    this.y = y
    this.width = 12
    this.height = 7
    this.center = { // store the center of player
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    }
    this.loaded = false
    this.image = new Image()
    this.image.onload = () => { // callback function
      this.loaded = true
    }
    this.image.src = imageSrc
    this.currentFrame = 0
    this.currentSprite = {
        x: 0,
        y: 0,
        width: 12,
        height: 7,
        frameCount: 6,
    }
    this.status = 'full'
    this.currentFrame = this.status === 'full' ? 4: 0
    this.elapsedTime = 0
    this.totalElapsedTime = 0 // this is total elapsed time from the start of the game
    this.velocity = velocity
    this.alpha = 1
  }
  

  draw(c) {
    if(this.loaded === false || this.weaponLoaded === false) {
      // Green square debug code
      c.fillStyle = 'rgba(0, 255, 0, 0.5)'
      c.fillRect(this.x, this.y, this.width, this.height)
      return
    }

    else{
        c.globalAlpha = this.alpha
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
      update(deltaTime) {
        if (!deltaTime) return
        // 0 - 3
        this.elapsedTime += deltaTime
        this.totalElapsedTime += deltaTime
        const intervalToGoToNextFrame = 0.15

        if(this.elapsedTime > intervalToGoToNextFrame) { // change frame every 0.1 seconds
            this.currentFrame = (this.currentFrame+1) % this.currentSprite.frameCount
            this.elapsedTime -= intervalToGoToNextFrame
        }

        // update position based on velocity
        this.x += this.velocity.x
        this.y += this.velocity.y

        // update center position
        this.center = {
          x: this.x + this.width / 2,
          y: this.y + this.height / 2,
        }

        const leafLifespan = 15
        if(this.totalElapsedTime > leafLifespan) {
            this.alpha -= 0.01
            this.alpha = Math.max(this.alpha, 0)
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