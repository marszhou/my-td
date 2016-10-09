import Grid from '../components/grid'
// import MachineGun from '../sprites/towers/machine-gun'
import Path from '../components/path'
// import {globalToLocal} from '../utils/functions'
// import Creep from '../sprites/creep'
import Wave from 'src/wave'

export default class MapPanel extends Phaser.Group {
  constructor(width, height, x, y, game, parent, name, addToStage, enableBody, physicsBodyType) {
    super(game, parent, name, addToStage, enableBody, physicsBodyType)

    this.onNewWaveIsReady = new Phaser.Signal()
    this.onPrepareNextWave = new Phaser.Signal()

    this.w = width
    this.h = height
    this.x = x
    this.y = y

    this.grid = new Grid(this.game, this.w, this.h, 0, 0, 40, 30)
    this.add(this.grid)

    let pathPoints = [[0, 14], [7, 10], [16, 28], [25, 23], [24, 10], [34, 4], [40, 7]]
    this.path = new Path(this.game, width, height, 20, 80, pathPoints)
    console.log(this.path.getTowerAvailibleCells())
    this.add(this.path)

    this.speed = 200 // 每秒速度
    this.running = 0

    this.lastFrameTime = Date.now()
    this.paused = false

    this.waves = []
    this.nextWave = null
    this.currentWave = null
  }

  update() {
    this.game.debug.text(`fps=${this.game.time.fps}`, 10, 780)

    // find current cell
    let point = {x: this.game.input.x, y: this.game.input.y}
    let cpoint = this.grid.findCell(point)
    this.grid.current = cpoint

    if (cpoint) {
      this.game.debug.text(`grid x=${cpoint.x}, y=${cpoint.y}`, 300, 620)
    }
    if (!this.paused) {
      // run game
      let now = Date.now()
      let ms = now - this.lastFrameTime
      this.lastFrameTime = now
      this.waves.forEach(wave => {
        if (wave && wave.activated) {
          wave.run(ms)
        }
      })
    }
  }

  generateNextWave(level) {
    this.nextWave = Wave.generateWave(level, this.game, this, this.path, this.path.getPosition(0))
    this.nextWave.onExpired.add(this.handleWaveExpired, this)
    this.nextWave.onOver.add(this.handleWaveOver, this)

    this.onNewWaveIsReady.dispatch(this.nextWave)
    return this.nextWave
  }

  launchNextWave() {
    this.nextWave.launch()
    this.waves.push(this.nextWave)
    this.currentWave = this.nextWave
    this.nextWave = null
    return this.currentWave
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
    this.lastFrameTime = Date.now()
  }

  dispatchPrepareNextWave(wave) {
    if (!this.nextWave && this.currentWave === wave) {
      this.onPrepareNextWave.dispatch(wave)
    }
  }

  handleWaveOver(wave) {
    _.pull(this.waves, wave)
    this.dispatchPrepareNextWave(wave)
  }

  handleWaveExpired(wave) {
    this.dispatchPrepareNextWave(wave)
  }
}