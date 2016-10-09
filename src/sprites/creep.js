export const types = {
  creep: 'creep',
  flying: 'flying'
}

export default class Creep extends Phaser.Sprite {
  constructor(game, type, level, text) {
    // super(game, 0, 0, 'creeps', _.indexOf(_.keys(types), type));
    super(game, 0, 0, 'blue-ball', _.indexOf(_.keys(types), type));

    this.activated = false
    this.type = type
    this.level = level
    this.speed = 200 * Math.random()
    this.health = 100
    this.currentLength = 0
    this.finished = false
    this.onKilled = new Phaser.Signal()
    this.onFinished = new Phaser.Signal()
    this.offset = Math.random() - 0.5
  }

  get activated() {
    return this._activated
  }

  set activated(v) {
    this._activated = v
    this.visible = !!v
  }

  run(ms) {
    this.currentLength += ms * this.speed /1000
    return this.currentLength
  }

  damage(v) {
    this.health -= v
    if (this.health <= 0) {
      this.onKilled.dispatch()
    }
  }

  positioning({x, y, percent}) {
    this.x = x
    this.y = y + this.offset * this.height

    if (percent === 1) {
      this.finished = true
      this.onFinished.dispatch()
    }
  }
}