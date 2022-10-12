'use strict'

var PACMAN = `<img class="pacman" src="icons/pacman.png">`
var gPacman
var gDeadGhosts = []
var gSuperTimeout = 0

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5,
    },
    isSuper: false,
  }
  board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {
  if (!gGame.isOn) return

  const nextLocation = getNextLocation(ev)
  if (!nextLocation) return

  var nextCell = gBoard[nextLocation.i][nextLocation.j]

  switch (nextCell) {
    case WALL:
      return
    case CHERRY:
      updateScore(10)
      gGame.sounds.eatFruit.play()
      break
    case FOOD:
      updateScore(1)
      gGame.foodEatenAmount++
      if (isAllFoodEaten()) gameOver(true)
      gGame.sounds.chomp.play()
      break
    case POWER_FOOD:
      if (gSuperTimeout) return
      gPacman.isSuper = true
      gSuperTimeout = setTimeout(resetSuperPacman, 5000)
      gGame.sounds.superPacman.play()
      break
    case GHOST:
      if (!gPacman.isSuper) {
        renderCell(gPacman.location, EMPTY)
        return gameOver()
      }

      var deadGhost = removeGhostByLocation(nextLocation)
      if (deadGhost.currCellContent === FOOD) gGame.foodEatenAmount++
      deadGhost.currCellContent = EMPTY
      gDeadGhosts.push(deadGhost)
      gGame.sounds.eatGhost.play()
  }

  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

  renderCell(gPacman.location, EMPTY)

  gPacman.location = nextLocation
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN

  renderCell(gPacman.location, PACMAN)
}

function getNextLocation(eventKeyboard) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j,
  }

  switch (eventKeyboard.code) {
    case 'ArrowUp':
      nextLocation.i--
      var dir = 'up'
      break
    case 'ArrowDown':
      nextLocation.i++
      var dir = 'down'
      break
    case 'ArrowLeft':
      nextLocation.j--
      var dir = 'left'
      break
    case 'ArrowRight':
      nextLocation.j++
      var dir = 'right'
      break
    default:
      return null
  }

  PACMAN = `<img class="pacman ${dir}" src="/icons/pacman.png">`

  return nextLocation
}

function isAllFoodEaten() {
  return gGame.foodEatenAmount === gGame.foodRenderedAmount
}

function resetSuperPacman() {
  gPacman.isSuper = false
  addGhostsByArr(gDeadGhosts)
  gDeadGhosts = []
  gSuperTimeout = 0
}
