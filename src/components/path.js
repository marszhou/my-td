import {calculateLengthOfLine, formatFloat, formatPercent, rectCircleColliding, calculateAvgPath} from 'utils/functions'

export default class Path extends Phaser.Graphics {
  constructor(game, width, height, cellWidth, steps, points) {
    super(game, 0, 0)

    this.towerAvailibleCells = []

    for (let y = 0; y < height / cellWidth; y++) {
      for (let x = 0; x < width / cellWidth; x++) {
        this.towerAvailibleCells.push({x: x, y: y})
      }
    }

    this.inputEnabled = true
    this.w = width
    this.h = height
    this.cellWidth = cellWidth
    this.steps = steps
    this.points = points
    this.avgPoints = []
    this.line = []
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
      // let px = this.game.math.linearInterpolation(pxs, i)
      // let py = this.game.math.linearInterpolation(pys, i)
      line.push({x: px, y: py})
      this.lineTo(px, py)

      this.towerAvailibleCells = this.excludeCells(this.towerAvailibleCells, 1.5, {x: px/this.cellWidth, y: py/this.cellWidth})
    }

    this.translatedPositions = {pxs, pys}

    let lastPoint = this.translatePoint(_.last(this.points))
    this.lineTo(lastPoint.x, lastPoint.y)

    line.unshift(firstPoint)
    line.push(lastPoint)

    // console.log(line)
    this.line = line

    this.totalLength = calculateLengthOfLine(line)
    console.log('totalLength=', this.totalLength)

    this.avgPoints = calculateAvgPath(this.totalLength, this.line, Math.floor(this.line.length / 4))
    console.log(this.avgPoints)

    // console.log(line)
    this.lineStyle(0)
    // line
    // // .map(point => this.translatePoint(point))
    // .forEach(point => {
    //   this.beginFill(0x0000ff)
    //   this.drawCircle(point.x, point.y, 8)
    //   this.endFill()
    // })
    // this.points
    // .map(point => this.translatePoint(point))
    points
    .forEach(point => {
      this.beginFill(0x00ff00)
      this.drawCircle(point.x, point.y, 8)
      this.endFill()
    })

    // this.avgPoints
    // .forEach(point => {
    //   this.beginFill(0x00ffff)
    //   this.drawCircle(point.x, point.y, 8)
    //   this.endFill()
    // })

    this.towerAvailibleCells.forEach(_point => {
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
      // x: formatFloat(this.game.math.catmullRomInterpolation(this.translatedPositions.pxs, percent)),
      // y: formatFloat(this.game.math.catmullRomInterpolation(this.translatedPositions.pys, percent)),
      // x: formatFloat(this.game.math.catmullRomInterpolation(_.map(this.avgPoints, 'x'), percent)),
      // y: formatFloat(this.game.math.catmullRomInterpolation(_.map(this.avgPoints, 'y'), percent)),
      x: formatFloat(this.game.math.linearInterpolation(_.map(this.avgPoints, 'x'), percent)),
      y: formatFloat(this.game.math.linearInterpolation(_.map(this.avgPoints, 'y'), percent)),
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
    return this.towerAvailibleCells
  }
}