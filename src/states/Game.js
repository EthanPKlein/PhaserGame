/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Asteroid from '../sprites/Asteroid'
import Space from '../environment/Space'
import Bullet from '../sprites/Bullet'
import Pickup from '../sprites/Pickup'
import Overlay from '../UI/overlay'
import AsteroidDefinitions from '../definitions/asteroidDefinitions'
import LevelDefinitions from '../definitions/levelDefintions'

const ASTEROID_COUNT = 25;
const NO_FIRE_COOLDOWN = 400;
const INVULNERABLE_AFTER_DAMAGE_COOLDOWN = 2000;
const STARTING_BULLETS = 100;
const STARTING_TIMER = 5000;

export default class extends Phaser.State {
  init() { }

  preload() { 
    game.load.audio('bullet', 'assets/audio/SoundEffects/laser.wav');
    game.load.audio('explosion', 'assets/audio/SoundEffects/explosion.wav');
    game.load.audio('music', 'assets/audio/Music/Corruption.mp3');
    game.load.audio('damage', 'assets/audio/SoundEffects/alarm.wav');
    game.load.audio('noammo', 'assets/audio/SoundEffects/noammo.wav');
    game.load.audio('death', 'assets/audio/SoundEffects/bigboom.wav');
    game.load.audio('victory', 'assets/audio/SoundEffects/chime.wav');
    game.load.audio('reload', 'assets/audio/SoundEffects/reload.mp3');
    game.load.audio('powerup', 'assets/audio/SoundEffects/powerup.wav');
    game.load.audio('powerdown', 'assets/audio/SoundEffects/powerdown.wav');
  }

  create() {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.space = new Space(this);

    this.player = new Player({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'ship'
    });

    this.player.resetPosition();
    this.game.add.existing(this.player);

    this.fireCooldown = NO_FIRE_COOLDOWN;
    this.playerScore = 0;
    this.waveNumber = 0;
    this.gameTimer = STARTING_TIMER;
    this.inbetweenWave = false;

    this.bullets = [];
    this.asteroids = [];
    this.pickups = [];

    this.asteroidsGroup = this.game.add.group();

    this.overlay = new Overlay({
      game: this.game,
      player: this.player,
      wave: this.waveNumber
    });

    // Sound
    this.sfxBullet = game.add.audio('bullet');
    this.sfxExplosion = game.add.audio('explosion');
    this.sfxDamage = game.add.audio('damage');
    this.sfxNoAmmo = game.add.audio('noammo');
    this.sfxDeath = game.add.audio('death');
    this.sfxVictory = game.add.audio('victory');
    this.sfxReload = game.add.audio('reload');
    this.sfxPowerup = game.add.audio('powerup');
    this.sfxPowerdown = game.add.audio('powerdown');
    this.music = game.add.audio('music');
    this.music.loopFull(1);

  }

  update() {

    this.game.physics.arcade.collide(this.asteroidsGroup);

    this.overlay.update(this.waveNumber, this.gameTimer, this.inbetweenWave);

    this.fireCooldown -= this.getDelta();

    if (this.player.isAlive() && !this.inbetweenWave) {
      this.gameTimer -= this.getDelta();
    }

    // if game time is out, destroy player
    if (this.player.isAlive() && this.gameTimer <= 0) {
      this.player.changeHealth(-999);
      this.endGame();
    }

    this.space.update();

    // damage player if they are hitting an asteroid
    if (!this.player.isInvulnerable() && this.player.isCollidingWithAnyInArray(this.asteroids) && this.player.isAlive() > 0) {
      this.player.changeHealth(-1);
      if (!this.player.isAlive()) {
        this.endGame();
      } else if (this.player.isAlive()){
        this.sfxDamage.play();
        this.player.setInvulnerable(INVULNERABLE_AFTER_DAMAGE_COOLDOWN);
      }
    }

    // assign pickup bonuses if player is close enough
    for (var i = 0; i < this.pickups.length; i++) {
      var pickup = this.pickups[i];
      if (pickup.isCollidingWithEntity(this.player)) {
        pickup.applyPowerup();
        pickup.destroy();
        this.pickups.splice(i, 1);
      }
    }

    // clean up old bullets
    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      var destroyBullet = false;
      b.update();

      // damage or destroy and asteroids this bullet is in contact with
      for (var j = 0; j < this.asteroids.length; j++) {
        var asteroid = this.asteroids[j];
        if (b.isCollidingWithEntity(asteroid)) {
          destroyBullet = true;
          asteroid.damage(1);
          this.sfxExplosion.play();
          if (asteroid.hp <= 0) {
            this.asteroids.splice(j, 1);
            asteroid.destroy();
            this.player.score += 100;
          }
        }
      }

      // destroy any pickups this bullet is in contact with
      for (var j = 0; j < this.pickups.length; j++) {
        var pickup = this.pickups[j];
        if (pickup.isCollidingWithEntity(b)) {
          destroyBullet = true;
          this.pickups.splice(j, 1);
          pickup.destroy();
          this.sfxPowerdown.play();
        }
      }

      if (b.isOutOfBounds() || destroyBullet) {
        this.bullets.splice(i, 1);
        b.destroy();
      }
    }

