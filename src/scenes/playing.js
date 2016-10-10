// import Grid from '../components/grid'
import MapPanel from '../panels/map'
import InfoPanel from '../panels/info'
import ControlsPanel from '../panels/controls'
import FactoryPanel from '../panels/factory'
import TowerInfoPanel from '../panels/tower-info'
import NextWavePanel from '../panels/next-wave'
import GameState from 'utils/game-state'

export default class PlayingScene extends Phaser.State {
  preload() {
    this.game.time.advancedTiming = true
    this.level = 0

    this.panels = {}
    this.panels.map = new MapPanel(800, 600, 5, 5, this.game)

    this.panels.info = new InfoPanel(160, 70, 810, 5, this.game)
    this.panels.controls = new ControlsPanel(160, 65, 810, 80, this.game)
    this.panels.factory = new FactoryPanel(160, 85, 810, 150, this.game)
    this.panels.towerInfo = new TowerInfoPanel(160, 150, 810, 240, this.game)
    this.panels.nextWave = new NextWavePanel(160, 210, 810, 395, this.game)

    this.panels.controls.onPause.add(this.handlePause, this)
    this.panels.controls.onResume.add(this.handleResume, this)
    this.panels.factory.onCancelChoose.add(this.handleCancelChooseFactoryPrototype, this)
    this.panels.factory.onChooseTower.add(this.handleChooseFactoryPrototype, this)
    this.panels.towerInfo.onSell.add(this.handleSellTower, this)
    this.panels.towerInfo.onBuy.add(this.handleUpgradeTower, this)
    this.panels.nextWave.onNextWave.add(this.handleNextWave, this)

    this.panels.map.onNewWaveIsReady.add(this.handleNewWaveIsReady, this)
    this.panels.map.onPrepareNextWave.add(this.handlePrepareNextWave, this)
    this.panels.map.onSelectTower.add(this.handleSelectTower, this)
    this.panels.map.onCancelTower.add(this.handleCancelTower, this)
    this.panels.map.onBuildTower.add(this.handleBuildTower, this)

    this.panels.map.generateNextWave(this.level + 1)

    GameState.onGoldChange.add(this.handleGoldChange, this)
    GameState.init()

    // this.game.add.group(this.panels.map)
  }

  get level() {
    return this._level
  }

  set level(v) {
    this._level = v
    if (this.panels && this.panels.info) {
      this.panels.info.currentWave = this._level
    }
  }

  update() {
    // console.log('update')
    this.game.debug.inputInfo(10, 620);
  }

  render() {
    // this.game.debug.pointer(this.game.input.activePointer)
  }

  customerFunction() {
    console.log('xxxx')
  }

  handleSellTower(tower) {

  }

  handleUpgradeTower(tower) {

  }

  handleCancelChooseFactoryPrototype() {
    this.panels.map.currentTowerPrototype = null
  }

  handleChooseFactoryPrototype(clazz) {
    this.panels.map.currentTowerPrototype = clazz
  }

  handlePause() {
    this.panels.map.pause()
    this.panels.nextWave.pause()
  }

  handleResume() {
    this.panels.map.resume()
    this.panels.nextWave.resume()
  }

  handleNextWave() {
    let wave = this.panels.map.launchNextWave()
    this.level = wave.level
  }

  handleNewWaveIsReady(wave) {
    this.panels.nextWave.waveInfo = wave.getInfo()
  }

  handlePrepareNextWave(wave) {
    this.panels.map.generateNextWave(this.level + 1)
  }

  handleBuildTower(tower) {

  }

  handleSelectTower(tower) {

  }

  handleCancelTower() {

  }

  handleGoldChange(gold) {
    this.panels.info.golds = gold
  }
}