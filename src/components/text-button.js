
export default class TextButton extends Phaser.Button {
  constructor(text, game, x, y, width, height, handler, handlerContext, disabled) {
    super(game, x, y, 'button-bg', handler, handlerContext, 1, 0, 2)
    // this.createLabelBitmapContext()

    this.width = width
    this.height = height
    this.text = text

    this.disabled = disabled

    // this.createBackground()
  }

  createBackground() {

  }

  createLabelBitmapContext() {
    this.labelBmd = this.game.make.bitmapData(this.width, this.height)
    this.labelBmd.context.font = '12px Arial'
    this.labelBmd.context.fillStyle = '#ffffff'
  }

  createLabel() {
    this.label = new Phaser.Text(this.game, this.width/2, this.height/2 + 3, this.text, {font: '12px Arial', fill: '#FFFFFF'})
    this.label.anchor.set(0.5)
    this.addChild(this.label)
  }

  get text() {
    return this._text
  }

  set text(v) {
    this._text = v
    if (this.label) {
      this.label.text = this.text
    } else {
      this.createLabel()
    }
  }

  get disabled() {
    return this._disabled
  }

  set disabled(v) {
    this.inputEnabled = !v
    if (v) {
      this.setFrames(3, 3)
    } else {
      this.setFrames(1, 0, 2)
    }
    this._disabled = v
  }
}