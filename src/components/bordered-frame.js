export default class BorderedFrame extends Phaser.Graphics {
  constructor(game, width, height, x, y) {
    super(game, x, y);
    this.w = width
    this.h = height

    this.render()
  }

  render() {
    this.clear()

    this.lineStyle(1, 0x333333, 1);

    this.moveTo(0, 0)
    this.lineTo(0, this.h)

    this.moveTo(0, this.h)
    this.lineTo(this.w, this.h)

    this.moveTo(this.w, this.h)
    this.lineTo(this.w, 0)

    this.moveTo(this.w, 0)
    this.lineTo(0, 0)
  }
}