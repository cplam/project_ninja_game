class Monster {
  constructor({ x, y, size, velocity = { x: 0, y: 0 }, imageSrc = './images/bamboo.png', sprites }) {
    this.x = x
    this.y = y
    this.width = size
    this.height = size
    this.velocity = velocity
    this.center = { // store the center of monster
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
    this.elapsedTime = 0
    this.elapsedMovementTime = 0
    this.sprites = sprites

    this.currentSprite = Object.values(this.sprites)[0]
  }

  draw(c) {
    if(this.loaded === false){
        // Red square debug code
        c.fillStyle = 'rgba(0, 0, 255, 0.5)'
        c.fillRect(this.x, this.y, this.width, this.height)
    }
    

    else{
        c.drawImage(
            this.image,
            this.currentSprite.x, 
            this.currentSprite.height * this.currentFrame + 0.5, // remove 0.5 pixel gap by removing the black lines 
            this.currentSprite.width, 
            this.currentSprite.height, 
            this.x, 
            this.y, 
            this.width, 
            this.height,
            )
    }

    
    

    // need to move the crop position first depending on walking state

  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    this.elapsedTime += deltaTime // amount of time passed since last frame

    // 0 - 3
    const intervalToGoToNextFrame = 0.15
    if(this.elapsedTime > intervalToGoToNextFrame) { // change frame every 0.1 seconds
      this.currentFrame = (this.currentFrame+1) % this.currentSprite.frameCount
      this.elapsedTime -= intervalToGoToNextFrame
    }

    this.setVelocity(deltaTime)

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime)
    this.checkForHorizontalCollisions(collisionBlocks)

    // Update vertical position and check collisions
    this.updateVerticalPosition(deltaTime)
    this.checkForVerticalCollisions(collisionBlocks)

    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    }
  }

  setVelocity(deltaTime){
    const changeDirectionInterval = 3
    if(this.elapsedMovementTime > changeDirectionInterval || this.elapsedMovementTime === 0) { // change direction, acutally no need the former condition
        this.elapsedMovementTime -= changeDirectionInterval
        
        const angle = Math.random() * Math.PI * 2 // 0 - 2pi
        const speed = 20

        const target_x = this.x + Math.cos(angle) * speed
        const target_y = this.y + Math.sin(angle) * speed

        const dx = target_x - this.x  // can be very big, or negative
        const dy = target_y - this.y

        const magnitude = Math.sqrt(dx * dx + dy * dy) // actually is the speed

        this.velocity.x = (dx / magnitude) * speed
        this.velocity.y = (dy / magnitude) * speed
        
        
    }
  }

  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime
  }

  updateVerticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime
  }
  

  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // Check if a collision exists on all axes
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going left
        if (this.velocity.x < -0) {
          this.x = collisionBlock.x + collisionBlock.width + buffer
          this.velocity.x = -this.velocity.x // bounce back
          break
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.x = collisionBlock.x - this.width - buffer
          this.velocity.x = -this.velocity.x // bounce back
          break
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // If a collision exists
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going up
        if (this.velocity.y < 0) {
          this.y = collisionBlock.y + collisionBlock.height + buffer
          this.velocity.y = -this.velocity.y // bounce back
          break
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          this.y = collisionBlock.y - this.height - buffer
          this.velocity.y = -this.velocity.y // bounce back
          break
        }
      }
    }
  }
}