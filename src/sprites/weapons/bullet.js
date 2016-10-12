import Weapon from './weapon'

class _Bullet extends Phaser.Sprite {
  constructor(game, x, y, key, speed) {
    super(game, x, y, key)

    this.active = false
    this.speed = speed
    this.direction = 0
  }

  get active() {
    return this._active
  }

  set active(v) {
    this._active = v
    this.alpha = v ? 1:0
  }

  move(ms) {

  }
}

export default class Bullet extends Phaser.Group {
  constructor(game, key, bufferSize=30, bulletSpeed=400, fireRate=60) {
    super(gamem, key)

    this.bulletsBuffer = []
    for(let i=0; i<bufferSize; i++) {
      let b = new _Bullet(game, 0, 0, key, bulletSpeed)
      this.bulletsBuffer.push(b)
      this.addChild(b)
    }
    this.bulletAngleOffset = 0
    this.fireAngleDegree = 0
    this.bulletSpeed = bulletSpeed
    this.fireRate = fireRate
  }

  fire() {

  }

  _getCurrentAvailableBulletFromBuffer() {

  }
}