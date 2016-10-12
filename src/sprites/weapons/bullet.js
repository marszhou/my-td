
export default class Bullet extends Phaser.Weapon {
  constructor(game) {
    super(game)

    this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
  }
}