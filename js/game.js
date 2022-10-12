'use strict'

const WALL = '<span class="wall"></span>'
const FOOD = '<span style="font-weight: 800">·</span>'
const POWER_FOOD = `<img src="../icons/strawberry.png">`
const CHERRY = `<img src="../icons/cherry.png">`
const EMPTY = ' '

var gGame = {
  score: 0,
  isOn: false,
  foodRenderedAmount: 0,
  foodEatenAmount: 0,
  cherryInterval: 0,
  sounds: {
    beginning: new Audio('../sounds/pacman_beginning.wav'),
    chomp: new Audio('../sounds/pacman_chomp.wav'),
    death: new Audio('../sounds/pacman_death.wav'),
    eatFruit: new Audio('../sounds/pacman_eatfruit.wav'),
    eatGhost: new Audio('../sounds/pacman_eatghost.wav'),
    superPacman: new Audio('../sounds/pacman_extrapac.wav'),
  },
}
var gBoard

function startGame() {
  renderResetBtn('Press play to start', 'Play')
}
function init() {
  lowerVolume()

  const elModal = document.querySelector('.modal')
  elModal.classList.add('hide')

  gBoard = buildBoard()
  createPacman(gBoard)

  gGame.foodRenderedAmount = countFood()
  gGame.foodEatenAmount = 0

  //Play start sound before you start moving & ghosts generate
  setTimeout(() => {
    createGhosts(gBoard)
    gGame.isOn = true
  }, 4000)

  renderBoard(gBoard, '.board-container')

  gGame.score = 0
  updateScore()

  gGame.cherryInterval = setInterval(createCherry, 15000)
  gGame.sounds.beginning.play()
}

function buildBoard() {
  const SIZE = 10
  const board = []

  for (var i = 0; i < SIZE; i++) {
    board.push([])

    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD

      if (
        i === 0 ||
        i === SIZE - 1 ||
        j === 0 ||
        j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)
      ) {
        board[i][j] = WALL
      }

      if (
        (i === 1 && j === SIZE - 2) ||
        (i === 1 && j === 1) ||
        (i === SIZE - 2 && j === 1) ||
        (i === SIZE - 2 && j === SIZE - 2)
      ) {
        board[i][j] = POWER_FOOD
      }
    }
  }

  return board
}

function createCherry() {
  var location = getEmptyLocation()

  if (!location) return

  gBoard[location.i][location.j] = CHERRY

  renderCell(location, CHERRY)
}

function updateScore(diff = 0) {
  gGame.score += diff
  document.querySelector('h2 span').innerText = gGame.score
}

function gameOver(didWin) {
  renderResetBtn(`You ${didWin ? 'Win' : 'Lost'}.`)

  if (!didWin) gGame.sounds.death.play()

  gGame.isOn = false
  clearInterval(gIntervalGhosts)
  clearInterval(gGame.cherryInterval)
}

function getEmptyLocation() {
  const emptyLocations = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j] !== EMPTY) continue
      emptyLocations.push({ i, j })
    }
  }
  if (!emptyLocations.length) return null

  const randIdx = getRandomIntInclusive(0, emptyLocations.length - 1)
  return emptyLocations[randIdx]
}

function countFood() {
  var count = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j] === FOOD) count++
    }
  }
  return count
}

function lowerVolume(vol = 0.1) {
  for (var sound in gGame.sounds) gGame.sounds[sound].volume = vol
}

function renderResetBtn(msgText, btnText = 'Reset') {
  const elModal = document.querySelector('.modal')
  const elMsg = elModal.querySelector('span')
  const elResetBtn = elModal.querySelector('button')

  elMsg.innerText = msgText
  elResetBtn.innerText = btnText
  elModal.classList.remove('hide')
}
