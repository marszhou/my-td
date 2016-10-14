class GameState {
  constructor() {
    this.onGoldChange = new Phaser.Signal()
    this.onLevelChange = new Phaser.Signal()
    this.onLivesChange = new Phaser.Signal()
    this.onKillsChange = new Phaser.Signal()
    this.onScoreChange = new Phaser.Signal()
    this.onSelectedTowerChange = new Phaser.Signal()

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
    this.onLevelChange.dispatch(this.level)
    this.onLivesChange.dispatch(this.lives)
    this.onKillsChange.dispatch(this.kills)
    this.onScoreChange.dispatch(this.score)
    this.onSelectedTowerChange.dispatch(this.selectedTower)
  }

  getTowerAt(pos) {
    return _.find(this.towers, {pos: pos})
  }

  getTowerIndex(tower) {
    return _.findIndex(this.towers, {tower: tower})
  }

  addTower(tower, pos) {
    this.towers.push({tower: tower, pos: pos})
  }

  removeTower(tower) {
    let index = this.getTowerIndex(tower)
    if (index > -1) {
      this.towers.splice(index, 1)
      this.selectedTower = null
    }
    return tower
  }

  sellTower(tower) {
    let currentLevelInfo = tower.getCurrentLevelInfo()
    this.gold += currentLevelInfo.price
    return tower
  }

  // buyTower(tower) {

  // }

  upgradeTower(tower) {
    let nextLevelInfo = tower.getNextLevelInfo()
    tower.level += 1
    this.gold -= nextLevelInfo.cost
  }

  get selectedTower() {
    return this._selectedTower
  }

  set selectedTower(tower) {
    this._selectedTower = tower
    this.onSelectedTowerChange.dispatch(tower)
  }

  get gold() {
    return this._gold
  }

  set gold(v) {
    this._gold = v
    this.onGoldChange.dispatch(v)
  }

  get level() {
    return this._level
  }

  set level(v) {
    this._level = v
    this.onLevelChange.dispatch(v)
  }

  get lives() {
    return this._lives
  }

  set lives(v) {
    this._lives = v
    this.onLivesChange.dispatch(v)
  }

  get kills() {
    return this._kills
  }

  set kills(v) {
    this._kills = v
    this.onKillsChange.dispatch(v)
  }

  get score() {
    return this._score
  }

  set score(v) {
    this._score = v
    this.onScoreChange.dispatch(v)
  }

  canAffordBuild(tower) {
    return (this.gold >= tower.cost)
  }

  canAffordUpgrade(tower) {
    let nextLevelInfo = tower.getNextLevelInfo()
    if (nextLevelInfo) {
      return (this.gold >= nextLevelInfo.cost)
    }
    return false
  }

  hitEnemy(enemy, damage) {
    // console.log('hit', enemy, damage)
    enemy.damage(damage)
  }

  killEnemy(enemy) {
    this.kills += 1
    this.gold += enemy.gold
  }

  surviveEnemy(enemy) {
    this.lives -= 1
  }
}

export default new GameState()