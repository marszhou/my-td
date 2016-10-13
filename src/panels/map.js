import Grid from '../components/grid'
// import MachineGun from '../sprites/towers/machine-gun'
import Path from '../components/path'
import {globalToLocal, getEnemiesInTowerRange, findBestTarget} from '../utils/functions'
// import Creep from '../sprites/creep'
import Wave from 'src/wave'
import GameState from 'src/game-state'

const cellWidth = 20

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
    this.path = new Path(this.game, width, height, cellWidth, 80, pathPoints)
    // console.log(this.path.getTowerAvailibleCells())
    this.add(this.path)

    this.speed = 200 // 每秒速度
    this.running = 0

    this.lastFrameTime = Date.now()
    this.paused = false

    this.waves = []
    this.nextWave = null
    this.currentWave = null

    this.currentTowerPrototype = null
    this._currentTower = null

    this.game.input.addMoveCallback(this.onMove, this)
    this.game.input.onDown.add(this.onDown, this)

    this.onDestroy.add(this._onDestroy, this)

    this.onSelectTower = new Phaser.Signal()
    this.onCancelTower = new Phaser.Signal()
    this.onBuildTower = new Phaser.Signal()

    this.mask = new Phaser.Graphics(this.game, 0, 0)
    this.mask.beginFill(0xffffff)
    this.mask.drawRect(this.x, this.y, this.w + 1, this.h + 1)
    this.mask.endFill()

    GameState.onSelectedTowerChange.add(this.handleSelectedTowerChange, this)
  }

  get currentTowerPrototype() {
    return this._currentTowerPrototype
  }

  set currentTowerPrototype(clazz) {
    this._currentTowerPrototype = clazz
    if (clazz) {
      this._currentTower = new clazz(this.game, 0, 0)
      this._currentTower.alpha = 0
      this._currentTower.showRadius()
      this.add(this._currentTower)
    } else {
      if (!this._currentTower) {
        this.remove(this._currentTower)
      }
      this._currentTower = null
    }
  }

  update() {
    // console.log('map update')
    this.game.debug.text(`fps=${this.game.time.fps}`, 10, 780)

    // find current cell
    let point = globalToLocal(this, {x: this.game.input.x, y: this.game.input.y})
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

      this.moveEnemies(ms)
      this.towersUpdate(now, ms)
    }
  }

  moveEnemies(ms) {
    this.waves.forEach(wave => {
      if (wave && wave.activated) {
        wave.run(ms)
      }
    })
  }

  towersUpdate(now, ms) {
    let allEnemies = this.getAllEnemies()
    GameState.towers.forEach(({tower}) => {
      tower.updateWeapon(ms)
      if (now - tower.lastFire >= tower.cooldown) {
        let availableEnemies = getEnemiesInTowerRange(tower, allEnemies)
        tower.opponent = findBestTarget(availableEnemies)
        if (tower.opponent) {
          tower.fire()
        }
      }
    })
  }

  getAllEnemies() {
    let ret = []
    this.waves.forEach(wave => {
      if (wave && wave.activated) {
        let activatedEnemies = wave.enemies.filter(enemy => enemy.activated)
        ret = ret.concat(activatedEnemies)
      }
    })
    return ret
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

  _onDestroy() {
    this.game.input.deleteMoveCallback(this.onMove, this)
    this.game.input.onDown.remove(this.onDown, this)
  }

  towerAvailibleCell(pos) {
    let cells = this.path.getTowerAvailibleCells()
    let find = null
    let i = 0
    if (pos.x > this.w || pos.y > this.h) {
      return null
    }

    _.each(cells, cell => {
      i++
      if (pos.x >= cell.x * cellWidth &&
        pos.x < (cell.x + 1) * cellWidth &&
        pos.y >= cell.y * cellWidth &&
        pos.y < (cell.y + 1) * cellWidth) {
        find = cell
        return false
      }
    })

    return find
  }

  get canOperate() {
    return !this.paused
  }

  onMove(pointer) {
    if (!this.canOperate ||
      !this._currentTower ||
      (this._currentTower && !GameState.canAffordBuild(this._currentTower))) {
      return false
    }
    let pos = globalToLocal(this, pointer.position)
    let towerCell = this.towerAvailibleCell(pos)
    if (towerCell) {
      this._currentTower.x = towerCell.x * cellWidth
      this._currentTower.y = towerCell.y * cellWidth
      this._currentTower.alpha = 1
    } else {
      this._currentTower.alpha = 0
    }
  }

  onDown(pointer) {
    // GameState.selectedTower = null

    let pos = globalToLocal(this, pointer.position)

    if (pos.x >=0 && pos.x < this.w && pos.y >= 0 && pos.y < this.h) {
      GameState.selectedTower = null
    }

    if (this.canOperate) {
      let towerCell = this.towerAvailibleCell(pos)
      let tower = GameState.getTowerAt(towerCell)
      if (this._currentTower && GameState.canAffordBuild(this._currentTower) && !tower) {
        if (towerCell) {
          this.addTower(this._currentTower, towerCell)
        }
      } else {
        if (towerCell) {
          if (tower && !this._currentTower) {
            this.toggleSelectTower(tower.tower)
          }
        }
      }
    }
  }

  addTower(tower, pos) {
    tower.hideRadius()
    this.add(tower)
    tower.built = true

    GameState.addTower(tower, pos)
    this.currentTowerPrototype = null
    GameState.selectedTower = tower
    this.onBuildTower.dispatch(tower)
  }

  removeTower(tower) {
    GameState.removeTower(tower)
    if (tower) {
      this.remove(tower)
    }
  }

  toggleSelectTower(tower) {
    if (GameState.selectedTower === tower) {
      GameState.selectedTower = null
    } else {
      GameState.selectedTower = tower
    }
  }

  handleSelectedTowerChange(tower) {
    this.unhighlightAllTowers()
    if (tower) {
      tower.showRadius()
    }
  }

  unhighlightAllTowers() {
    GameState.towers.forEach(({tower}) => {
      tower.hideRadius()
    })
  }
}