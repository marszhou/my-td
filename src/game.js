import LoaderScene from './scenes/loader'
import PlayingScene from './scenes/playing'
import StartScene from './scenes/start'

export default class Game extends Phaser.Game {
  constructor() {
    super(980, 910, Phaser.AUTO, 'game', {
      create: () => {
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.stage.disableVisibilityChange = true
        this.state.add('loader', LoaderScene);
        this.state.add('playing', PlayingScene)
        this.state.add('start', StartScene)

        this.state.start('loader')
      }
    });
  }
}