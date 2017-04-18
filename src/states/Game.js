/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Asteroid from '../sprites/Asteroid'
import Space from '../environment/Space'
import Bullet from '../sprites/Bullet'

var ASTEROID_COUNT = 25;
var NO_FIRE_COOLDOWN = .5;

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.space = new Space(this);

    this.player = new Player({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'ship'
    });

    this.bullets = [];
    this.asteroids = [];
    for (var i = 0; i < ASTEROID_COUNT; i++) {
      var asteroid = new Asteroid({
        game: this,
        x: this.world.centerX,
        y: this.world.centerY,
        asset: 'asteroid'
      });
      this.asteroids.push(asteroid);
      this.game.add.existing(asteroid);
    }

    this.game.add.existing(this.player);
  }

  update() {
    this.space.update();

    // clean up old bullets
    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      b.update();
      if (b.isOutOfBounds()) {
        this.bullets.splice(i, 1);
      }
    }

  }
  

  addBullets() {

    for (var i = 0; i < 4; i++) {
      var bullet1 = new Bullet({
        game: this,
        x: this.player.x,
        y: this.player.y,
        asset: 'bullet'
      });

      if (i===0) {
        bullet1.velocity.x = 10;
      } else if (i===1) {
        bullet1.velocity.x = -10;
      } else if (i===2) {
        bullet1.velocity.y = 10;
      } else {
        bullet1.velocity.y = -10;
      }
      
      this.bullets.push(bullet1);
      this.game.add.existing(bullet1);
    }

    

    // var bullet2 = new Bullet({
    //   game: this,
    //   x: this.player.x,
    //   y: this.player.y,
    //   asset: 'bullet'
    // });
    // bullet2.velocity.y = 10;
    // this.game.add.existing(bullet2);

    // var bullet3 = new Bullet({
    //   game: this,
    //   x: this.player.x,
    //   y: this.player.y,
    //   asset: 'bullet'
    // });
    // bullet3.velocity.x = -10;
    // this.game.add.existing(bullet3);

    // var bullet4 = new Bullet({
    //   game: this,
    //   x: this.player.x,
    //   y: this.player.y,
    //   asset: 'bullet'
    // });
    // bullet3.velocity.x = -10;
    // this.game.add.existing(bullet3);

  }

  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
