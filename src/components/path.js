import {calculateLengthOfLine, formatFloat, formatPercent, rectCircleColliding} from 'utils/functions'

export default class Path extends Phaser.Graphics {
  constructor(game, width, height, cellWidth, steps, points) {
    super(game, 0, 0)

    this.towerAvaliibleCells = []

    for (let y = 0; y < height / cellWidth; y++) {
      for (let x = 0; x < width / cellWidth; x++) {
        this.towerAvaliibleCells.push({x: x, y: y})
      }
    }

    this.inputEnabled = true
    this.w = width
    this.h = height
    this.cellWidth = cellWidth
    this.steps = steps
    this.points = points
    this.render()
  }

  translatePoint(p) {
    let ret = {x: 0, y: 0}
    ret.x = (p[0] || p.x || 0) * this.cellWidth
    ret.y = (p[1] || p.y || 0) * this.cellWidth
    return ret
  }

  render() {
    this.clear()
    this.lineStyle(3, 0xff0000, 1)
    let firstPoint = this.translatePoint(this.points[0])
    // console.log(firstPoint)
    this.moveTo(firstPoint.x, firstPoint.y)

    let points = this.points.map(point => this.translatePoint(point))
    let pxs = _.map(points, 'x')
    let pys = _.map(points, 'y')

    let x = 1 / this.steps

    let line = []

    for (let i = x; i <= 1; i += x) {
      // let px = this.game.math.bezierInterpolation(pxs, i)
      // let py = this.game.math.bezierInterpolation(pys, i)
      let px = this.game.math.catmullRomInterpolation(pxs, i)
      let py = this.game.math.catmullRomInterpolation(pys, i)
      line.push({x: px, y: py})
      this.lineTo(px, py)

      this.towerAvaliibleCells = this.excludeCells(this.towerAvaliibleCells, 1.5, {x: px/this.cellWidth, y: py/this.cellWidth})
    }

    this.translatedPositions = {pxs, pys}

    let lastPoint = this.translatePoint(_.last(this.points))
    this.lineTo(lastPoint.x, lastPoint.y)

    line.unshift(firstPoint)
    line.push(lastPoint)

    // console.log(line)

    this.totalLength = calculateLengthOfLine(line)
    console.log('totalLength=', this.totalLength)

    // console.log(line)
    this.lineStyle(0)
    this.points.map(point => this.translatePoint(point)).forEach(point => {
      this.beginFill(0x00ff00)
      this.drawCircle(point.x, point.y, 8)
      this.endFill()
    })

    this.towerAvaliibleCells.forEach(_point => {
      let point = this.translatePoint(_point)
      this.beginFill(0xff0000, 0.2)
      this.drawRect(point.x, point.y, this.cellWidth, this.cellWidth)
      this.endFill()
    })
  }

  getPosition(currentLength) {
    let percent = currentLength / this.totalLength
    if (percent > 1) percent = 1
    return {
      x: formatFloat(this.game.math.catmullRomInterpolation(this.translatedPositions.pxs, percent)),
      y: formatFloat(this.game.math.catmullRomInterpolation(this.translatedPositions.pys, percent)),
      percentString: formatPercent(percent),
      percent: percent
    }
  }

  excludeCells(points, radius, origin) {
    return points.filter(point => {
      let rect = {x: point.x, y: point.y, w: 1, h: 1}
      let circle = {x: origin.x, y: origin.y, r: radius}
      return !rectCircleColliding(rect, circle)
    })
  }

  getTowerAvailibleCells() {
    return this.towerAvaliibleCells
  }
}