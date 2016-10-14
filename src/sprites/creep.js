import HealthBar from 'src/vendors/healthbar'
console.log(HealthBar)

export const types = {
  creep: 'creep',
  flying: 'flying'
}

export default class Creep extends Phaser.Sprite {
  constructor(game, type, level, text) {
    // super(game, 0, 0, 'creeps', _.indexOf(_.keys(types), type));
    super(game, 0, 0, 'blue-ball', _.indexOf(_.keys(types), type));

    this.activated = false
    this.text = text
    this.type = type
    this.level = level
    this.speed = 75 + (50 * Math.random())
    this.maxHealth = 100
    this.health = 100
    this.currentLength = 0
    this.finished = false
    this.onKilled = new Phaser.Signal()
    this.onFinished = new Phaser.Signal()
    this.offset = (Math.random() - 0.5) * 2 // 起始位置，增加一些随机值
    this.gold = 1
  }

  get activated() {
    return this._activated
  }

  set activated(v) {
    this._activated = v
    this.visible = !!v
    if (v && !this.healthbar) {
      this.healthbar = new HealthBar(this.game, {width: this.width, height: 5})
      this.updateHealthbar()
    }
  }

  run(ms) {
    this.currentLength += ms * this.speed / 1000
    return this.currentLength
  }

  damage(v) {
    this.health -= v
    if (this.health <= 0 && this.activated) {
      this.activated = false
      this.onKilled.dispatch()
      this.healthbar.kill()
    }
  }

  positioning({x, y, percent}) {
    this.x = x
    this.y = y + this.offset * this.height
    if (this.healthbar) {
      this.healthbar.setPosition(this.x + 5, this.y - 10)
    }

    if (percent === 1) {
      this.finished = true
      this.onFinished.dispatch()
      this.healthbar.kill()
    }
  }

  get health() {
    return this._health
  }

  set health(v) {
    this._health = v
    this.updateHealthbar()
  }

  get maxHealth() {
    return this._maxHealth
  }

  set maxHealth(v) {
    this._maxHealth = v
    this.updateHealthbar()
  }

  updateHealthbar() {
    if (this.healthbar) {
      this.healthbar.setPercent(this.health / this.maxHealth * 100)
    }
  }
}