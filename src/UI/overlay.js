export default class {
    constructor({ game, player }) {
        this.game = game;
        this.player = player;

        var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
        this.healthText = this.game.add.text(15, 15, "Health: " + this.player.health, style);
        this.bulletsText = this.game.add.text(200, 15, "Health: " + this.player.bullets, style);
    }

    update() {
        this.healthText.setText("Health: " + this.player.health);
        this.bulletsText.setText("Ammo: " + this.player.bullets);
    }
}