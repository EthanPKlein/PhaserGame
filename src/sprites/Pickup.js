import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset, type }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5, 0.5);
    this.type = asset;
  }

  update() {

  }

  isCollidingWithEntity(entity) {
    var distanceToTarget = Math.sqrt((this.x - entity.x)*(this.x - entity.x) + (this.y - entity.y)*(this.y - entity.y));
    if (distanceToTarget < 30) {
      return true;
    }
    return false;
  }

  applyPowerup() {
      if (this.type==='ammo') {
          this.game.player.bullets += 5;
          this.game.sfxReload.play();
      } 
      else if (this.type==='bigAmmo') {
          this.game.player.bullets += 10;
          this.game.sfxReload.play();
      } 
      else if (this.type==='health') {
          this.game.player.changeHealth(1);
          this.game.sfxPowerup.play();
      }
       else if (this.type==='bigHealth') {
          this.game.player.changeHealth(2);
          this.game.sfxPowerup.play();
      }
      else if (this.type==='time') {
          this.game.gameTimer += 7000;
          this.game.sfxPowerup.play();
      }
      else if (this.type==='bigTime') {
          this.game.gameTimer += 15000;
          this.game.sfxPowerup.play();
      } 
      else if (this.type==='shield') {
          this.game.player.invulerableTimer += 5000;
          this.game.sfxPowerup.play();
      } 
      else if (this.type==='bigShield') {
          this.game.player.invulerableTimer += 10000;
          this.game.sfxPowerup.play();
      }
      else if (this.type==='ammoPowerup') {
          this.game.player.powerupTimer += 7000;
          this.game.sfxPowerup.play();
      }
      else if (this.type==='ammoPowerupBig') {
          this.game.player.powerupTimer += 1400;
          this.game.sfxPowerup.play();
      }
  }

}
