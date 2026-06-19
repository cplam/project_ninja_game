window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      keys.w.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 's':
      keys.s.pressed = true
      break
    case 'd':
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case 'j':
      event.preventDefault()
      player.attack()
      break
    case 'k':
      event.preventDefault()
      if(player.current_health < player.max_health) {
        hearts[player.current_health++].gainHealth()
      }
      // player.skill_1()
      break
    case 'l':
      event.preventDefault()
      // player.skill_2()
      break
    case ' ':
      event.preventDefault()
      // kill all monsters for cheating
      for (let i = monsters.length - 1; i >= 0; i--) {
        monsters.splice(i, 1)
      }
      // player.skill_ultimate()
      break
  }
})

// On return to game's tab, ensure delta time is reset
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    lastTime = performance.now()
  }
})