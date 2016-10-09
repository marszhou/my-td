import BorderedFrame from '../components/bordered-frame'
import {makeTextLabel, verticallyLayoutComponents} from '../utils/functions'
import _ from 'lodash'
// import TextButton from '../components/text-button'
import Grid from '../components/grid'
import MachineGun from '../sprites/towers/machine-gun'
import CannonBall from '../sprites/towers/cannon-ball'
import Poision from '../sprites/towers/poision'
import Ice from '../sprites/towers/ice'
import Laser from '../sprites/towers/laser'
// import Placeholder from '../components/placeholder'

const towerClasses = [MachineGun,Laser,Poision,Ice,CannonBall]

export default class FactoryPanel extends Phaser.Group {
  constructor(width, height, x, y, game, parent, name, addToStage, enableBody, physicsBodyType) {
    super(game, parent, name, addToStage, enableBody, physicsBodyType)
    this._current = -1

    this.w = width
    this.h = height
    this.x = x
    this.y = y
    this.margin = {left: 8, top: 8}

    this.inputEnableChildren = true

    this.border = new BorderedFrame(this.game, this.w, this.h, 0, 0)
    this.add(this.border)

    this.grid = new Grid(this.game, 160, 20, 0, 0, 8, 1)
    this.add(this.grid)

    // this.placeholder = new Placeholder(this.game, 150, 55, 5, 25)
    // this.add(this.placeholder)

    this.onChildInputDown.add(this.handleChildDown, this)

    this.createTowers()
    this.setLabelTexts(null)

    this.onChooseTower = new Phaser.Signal()
    this.onCancelChoose = new Phaser.Signal()
  }

  createTowers() {
    this.towers = []
    towerClasses.forEach((Tower, i) => {
      let tower = new Tower(this.game, i*20, 0)
      this.towers.push(tower)
      this.add(tower)
    })
  }

  get current() {
    return this._current
  }

  set current(v) {
    this._current = v
    if (v === -1) {
      this.hideInfo()
      this.grid.current = null
    } else {
      this.displayInfo(v)
      this.grid.current = {x: v, y: 0}
    }
  }

  setLabelTexts(texts) {
    if (!this.labels) {
      this.labels = {}
      let name = makeTextLabel(this.game, 'NAME: ')
      let cost = makeTextLabel(this.game, 'COST: ')
      let target = makeTextLabel(this.game, 'TAR: ')
      let type = makeTextLabel(this.game, 'TYPE: ')
      this.labels = {name, cost, target, type}
      verticallyLayoutComponents(_.values(this.labels), {x: this.margin.left, y: 20 + this.margin.top}, 8)
        .forEach(label => this.add(label))
    }

    if (texts) {
      _.keys(this.labels).forEach(name => {
        this.labels[name].text = name.toUpperCase() + ': ' + texts[name]
      })
    } else {
      _.keys(this.labels).forEach(name => {
        this.labels[name].text = name.toUpperCase() + ': --'
      })
    }
  }

  displayInfo(index) {
    // this.remove(this.placeholder)
    // this.clearLabels()

    let labels = this.towers[index].makeFactoryInfo()
    this.setLabelTexts(labels)
  }

  hideInfo() {
    // this.add(this.placeholder)
    this.clearLabels()
  }

  clearLabels() {
    if (this.labels) {
      this.setLabelTexts(null)
    }
  }

  handleChildDown(sprite) {
    let index = this.towers.indexOf(sprite)
    if (index > -1) {
      if (index === this.current) {
        this.current = -1
        this.onCancelChoose.dispatch()
      } else {
        this.current = index
        this.onChooseTower.dispatch(towerClasses[index])
      }
    }
  }
}