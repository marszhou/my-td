import Weapon from './weapon'

class _Bullet extends Phaser.Sprite {
  constructor(game, x, y, key, speed) {
    super(game, x, y, key)

    this.active = false
    this.speed = speed
    this.target = null
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

  isBulletOutOfBound() {
    return false
  }
  // bullet is dead
  // clear its target
  die() {

  }
}

export default class Bullet extends Phaser.Group {
  constructor(game, key, bufferSize=30, bulletSpeed=400, fireRate=60) {
    super(game)

    this.key = key
    this.bulletsBuffer = []
    for (let i=0; i<bufferSize; i++) {
      let b = new _Bullet(game, 0, 0, key, bulletSpeed)
      this.bulletsBuffer.push(b)
      this.addChild(b)
    }
    this.bulletAngleOffset = 0
    this.fireAngleDegree = 0
    this.bulletSpeed = bulletSpeed
    this.fireRate = fireRate

    this.lastFrame = Date.now()
  }

  fire() {

  }

  _getCurrentAvailableBulletFromBuffer() {
    let ret = null
    _.each(this.bulletsBuffer, bullet => {
      if (!bullet.active) {
        ret = bullet
        return false
      }
    })
    if (ret) {
      return ret
    }
    let bullet = new _Bullet(game, 0, 0, this.key, this.bulletSpeed)
    this.bulletsBuffer.push(bullet)
    return bullet
  }

  update() {

    let now = Date.now()
    let ms = now - this.lastFrame
    this.lastFrame = now

    this.bulletsBuffer.forEach(bullet => {
      if (bullet.active) {
        bullet.move(ms)
      }
    })
  }
}