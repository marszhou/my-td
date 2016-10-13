// import {makeTextLabel} from 'src/utils/functions'

export default class BaseTower extends Phaser.Sprite {
  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame);
    this.width = 20
    this.height = 20

    this.name = ''
    this.cost = 0
    this.level = 1

    this.radius = new Phaser.Graphics(this.game, x + this.width / 2, y + this.height / 2)
    this.label = new Phaser.Text(this.game, this.width/2 -2, this.height/2, this.text, {font: '6px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 4})
    this.label.anchor.set(0.5)

    this.maxLevel = 10
    this.target = []
    this.type = 'single'
    this.cooldown = 80
    this.built = false

    this.lastFire = 0

    // this.addChild(this.radius)
    // this.hideRadius()
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
    info.current.sell = 'SELL: ' + currentLevel.price

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

  showRadius() {
    this._showRadius = true
    this.addChild(this.radius)
    this.radius.clear()
    this.radius.beginFill(0xffffff, 0.25)
    this.radius.drawCircle(0, 0, this.getProp('radius'))
    this.radius.endFill()
    this.radius.alpha = 1
  }

  hideRadius() {
    this._showRadius = false
    this.removeChild(this.radius)
    this.radius.clear()
    this.radius.alpha = 0
  }

  get built() {
    return this._built
  }

  set built(v) {
    this._built = v
    if (v) {
      this.addChild(this.label)
    } else {
      this.removeChild(this.label)
    }
  }

  get level() {
    return this._level
  }

  set level(v) {
    this._level = v
    if (this.label) {
      this.label.text = this._level
      if (this._showRadius) {
        this.showRadius()
      }
    }
  }

  getLevelInfo(level) {
    if (level in this.levels) {
      let info = this.levels[level]
      info.price = Math.floor(info.cost * 0.3)
      return info
    }
  }

  getCurrentLevelInfo() {
    let info = this.getLevelInfo(this.level)
    return info
  }

  getNextLevelInfo() {
    return this.getLevelInfo(this.level + 1)
  }

  getProp(propName) {
    let currentInfo = this.getCurrentLevelInfo()
    if (propName in currentInfo) {
      return currentInfo[propName]
    } else if (propName in this) {
      return this[propName]
    }
    return null
  }

  fire() {
    this.lastFire = Date.now()
  }

  updateWeapon(ms) {
    if (this.weapon) {
      this.weapon._update(ms)
    }
  }
}