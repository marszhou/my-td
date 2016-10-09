import BorderedFrame from '../components/bordered-frame'
import {makeTextLabel, verticallyLayoutComponents} from '../utils/functions'
import _ from 'lodash'

export default class InfoPanel extends Phaser.Group {
  constructor(width, height, x, y, game, parent, name, addToStage, enableBody, physicsBodyType) {
    super(game, parent, name, addToStage, enableBody, physicsBodyType)

    this.w = width
    this.h = height
    this.x = x
    this.y = y
    this.margin = {left: 8, top: 8}

    this.inputEnableChildren = true
    this.onChildInputDown.add(this.handleDown, this)

    this.border = new BorderedFrame(this.game, this.w, this.h, 0, 0)
    this.add(this.border)

    this.initLabels()
  }

  initLabels() {
    this.labels = {}
    this.score = 0
    this.currentWave = 0
    this.lives = 100
    this.golds = 0
    this.kills = 0
    // this.labels.score = new Phaser.Text(this.game, 4, 4, this.scoreText, {font: '16px Arial', fill: '#FF0000'})
    let score = makeTextLabel(this.game, this.scoreText)
    let currentWave = makeTextLabel(this.game, this.currentWaveText)
    let lives = makeTextLabel(this.game, this.livesText)
    let golds = makeTextLabel(this.game, this.goldsText)
    let kills = makeTextLabel(this.game, this.killsText)

    // [score, currentWave, lives].forEach(label => this.add(label))

    this.labels = {score, currentWave, lives, golds, kills}
    verticallyLayoutComponents(
      _.values(this.labels),
      {x: this.margin.left, y: this.margin.top},
      5
    ).forEach(label => this.add(label))
  }

  handleDown(sprite) {
    console.log(sprite, sprite.height)
    // sprite.text = 'SCORE: 10000'
    // this.score = 123
  }
  /////////
  // score
  get score() {
    return this._score || 0
  }
  set score(v) {
    this._score = v
    if (this.labels.score) {
      this.labels.score.text = this.scoreText
    }
  }
  get scoreText() {
    return 'SCORE: ' + this.score
  }

  ////////
  // currentWave
  get currentWaveText() {
    return 'CURRENT WAVE: ' + this.currentWave
  }
  get currentWave() {
    return this._currentWave
  }
  set currentWave(v) {
    this._currentWave = v
    if (this.labels.currentWave) {
      this.labels.currentWave.text = this.currentWaveText
    }
  }

  ////////
  // lives
  get livesText() {
    return 'LIVES: ' + this.lives
  }
  get lives() {
    return this._lives
  }
  set lives(v) {
    this._lives = v
    if (this.labels.lives) {
      this.labels.lives.text = this.currentWaveText
    }
  }

  ////////
  // gold
  get goldsText() {
    return 'GOLDS: ' + this.golds
  }
  get golds() {
    return this._golds
  }
  set golds(v) {
    this._golds = v
    if (this.labels.golds) {
      this.labels.golds.text = this.goldsText
    }
  }

  ////////
  // kills
  get killsText() {
    return 'KILLS: ' + this.kills
  }
  get kills() {
    return this._kills
  }
  set kills(v) {
    this._kills = v
    if (this.labels.kills) {
      this.labels.kills.text = this.killsText
    }
  }
}