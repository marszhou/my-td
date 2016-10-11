import BaseTower from './base'

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
  }
}