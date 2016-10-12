export default class LoaderScene extends Phaser.State {
  preload() {
    let textStyle = {
      font: '45px Arial',
      alight: 'center',
      stroke: 'blue',
      fill: 'blue'
    };
    this.game.add.text(80, 150, 'loading...', textStyle);
    this.game.load.image('sprite1', '/static/assets/sprites/melon.png')
    this.game.load.spritesheet('button-bg', '/static/assets/button-bg.png', 144, 20)
    this.game.load.bitmapFont('carrier_command',
                              '/static/assets/fonts/bitmapFonts/carrier_command.png',
                              '/static/assets/fonts/bitmapFonts/carrier_command.xml')
    this.game.load.spritesheet('balls', '/static/assets/sprites/balls.png', 17, 17, 6);
    this.game.load.image('blue-ball', '/static/assets/sprites/blue_ball.png')
    this.game.load.image('bullet1', '/static/assets/bullets/bullet59.png')
    this.game.load.image('bullet2', '/static/assets/bullets/bullet18.png')
  }

  create() {
    this.game.state.start('playing');
  }
}