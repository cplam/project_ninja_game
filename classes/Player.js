const X_VELOCITY = 150
const Y_VELOCITY = 150

class Player {
  constructor({ x, y, size, velocity = { x: 0, y: 0 } }) {
    this.x = x
    this.y = y
    this.width = size
    this.height = size
    this.velocity = velocity
    this.center = { // store the center of player
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    }
    this.loaded = false
    this.image = new Image()
    this.image.onload = () => { // callback function
      this.loaded = true
    }
    this.image.src = './images/player_2.png'

    this.weaponSprite = new Image()
    this.weaponLoaded = false
    this.weaponSprite.onload = () => {
      this.weaponLoaded = true
    }
    this.weaponSprite.src = './images/SpriteInHand.png'

    this.currentFrame = 0
    this.elapsedTime = 0
    this.sprites = {
      walkDown: {
        x: 0,
        y: 0,
        width: 16,
        height: 16,
        frameCount: 4,
      },
      walkUp: {
        x: 16,
        y: 0,
        width: 16,
        height: 16,
        frameCount: 4,
      },
      walkLeft: {
        x: 32,
        y: 0,
        width: 16,
        height: 16,
        frameCount: 4,
      },
      walkRight: {
        x: 48,
        y: 0,
        width: 16,
        height: 16,
        frameCount: 4,
      },
      attackDown: {
        x: 0,
        y: 64,
        width: 16,
        height: 15,
        frameCount: 1,
      },
      attackUp: {
        x: 16,
        y: 64,
        width: 16,
        height: 15,
        frameCount: 1,
      },
      attackLeft: {
        x: 32,
        y: 64,
        width: 16,
        height: 15,
        frameCount: 1,
      },
      attackRight: {
        x: 48,
        y: 64,
        width: 16,
        height: 15,
        frameCount: 1,
      },
    }

    this.currentSprite = this.sprites.walkDown
    this.facing = 'down'
    this.isAttacking = false
    this.attackTimer = 0
    this.attackBox = {
      x: this.x,
      y: this.y,
      width: 20,
      height: 5,
    }
    this.hasHitMonster = false
    this.health = 5
  }

  switchBackToIdleState(){
    switch(this.facing){
      case 'down':
        this.currentSprite = this.sprites.walkDown
        break
      case 'up':
        this.currentSprite = this.sprites.walkUp
        break
      case 'left':
        this.currentSprite = this.sprites.walkLeft
        break
      case 'right':
        this.currentSprite = this.sprites.walkRight
        break
    }
  }

  attack(){
    // console.log('Player attacks!')
    this.isAttacking = true
    this.currentFrame = 0
    switch(this.facing){
      case 'down':
        this.currentSprite = this.sprites.attackDown
        break
      case 'up':
        this.currentSprite = this.sprites.attackUp
        break
      case 'left':
        this.currentSprite = this.sprites.attackLeft
        break
      case 'right':
        this.currentSprite = this.sprites.attackRight
        break
    }
  }
  

  draw(c) {
    if(this.loaded === false || this.weaponLoaded === false) {
      // Blue square debug code
      c.fillStyle = 'rgba(0, 0, 255, 0.5)'
      c.fillRect(this.x, this.y, this.width, this.height)
      return
    }

    else{
      // Attack box debug code
      // c.fillStyle = 'rgba(255, 0, 0, 0.5)'
      // c.fillRect(
      //   this.attackBox.x, 
      //   this.attackBox.y, 
      //   this.attackBox.width, 
      //   this.attackBox.height
      // )
      c.drawImage(
        this.image,
        this.currentSprite.x, 
        this.currentSprite.y + this.currentSprite.height * this.currentFrame + 0.5, // remove 0.5 pixel gap by removing the black lines 
        this.currentSprite.width, 
        this.currentSprite.height, 
        this.x, 
        this.y, 
        this.width, 
        this.height,
      )

      if(this.isAttacking === true){
        let angle = 0
        let xOffset = 0
        let yOffset = 0

        switch(this.facing){
          case 'down':
            angle = 0
            xOffset = 5
            yOffset = 22
            break
          case 'up':
            angle = Math.PI
            xOffset = 5
            yOffset = -7
            break
          case 'left':
            angle = Math.PI / 2
            xOffset = -8
            yOffset = 12
            break
          case 'right':
            angle = -Math.PI / 2
            xOffset = 22
            yOffset = 11
            break
        }
        c.save()
        c.translate(this.x + xOffset, this.y + yOffset)
        c.rotate(angle) // rotate the weapon in the direction of movement
        c.drawImage(this.weaponSprite, -3, -8, 6, 16) // but need to rotate the weapon
        c.restore()
      }
    }
    

    // need to move the crop position first depending on walking state

  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    if(this.isAttacking && this.attackTimer < 0.3) {
      this.attackTimer += deltaTime
    }
    else if(this.isAttacking && this.attackTimer >= 0.3) {
      this.isAttacking = false
      this.attackTimer = 0
      this.switchBackToIdleState()
      this.hasHitMonster = false
    }

    this.elapsedTime += deltaTime // amount of time passed since last frame

    // 0 - 3
    const intervalToGoToNextFrame = 0.15
    if(this.elapsedTime > intervalToGoToNextFrame) { // change frame every 0.1 seconds
      this.currentFrame = (this.currentFrame+1) % this.currentSprite.frameCount
      this.elapsedTime -= intervalToGoToNextFrame
    }

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
    switch(this.facing){
      case 'down':
        this.attackBox.x = this.x + 2
        this.attackBox.y = this.y + 10
        this.attackBox.width = 6
        this.attackBox.height = 20
        break
      case 'up':
        this.attackBox.x = this.x + 2
        this.attackBox.y = this.y - 15
        this.attackBox.width = 6
        this.attackBox.height = 20
        break
      case 'left':
        this.attackBox.x = this.x - 16
        this.attackBox.y = this.y + 9
        this.attackBox.width = 20
        this.attackBox.height = 6
        break
      case 'right':
        this.attackBox.x = this.x + 10
        this.attackBox.y = this.y + 8
        this.attackBox.width = 20
        this.attackBox.height = 6
        break
    }
  }

  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime
  }

  updateVerticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime
  }

  handleInput(keys) {
    this.velocity.x = 0
    this.velocity.y = 0

    if(this.isAttacking) return // ban movement while attacking
    if (keys.d.pressed) {
      this.velocity.x = X_VELOCITY
      this.currentSprite = this.sprites.walkRight
      this.currentSprite.frameCount = 4
      this.facing = 'right'

    } else if (keys.a.pressed) {
      this.velocity.x = -X_VELOCITY
      this.currentSprite = this.sprites.walkLeft
      this.currentSprite.frameCount = 4
      this.facing = 'left'
      
    } else if (keys.w.pressed) {
      this.velocity.y = -Y_VELOCITY
      this.currentSprite = this.sprites.walkUp
      this.currentSprite.frameCount = 4
      this.facing = 'up'

    } else if (keys.s.pressed) {
      this.velocity.y = Y_VELOCITY
      this.currentSprite = this.sprites.walkDown
      this.currentSprite.frameCount = 4
      this.facing = 'down'
    }
    else{
    this.currentSprite.frameCount = 1 
   }
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
          break
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.x = collisionBlock.x - this.width - buffer

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
          this.velocity.y = 0
          this.y = collisionBlock.y + collisionBlock.height + buffer
          break
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y - this.height - buffer
          break
        }
      }
    }
  }
}