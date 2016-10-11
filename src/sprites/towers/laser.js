import BaseTower from './base'

export default class Laser extends BaseTower {
  constructor(game, x, y, key, frame) {
    super(game, x, y, 'balls', 1);
    this.width = 20
    this.height = 20

    this.name = 'Laser'
    this.cost = 100
    this.level = 1
    this.maxLevel = 10
    this.target = ['ground,air']
    this.type = 'single'
    this.speed = 120

    this.levels = {
      1: {
        damange: 10,
        radius: 100
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