    if (this.waveComplete()) {
      this.game.time.events.add(3000, function() {
        this.startWave();
      }, this);
      
    }

  }

  spawnObject(type) {
    var location = this.getRandomPositionNotNearPlayer();
    var asteroid = new Asteroid({
        game: this,
        x: location.x,
        y: location.y,
        asset: 'asteroid',
        type: type
      });
      this.asteroidsGroup.add(asteroid);
      this.asteroids.push(asteroid);
  }

  spawnAsteroids() {

   var levelDefinition = LevelDefinitions[this.waveNumber - 1].enemies;
    for (var key in levelDefinition) {
      for (var i = 0; i < levelDefinition[key]; i++) {
        this.spawnObject(key);
      }
    }

    this.asteroidsGroup.enableBody = true;
    this.asteroidsGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.asteroidsGroup.setAll('body.collideWorldBounds', true);
    this.asteroidsGroup.setAll('body.bounce.x', 1);
    this.asteroidsGroup.setAll('body.bounce.y', 1);

  }

  spawnPickup(type) {
    var pickup = new Pickup({
      game: this,
      x: Math.random() * this.world.width,
      y: Math.random() * this.world.height,
      asset: type
    });
    game.add.existing(pickup);
    this.pickups.push(pickup);
  }

  spawnPickups() {
    var levelDefinition = LevelDefinitions[this.waveNumber - 1].pickups;
    for (var key in levelDefinition) {
      for (var i = 0; i < levelDefinition[key]; i++) {
        this.spawnPickup(key);
      }
    }
  }

  addBullets() {

    if (this.fireCooldown > 0) {
      return;
    } else if (this.player.bullets <= 0) {
      this.sfxNoAmmo.play();
      return;
    } else {
      this.fireCooldown = NO_FIRE_COOLDOWN;
      this.player.useBullet();
      this.sfxBullet.play();
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

  waveComplete() {
    if (this.inbetweenWave === false && this.asteroidsGroup.countLiving() === 0) {
      this.inbetweenWave = true;
      return true;
    }
    return false;
  }

  startWave(wave) {
    this.inbetweenWave = false;
    if (this.waveNumber > 0) {
      this.sfxVictory.play();
    }
    this.waveNumber++;
    this.gameTimer += 20000;
    this.player.resetPosition();
    this.player.setInvulnerable(INVULNERABLE_AFTER_DAMAGE_COOLDOWN*2);;
    this.player.giveBullets(10);
    this.spawnAsteroids();

    for (var pickup of this.pickups) {
      pickup.destroy();
    }
    this.pickups = [];
    this.spawnPickups();
  }

  endGame() {
    this.player.destroy();
    this.sfxDeath.play();
  }

  getRandomPositionNotNearPlayer() {
    var distance = 0;
    var output = {x: 0, y: 0};
    while (distance < 150) {
      output.x = Math.random() * this.world.width;
      output.y = Math.random() * this.world.height;
      distance = Math.sqrt((output.x - this.player.x) * (output.x - this.player.x) +
        (output.y - this.player.y) * (output.y - this.player.y));
    }
    return output;
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
