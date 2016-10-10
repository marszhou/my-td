class GameState {
  constructor() {
    this.onGoldChange = new Phaser.Signal()

    this.towers = []
    this.selectedTower = null
    this.gold = 1000
    this.level = 1
    this.lives = 100
    this.kills = 0
    this.score = 0
  }

  init() {
    this.onGoldChange.dispatch(this.gold)
  }

  getTowerAt(pos) {
    return _.find(this.towers, {pos: pos})
  }

  addTower(tower, pos) {
    this.towers.push({tower: tower, pos: pos})
  }

  removeTower(pos) {
    let tower = this.getTowerAt(pos)
    if (tower) {
      _.pull(this.towers, tower)
      this.selectedTower = null
    }
    return tower
  }

  sellTower(tower) {

  }

  buyTower(tower) {

  }

  upgradeTower(tower) {

  }

  get selectedTower() {
    return this._selectedTower
  }

  set selectedTower(tower) {
    this._selectedTower = tower
  }

  get gold() {
    return this._gold
  }

  set gold(v) {
    this._gold = v
    this.onGoldChange.dispatch(v)
  }
}

export default new GameState()