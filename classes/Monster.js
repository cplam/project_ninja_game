class Monster {
  constructor({ x, y, size, velocity = { x: 0, y: 0 }, imageSrc = './images/bamboo.png', sprites , health = 3, damage = 1}) {
    this.x = x
    this.y = y
    this.originalPosition = {
        x: x,
        y: y,
    }
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

    this.health = health
    this.isInvincible = false
    this.elapsedInvincibilityTime = 0
    this.invincibilityInterval = 0.3 // seconds
    this.damage = damage
  }

  receiveHit(amount) {
    if (this.isInvincible) return // Prevent multiple hits due to multiple calls of receiveHit, maybe caused by multithreads
    this.health -= amount
    this.isInvincible = true
    }

  draw(c) {
    if(this.loaded === false){
        // Blue square debug code
        c.fillStyle = 'rgba(0, 0, 255, 0.5)'
        c.fillRect(this.x, this.y, this.width, this.height)
    }
    

    else{
        // c.save()
        c.globalAlpha = this.isInvincible ? 0.5 : 1
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
    if (this.isInvincible) {
      this.elapsedInvincibilityTime += deltaTime
      if (this.elapsedInvincibilityTime >= this.invincibilityInterval) {
        this.isInvincible = false
        this.elapsedInvincibilityTime = 0
      }
    }

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
    const changeDirectionInterval = 1
    if(this.elapsedMovementTime > changeDirectionInterval || this.elapsedMovementTime === 0) { // change direction, acutally no need the former condition
        this.elapsedMovementTime -= changeDirectionInterval
        
        const angle = Math.random() * Math.PI * 2 // 0 - 2pi
        const speed = 15
        const targrtLocation = {
            x: this.originalPosition.x + Math.cos(angle) * speed,
            y: this.originalPosition.y + Math.sin(angle) * speed,
        }
        
        const dx = targrtLocation.x - this.x
        const dy = targrtLocation.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        this.velocity.x = (dx / distance) * speed
        this.velocity.y = (dy / distance) * speed
    }
    this.elapsedMovementTime += deltaTime
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