import BorderedFrame from '../components/bordered-frame'
import {makeTextLabel, verticallyLayoutComponents} from '../utils/functions'
import TextButton from '../components/text-button'
import _ from 'lodash'
import MachineGun from '../sprites/towers/machine-gun'
import GameState from 'src/game-state'

export default class TowerInfo extends Phaser.Group {
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
    // let tower = new MachineGun(this.game, 0, 0)
    // tower.level = 2
    // this.tower = tower
    this.tower = null

    this.onSell = new Phaser.Signal()
    this.onBuy = new Phaser.Signal()

    GameState.onGoldChange.add(this.handleGoldChange, this)
  }

  initComponents() {
    let current = {}
    current.title = makeTextLabel(this.game, 'CURRENT LVL: ')
    current.damage = makeTextLabel(this.game, 'DAMAGE: ')
    current.radius = makeTextLabel(this.game, 'RADIUS: ')
    current.sell = new TextButton('SELL', this.game, 0, 0, 144, 20, this.handleSell, this)
    // current.sell.disabled = true

    let next = {}
    next.title = makeTextLabel(this.game, 'NEXT LVL: ')
    next.damage = makeTextLabel(this.game, 'DAMAGE: ')
    next.radius = makeTextLabel(this.game, 'RADIUS: ')
    next.buy = new TextButton('BUY', this.game, 0, 0, 144, 20, this.handleBuy, this);
    // next.buy.disabled = true;

    [current, next].forEach(group => {
      _.each(group, (component, key) => {
        this.add(component)
      })
    })

    verticallyLayoutComponents(
      _.values(current).concat(_.values(next)),
      {x: this.margin.left, y: this.margin.top},
      8
    )

    this.current = current
    this.next = next
  }

  updateComponent() {
    if (this.tower) {
      let info = this.tower.makeLevelInfo()
      _.each(info, (group, groupName) => {
        _.each(group, (text, name) => {
          this[groupName][name].text = text
        })
      })
      this.current.sell.disabled = false
      if (_.isEmpty(info.next)) {
        this.next.title.text = 'NEXT LVL: --'
        this.next.damage.text = 'DAMAGE: --'
        this.next.radius.text = 'RADIUS: --'
        this.next.buy.text = 'BUY'
        this.next.buy.disabled = true
      } else {
        this.next.buy.disabled = !GameState.canAffordUpgrade(this.tower)
      }
    } else {
      this.current.title.text = 'CURRENT LVL: --'
      this.current.damage.text = 'DAMAGE: --'
      this.current.radius.text = 'RADIUS: --'
      this.current.sell.text = 'SELL'
      this.current.sell.disabled = true

      this.next.title.text = 'NEXT LVL: --'
      this.next.damage.text = 'DAMAGE: --'
      this.next.radius.text = 'RADIUS: --'
      this.next.buy.text = 'BUY'
      this.next.buy.disabled = true
    }
  }

  get tower() {
    return this._tower
  }

  set tower(tower) {
    this._tower = tower
    this.updateComponent()
  }

  handleSell() {
    // this.tower = new MachineGun(this.game, 0, 0)
    this.onSell.dispatch(this.tower)
  }

  handleBuy() {
    // this.tower = null
    this.onBuy.dispatch(this.tower)
  }

  handleGoldChange() {
    this.updateComponent()
  }
}