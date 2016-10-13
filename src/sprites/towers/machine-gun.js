import BaseTower from './base'
import Bullet from '../weapons/bullet'
import {getTargetAngleDegree} from 'src/utils/functions'

export default class MachineGun extends BaseTower {
  constructor(game, x, y) {
    super(game, x, y, 'balls', 0);
    this.width = 20
    this.height = 20

    this.name = 'MachineGun'
    this.cost = 100
    this.level = 1
    this.maxLevel = 10
    this.target = ['air', 'ground']
    this.type = 'single'
    this.speed = 80

    this.levels = {
      1: {
        damage: 10,
        radius: 100,
        cost: 100
      },
      2: {
        damage: 20,
        radius: 110,
        cost: 150
      },
      3: {
        damage: 30,
        radius: 130,
        cost: 250
      },
      4: {
        damage: 50,
        radius: 160,
        cost: 450
      },
      5: {
        damage: 80,
        radius: 180,
        cost: 850
      }
    }

    this.__makeWeapon()
  }

  // __makeWeapon() {
  //   this.weapon = this.game.add.weapon(30, 'bullet2')
  //   //  The bullet will be automatically killed when it leaves the world bounds
  //   this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

  //   //  Because our bullet is drawn facing up, we need to offset its rotation:
  //   this.weapon.bulletAngleOffset = 90;

  //   //  The speed at which the bullet is fired
  //   this.weapon.bulletSpeed = 400;

  //   //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
  //   this.weapon.fireRate = 60;

  //   this.weapon.trackSprite(this, 14, 0);

  //   console.log(this.weapon)
  // }

  // fire() {
  //   if (this.opponent) {
  //     super.fire()
  //     let degree = getTargetAngleDegree(this, this.target)
  //     this.weapon.fireAngle = degree
  //     this.weapon.fire()
  //   }
  // }

  __makeWeapon() {
    this.weapon = new Bullet(this.game, 'bullet2')
    this.weapon.offset(0, 0)
    this.addChild(this.weapon)
  }

  fire() {
    if (this.opponent) {
      super.fire()
      // let degree = getTargetAngleDegree(this, this.target)
      // this.weapon.fireAngle = degree
      this.weapon.fire(this.opponent)
    }
  }
}