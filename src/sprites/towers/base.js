// import {makeTextLabel} from 'src/utils/functions'

export default class BaseTower extends Phaser.Sprite {
  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame);
    this.width = 20
    this.height = 20

    this.name = ''
    this.cost = 0
    this.level = 1
    this.maxLevel = 10
    this.target = []
    this.type = 'single'
    this.speed = 80
  }

  makeFactoryInfo() {
    let name = this.name
    let cost = this.cost
    let target = this.target.join(',')
    let type = this.type

    return {name, cost, target, type}
  }

  makeLevelInfo() {
    let info = {}
    info.current = {}
    let currentLevel = this.getLevelInfo(this.level)
    info.current.title = 'CURRENT LVL: ' + this.level
    info.current.damage = 'DAMAGE: ' + currentLevel.damage
    info.current.radius = 'RADIUS: ' + currentLevel.radius
    info.current.sell = 'SELL: ' + Math.floor(currentLevel.cost * 0.3)

    info.next = {}
    let nextLevel = this.getLevelInfo(this.level + 1)
    if (nextLevel) {
      info.next.title = 'NEXT LVL: ' + (this.level + 1)
      info.next.damage = 'DAMAGE: ' + nextLevel.damage
      info.next.radius = 'RADIUS: ' + nextLevel.radius
      info.next.buy = 'BUY: ' + nextLevel.cost
    }

    return info
  }
}