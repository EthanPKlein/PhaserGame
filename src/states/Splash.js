import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('ship', 'assets/images/ship.png');
    this.load.image('asteroid', 'assets/images/asteroid.png');
    this.load.image('space', 'assets/images/space.png');
    this.load.image('bullet', 'assets/images/bullet.png');
    this.load.image('comet_1', 'assets/images/comet_1.png');
    this.load.image('comet_0', 'assets/images/comet_0.png');
    this.load.image('iron_2', 'assets/images/iron_2.png');
    this.load.image('iron_1', 'assets/images/iron_1.png');
    this.load.image('iron_0', 'assets/images/iron_0.png');
    this.load.image('ship_5', 'assets/images/ship_5.png');
    this.load.image('ship_4', 'assets/images/ship_4.png');
    this.load.image('ship_3', 'assets/images/ship_3.png');
    this.load.image('ship_2', 'assets/images/ship_2.png');
    this.load.image('ship_1', 'assets/images/ship_1.png');
    this.load.image('ship_0', 'assets/images/ship_0.png');
    
  }

  create () {
    this.state.start('Game')
  }
}
