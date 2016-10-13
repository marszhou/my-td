// import Weapon from './weapon'
import {localToGlobal, globalToLocal, calculateLengthBetweenPoints, getTargetAngle, getPositionOfVector} from 'src/utils/functions'

class _Bullet extends Phaser.Sprite {
  constructor(game, x, y, key, speed, angleOffset) {
    super(game, x, y, key)

    this.active = false
    this.speed = speed
    this.angleOffset = angleOffset
    this.opponent = null
    this.direction = 0

    this.onDie = new Phaser.Signal()
  }

  get active() {
    return this._active
  }

  set active(v) {
    this._active = v
    this.alpha = v ? 1:0
  }

  move(ms) {
    let moveLength = ms/1000 * this.speed
    let oOffset = localToGlobal(this.opponent, {x: 0, y: 0})
    let bOffset = localToGlobal(this, {x: 0, y: 0})
    let totalLength = calculateLengthBetweenPoints(oOffset, bOffset) - this.opponent.width / 2 - this.width / 2
    let angle = getTargetAngle(bOffset, oOffset)

    let hit = false
    if (moveLength >= totalLength) {
      moveLength = totalLength
      hit = true
    }

    if (hit) {
      this.die()
    } else {
      let _position = getPositionOfVector(bOffset, angle, moveLength)
      let position = globalToLocal(this.parent, _position)
      this.x = position.x
      this.y = position.y
      this.angle = angle * 180 / Math.PI - this.angleOffset
    }
  }

  isBulletOutOfBound() {
    return false
  }

  wake(opponent) {
    this.opponent = opponent
    this.active = true
    this.x = 0
    this.y = 0
  }
  // bullet is dead
  // clear its target
  die() {
    this.active = false
    this.opponent = null
    this.onDie.dispatch(this)
  }
}

export default class Bullet extends Phaser.Group {
  constructor(game, key, bufferSize=100, bulletSpeed=400, bulletAngleOffset=0) {
    super(game)

    this.key = key
    this.bulletsBuffer = []
    this.bulletAngleOffset = bulletAngleOffset
    this.bulletSpeed = bulletSpeed

    for (let i=0; i<bufferSize; i++) {
      let b = this.newBullet()
      this.bulletsBuffer.push(b)
    }

    this.lastFrame = Date.now()
  }

  newBullet() {
    let b = new _Bullet(this.game, 0, 0, this.key, this.bulletSpeed, this.bulletAngleOffset)
    b.anchor.set(0.5)
    b.width *= 0.5
    b.height *= 0.5
    b.onDie.add(this.handleBulletDie, this)
    return b
  }

  fire(opponent) {
    let bullet = this._getCurrentAvailableBulletFromBuffer()
    bullet.wake(opponent)
    this.add(bullet)
  }

  handleBulletDie(bullet) {
    this.remove(bullet)
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
    let bullet = this.newBullet()
    this.bulletsBuffer.push(bullet)
    return bullet
  }

  offset(x, y) {
    this.x = x
    this.y = y
  }

  _update(ms) {
    this.bulletsBuffer.forEach(bullet => {
      if (bullet.active) {
        bullet.move(ms)
      }
    })
  }
}