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
    this.onLivesChange.dispatch(this.level)
    this.onLivesChange.dispatch(this.lives)
    this.onKillsChange.dispatch(this.kills)
    this.onScoreChange.dispatch(this.score)
    this.onSelectedTowerChange.dispatch(this.selectedTower)
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
}

export default new GameState()