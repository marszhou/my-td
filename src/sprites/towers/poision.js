import BaseTower from './base'

export default class Poision extends BaseTower {
  constructor(game, x, y, key, frame) {
    super(game, x, y, 'balls', 2);
    this.width = 20
    this.height = 20

    this.name = 'Poision'
    this.cost = 100
    this.level = 1
    this.maxLevel = 10
    this.target = ['ground']
    this.type = 'splash'
    this.speed = 70

    this.levels = {
      1: {
        damage: 10,
        radius: 100,
        cost: 100
      }
    }
  }

  getCurrentLevelInfo() {
    return this.getLevelInfo(this.level)
  }

  getNextLevelInfo() {
    return this.getLevelInfo(this.level + 1)
  }
}