/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Asteroid from '../sprites/Asteroid'
import Space from '../environment/Space'
import Bullet from '../sprites/Bullet'

const ASTEROID_COUNT = 25;
const NO_FIRE_COOLDOWN = 400;
const INVULNERABLE_AFTER_DAMAGE_COOLDOWN = 2000;

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

    this.fireCooldown = NO_FIRE_COOLDOWN;

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

    //var delta = this.time.now - this.time.prevTime;
    this.fireCooldown -= this.getDelta();
    this.space.update();

    // damage player if they are hitting an asteroid
    if (!this.player.isInvulnerable() && this.player.isCollidingWithAnyInArray(this.asteroids)) {
      this.player.health--;
      if (this.player.health <= 0) {
        this.player.destroy();
      } else {
        this.player.setInvulnerable(INVULNERABLE_AFTER_DAMAGE_COOLDOWN);
      }

    }

    // clean up old bullets
    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      b.update();

      for (var j = 0; j < this.asteroids.length; j++) {
        var asteroid = this.asteroids[j];
        if (b.isCollidingWithEntity(asteroid)) {
          this.asteroids.splice(j, 1);
          asteroid.destroy();
        }
      }

      if (b.isOutOfBounds()) {
        this.bullets.splice(i, 1);
        b.destroy();
      }
    }

  }
  

  addBullets() {

    if (this.fireCooldown > 0) {
      return;
    } else {
      this.fireCooldown = NO_FIRE_COOLDOWN;
    }

    for (var i = 0; i < 4; i++) {
      var bullet1 = new Bullet({
        game: this,
        x: this.player.x,
        y: this.player.y,
        asset: 'bullet'
      });

      if (i===0) {
        bullet1.velocity.x = .3;
      } else if (i===1) {
        bullet1.velocity.x = -.3;
      } else if (i===2) {
        bullet1.velocity.y = .3;
      } else {
        bullet1.velocity.y = -.3;
      }
      
      this.bullets.push(bullet1);
      this.game.add.existing(bullet1);
    }
  }

  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }

  getDelta() {
    return this.time.now - this.time.prevTime;
  }
}
