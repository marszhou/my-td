export default class Grid extends Phaser.Graphics {
  constructor(game, width, height, x, y, columns = 10, rows = 10) {
    super(game, x, y);

    this.w = width
    this.h = height
    this.rows = rows
    this.columns = columns
    this.render()
  }

  render() {
    this.clear()

    this.lineStyle(1, 0x333333, 1);

    for (let i = 0; i <= this.rows; i++) {
      let y = this.h / this.rows * i
      this.moveTo(0, y)
      this.lineTo(this.w, y)
    }

    for (let i = 0; i <= this.columns; i++) {
      let x = this.w / this.columns * i
      this.moveTo(x, 0)
      this.lineTo(x, this.h)
    }
    if (this.current) {
      this.beginFill(0x808080)
      this.drawRect(this.current.x * this.w / this.columns, this.current.y * this.h / this.rows, this.w / this.columns, this.h / this.rows)
      this.endFill()
    }
  }

  get current() {
    return this._current
  }

  set current(v) {
    this._current = v
    this.render()
  }

  findCell(point) {
    let cw = this.w / this.columns
    let ch = this.h / this.rows

    let px = Math.floor(point.x/cw)
    let py = Math.floor(point.y/ch)

    if (px < 0 || px >= this.columns || py < 0 || py >= this.rows) {
      return null
    }

    return {x: px, y: py}
  }
}