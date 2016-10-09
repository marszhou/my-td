import BorderedFrame from '../components/bordered-frame'
import {makeTextLabel, verticallyLayoutComponents} from '../utils/functions'
import TextButton from '../components/text-button'
import _ from 'lodash'
// import MachineGun from '../sprites/towers/machine-gun'

const time_limit = 20 // 180每波

export default class NextWave extends Phaser.Group {
  constructor(width, height, x, y, game, parent, name, addToStage, enableBody, physicsBodyType) {
    super(game, parent, name, addToStage, enableBody, physicsBodyType)

    this.w = width
    this.h = height
    this.x = x
    this.y = y
    this.margin = {left: 8, top: 8}

    this.inputEnableChildren = true

    this.border = new BorderedFrame(this.game, this.w, this.h, 0, 0)
    this.add(this.border)

    this.initComponents()

    this.waveInfo = null
    this.timer = 0
    this.duration = 0

    this.onNextWave = new Phaser.Signal()
  }

  initComponents() {
    let components = {}
    components.nextWave = makeTextLabel(this.game, 'NEXT WAVE: ')
    components.creeps = makeTextLabel(this.game, 'CREEPS: ')
    components.flyings = makeTextLabel(this.game, 'FLYINGS: ')
    components.boss = makeTextLabel(this.game, 'BOSS: ')
    components.timeLeft = makeTextLabel(this.game, 'TIME LEFT: ')
    components.triggerNext = new TextButton('TRIGGER NEXT', this.game, 0, 0, 144, 20, this.handleNext, this)
    // components.test = new TextButton('TEST', this.game, 0, 0, 144, 20, this.handleTest, this)

    verticallyLayoutComponents(_.values(components), {x: this.margin.left, y: this.margin.top}, 8).forEach(component => this.add(component))

    this.components = components
  }

  updateComponents() {
    if (this.waveInfo) {
      this.components.timeLeft.text = 'TIME LEFT: ' + time_limit
      _.each(this.waveInfo, (text, name) => {
        this.components[name].text = text
      })
      this.components.triggerNext.disabled = false
    } else {
      this.components.nextWave.text = 'NEXT WAVE: --'
      this.components.creeps.text = 'CREEPS: --'
      this.components.flyings.text = 'FLYINGS: --'
      this.components.boss.text = 'BOSS: --'
      this.components.timeLeft.text = 'TIME LEFT: --'
      this.components.triggerNext.disabled = true
    }
  }

  get waveInfo() {
    return this._waveInfo
  }

  set waveInfo(wave) {
    this._waveInfo = wave
    this.duration = 0
    this.updateComponents()
    if (wave) {
      this.resume()
    }
  }

  pause() {
    this.paused = true
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.components.triggerNext.disabled = true
  }

  resume() {
    if (!this._waveInfo) return
    this.paused = false
    this.timer = window.setTimeout(this.tick.bind(this), 1000)
    this.components.triggerNext.disabled = !this._waveInfo
  }

  tick() {
    this.timer = window.setTimeout(this.tick.bind(this), 1000)
    if (this.paused || !this._waveInfo) {
      return
    }
    this.duration += 1
    this.components.timeLeft.text = 'TIME LEFT: ' + (time_limit - this.duration)
    if (this.duration >= time_limit) {
      this.handleNext()
      this.pause()
    }
  }

  handleNext() {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
    this.waveInfo = null
    this.onNextWave.dispatch()
  }

  // handleTest() {
  //   this.waveInfo = {
  //     nextWave: 'NEXT WAVE: 2',
  //     creeps: 'CREEPS' + 100,
  //     flyings: 'FLYINGS: ' + 70,
  //     boss: 'BOSS: YES'
  //   }
  // }
}