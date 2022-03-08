kaboom({
    width: 800,
    height: 480,
    font: "sinko",
    background: [ 50, 50, 50, ],
})
//debug.inspect = true

const WIDTH = 10
const HEIGHT = 10
const SIZE = 25
const OFFSET = SIZE
const SPEED = 200
const BORDER = 1
const COLORS = [RED, GREEN, CYAN]
//const COLORS = [RED, GREEN, CYAN, BLUE, YELLOW, MAGENTA]

const data = {

  wallsCreate: function() {
    const wallCreate = (x, y, size_x, size_y) => add([
      rect(size_x, size_y),
      pos(x, y),
      //outline(BORDER),
      color(WHITE),
      area(),
      solid(),
      'wall',
    ])
    const w = WIDTH * SIZE
    const h = HEIGHT * SIZE
    const s = OFFSET
    const w2 = w + s * 2
    const w3 = w + s * 3
    // for boxes
    wallCreate(0, 0, w2, s)
    wallCreate(0, h + s, w2, s)
    wallCreate(0, s, s, h)
    wallCreate(w + s, s, s, h)
    // for player
    // wallCreate(w3, 0, w2, s)
    // wallCreate(w3, h + s, w2, s)
    // wallCreate(w3, s, s, h)
    // wallCreate(w2 * 2, s, s, h)
  },

  boxCreate: function(x, y) {
    const type = randi(0, COLORS.length) + 1
    add([
      rect(SIZE, SIZE),
      pos(OFFSET + x * SIZE, OFFSET + y * SIZE),
      outline(BORDER),
      color(COLORS[type - 1]),
      area(),
      solid(),
      'box',
      { type, x, y, near: 0, }
    ])
  },

  boxesCreate: function() {
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        this.boxCreate(x, y)
      }
    }
  },

  boxGetXY: function(box) {
    const x = Math.floor( (Math.round(box.pos.x) - OFFSET) / SIZE )
    const y = Math.floor( (Math.round(box.pos.y) - OFFSET) / SIZE )
    return [x, y]
  },

  boxGetObj: function(x, y) {
    let box_
    every("box", (box) => {
      if (x == box.x && y == box.y) {
        box_ = box
        return
      }
    })
    return box_
  },

  boxesRemove: function(box) {
    // check and tag near
    const boxesCheck = (type, x, y) => {
      if (x < WIDTH && y < HEIGHT && x >= 0 && y >= 0) {
        const box = this.boxGetObj(x, y)
        if (box && box.type == type && box.near == 0) {
          box.near = 1
          boxesCheck(type, x + 1, y)
          boxesCheck(type, x - 1, y)
          boxesCheck(type, x, y + 1)
          boxesCheck(type, x, y - 1)
        }
      }
    }
    boxesCheck(box.type, box.x, box.y)
    // delete same near
    every("box", (box) => {
      if (box.near > 0) { destroy(box) }
    })
  },

  boxesUpdate: function() {
    // move, update x y
    every("box", (box) => {
      box.move(0, SPEED)
      const xy = this.boxGetXY(box)
      box.x = xy[0]
      box.y = xy[1]
    })
    // spawn new boxes
    for (let x = 0; x < WIDTH; x++) {
      const box = this.boxGetObj(x, 0)
      if (!box) {
        this.boxCreate(x, 0)
      }
    }
  },

}

export default data