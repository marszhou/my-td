export default class StartScene extends Phaser.State {
  preload() {
    let textStyle = {
      font: '45px Arial',
      alight: 'center',
      stroke: 'blue',
      fill: 'blue'
    };
    this.game.add.text(80, 150, 'start...', textStyle);

    this.input.onDown.add(this.handleStart, this)
  }

  handleStart() {
    this.game.state.start('playing')
  }

  create() {
  }
}