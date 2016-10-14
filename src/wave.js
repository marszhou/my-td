import Creep from 'src/sprites/creep'
import Boss from 'src/sprites/boss'
import GameState from 'src/game-state'

const max_wave_duration = 1
const creep_gap = 300

export default class Wave {
  static generateWave(level, game, map, path, startPoint) {
    // console.log(startPoint)
    return new Wave(level, game, map, path, startPoint)
  }

  static generateEnemySequence(level, game, startPoint) {
    let ret = []
    for (let i = 0; i < 20; i++) {
      let m = new Creep(game, 'creep', level, String.fromCharCode(65 + i))
      m.anchor.set(0.5)
      m.positioning({x: startPoint.x, y: startPoint.y, percent: 0})
      m.visible = false
      ret.push(m)
    }

    return ret
  }

  constructor(level, game, map, path, startPoint) {
    this.level = level
    this.game = game
    this.map = map
    this.path = path
    this.startPoint = startPoint
    this.activated = false
    this.onExpired = new Phaser.Signal()
    this.onOver = new Phaser.Signal()

    this.over = false

    this.enemies = Wave.generateEnemySequence(level, game, startPoint)
    this.enemies.forEach(m => {
      this.map.add(m)
      m.onKilled.add(_.partial(this.handleKilled, m), this)
      m.onFinished.add(_.partial(this.handleFinished, m), this, m)
    })
    this.timeElapsed = 0
  }

  run(ms) {
    if (this.over) {
      return
    }
    this.timeElapsed += ms
    if (this.timeElapsed >= max_wave_duration * 1000) {
      this.onExpired.dispatch(this)
    }
    this.enemies.forEach((m, i) => {
      let mActivatedTime = i * creep_gap

      if (m.activated) {
        let pos = this.path.getPosition(m.run(ms))
        m.positioning(pos)
      } else {
        if (this.timeElapsed > mActivatedTime) {
          m.activated = true
        }
      }
    })
  }

  launch() {
    this.activated = true
  }

  getInfo() {
    let creeps = 0
    let flyings = 0
    let boss = false

    this.enemies.forEach(m => {
      if (m instanceof Boss) {
        boss = true
      } else {
        if (m.type === 'creep') {
          creeps += 1
        } else {
          flyings += 1
        }
      }
    })
    return {
      nextWave: 'NEXT WAVE: ' + this.level,
      creeps: 'CREEPS: ' + (creeps || '--'),
      flyings: 'FLYINGS: ' + (flyings || '--'),
      boss: 'BOSS: ' + (boss ? 'YES' : '--')
    }
  }

  isOver() {
    return this.over
  }

  handleKilled(m) {
    this.removeEnemy(m)
    GameState.killEnemy(m)
  }

  handleFinished(m) {
    this.removeEnemy(m)
    GameState.surviveEnemy(m)
  }

  removeEnemy(m) {
    _.pull(this.enemies, m)
    this.map.remove(m)
    if (this.enemies.length === 0) {
      this.over = true
      this.onOver.dispatch(this)
    }
  }
}