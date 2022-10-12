'use strict'

const GHOST = '&#9781;'

var gGhosts = []
var gIntervalGhosts

function createGhost(board) {
  const ghost = {
    location: {
      i: 3,
      j: 3,
    },
    colorId: getRandomIntInclusive(1, 4),
    currCellContent: FOOD,
  }
  gGhosts.push(ghost)
  board[ghost.location.i][ghost.location.j] = getGhostHTML(ghost)
}

function createGhosts(board) {
  gGhosts = []
  for (var i = 0; i < 3; i++) {
    createGhost(board)
  }
  gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
  for (var i = 0; i < gGhosts.length; i++) {
    const ghost = gGhosts[i]
    moveGhost(ghost)
  }
}

function moveGhost(ghost) {
  const moveDiff = getMoveDiff()
  const nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  }
  const nextCell = gBoard[nextLocation.i][nextLocation.j]

  switch (nextCell) {
    case WALL:
    case GHOST:
      return
    case PACMAN:
      if (gPacman.isSuper) return
      return gameOver()
  }

  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent

  renderCell(ghost.location, ghost.currCellContent)

  ghost.location = nextLocation
  ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j]
  gBoard[ghost.location.i][ghost.location.j] = GHOST

  renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
  const randNum = getRandomIntInclusive(1, 4)

  switch (randNum) {
    case 1:
      return { i: 0, j: 1 }
    case 2:
      return { i: 1, j: 0 }
    case 3:
      return { i: 0, j: -1 }
    case 4:
      return { i: -1, j: 0 }
  }
}

function removeGhostByLocation(location) {
  for (var i = 0; i < gGhosts.length; i++) {
    if (
      gGhosts[i].location.i === location.i &&
      gGhosts[i].location.j === location.j
    ) {
      return gGhosts.splice(i, 1)[0]
    }
  }
  return null
}

function addGhostsByArr(ghostsArr) {
  for (var i = 0; i < ghostsArr.length; i++) {
    gGhosts.push(ghostsArr[i])
  }
}

function getGhostHTML(ghost) {
  var color = gPacman.isSuper ? 'chase' : ghost.colorId
  return `<img src="../icons/ghost-${color}.png">`
}
