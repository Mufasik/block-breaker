import game from './data.js'

game.wallsCreate()
game.boxesCreate()

onClick("box", (box) => {
  game.boxesRemove(box)
})

onKeyPress("space", () => {
  destroyAll('box')
  game.boxesCreate()
})

onUpdate(() => {
  game.boxesUpdate()
})