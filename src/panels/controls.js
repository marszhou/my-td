import BorderedFrame from '../components/bordered-frame'
import {verticallyLayoutComponents} from '../utils/functions'
import _ from 'lodash'
import TextButton from '../components/text-button'

export default class ControlsPanel extends Phaser.Group {
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

    this.createButtons()

    this.onPause = new Phaser.Signal()
    this.onResume = new Phaser.Signal()
  }

  createButtons() {
    let pauseButton = new TextButton('PAUSE', this.game, 0, 0, 144, 20, this.handlePause, this)
    this.add(pauseButton)

    let quitButton = new TextButton('QUIT', this.game, 0, 0, 144, 20, this.handleQuit, this)
    this.add(quitButton)

    this.buttons = {pauseButton, quitButton}
    verticallyLayoutComponents(_.values(this.buttons), {x: this.margin.left, y: this.margin.top}, 8)
  }

  handlePause() {
    console.log('pause click')
    if (this.buttons.pauseButton.text === 'PAUSE') {
      this.buttons.pauseButton.text = 'RESUME'
      this.onPause.dispatch()
    } else {
      this.buttons.pauseButton.text = 'PAUSE'
      this.onResume.dispatch()
    }
  }

  handleQuit() {
    if (window.confirm('Do you want to quit this game?')) {
      this.game.state.start('start')
    }
  }
}