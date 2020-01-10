import * as Phaser from "phaser";

export class PhaserEntity {

    game: Phaser.Game;

    sprites: Phaser.Sprite[] = [];

    constructor(game: Phaser.Game, sprite: Phaser.Sprite) {
        this.game = game;
        this.sprites.push(sprite)
    }

    update() {
        this.handleTeleport();
    }


    handleTeleport() {
        this.sprites.forEach(player => {
            if (this.playerIsTouchingLeft(player) && this.sprites.length < 2) {
                const playerTemp = this.game.add.sprite(
                    1000 - (0 - player.body.position.x),
                    player.y,
                    'player'
                );
                this.sprites.push(this.setPlayerParams(playerTemp, player));
            } else if (this.playerIsOutLeft(player)) {
                this.deletePlayer(player);
            }

            if (player.body.position.x + 50 > 1000 && this.sprites.length < 2) {
                const playerTemp = this.game.add.sprite(-50, player.y, 'player');
                this.sprites.push(this.setPlayerParams(playerTemp, player));
            } else if (player.body.position.x + 50 > 1050) {
                this.deletePlayer(player);
            }

            if (player.body.position.y + 50 > 800 && this.sprites.length < 2) {
                const playerTemp = this.game.add.sprite(player.x, -50, 'player');
                this.sprites.push(this.setPlayerParams(playerTemp, player));
            } else if (player.body.position.y + 50 > 850) {
                this.deletePlayer(player);
            }

            if (player.body.position.y < 0 && this.sprites.length < 2) {
                const playerTemp = this.game.add.sprite(player.x, 800 - (0 - player.body.position.y), 'player');
                this.sprites.push(this.setPlayerParams(playerTemp, player));
            } else if (player.body.position.y < -50) {
                this.deletePlayer(player);
            }
        });
    }

    /**
     * 
     * @param player 
     */
    playerIsTouchingLeft(player): boolean {
        return player.body.position.x < 0;
    }
    /**
     * 
     * @param player 
     */
    playerIsOutLeft(player): boolean {
        return player.body.position.x < -50;
    }

    /**
     * 
     * @param player 
     */
    setPlayerParams(playerTemp, player) {
        playerTemp.body.position.y = 0;
        playerTemp.body.velocity = player.body.velocity;
        playerTemp.body.gravity.y = 1500;
        playerTemp.anchor.setTo(.5, 0);
        playerTemp.body.maxVelocity.y = 1000;
        return playerTemp;
    }

    /**
     * 
     * @param player 
     */
    deletePlayer(player) {
        player.kill();
        this.sprites = this.sprites.filter((p) => {
            return p.renderOrderID != player.renderOrderID
        });
    }

    /**
     * 
     * @param sprite 
     * @param collideCB 
     * @param processCB 
     */
    handleCollision(sprite: Phaser.Sprite | Phaser.Group, collideCB, processCB) {
        this.sprites.forEach(selfSprite => {
            this.game.physics.arcade.collide(
                selfSprite,
                sprite,
                collideCB || null,
                processCB || null);
        });
    }
}