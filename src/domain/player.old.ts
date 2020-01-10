import * as Phaser from "phaser";

export class Player {

    VELOCITY: number = 400;
    JUMP_VELOCITY: number = 400;
    GRAVITY: number = 1000;

    cursor: Phaser.CursorKeys;
    sprite: Phaser.Sprite;

    game: Phaser.Game;
    playerJumped: boolean;


    constructor(game: Phaser.Game, x: number, y: number, cursor: Phaser.CursorKeys) {
        this.cursor = cursor;
        this.game = game;
        this.sprite = game.add.sprite(x, y, 'player');
        this.sprite.body.gravity.y = this.GRAVITY;
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.velocity.x = 2;
        this.sprite.body.maxVelocity.set(1200);
    }

    update() {
        // Move the player when an arrow key is pressed
        this.moveUpdate();
    }

    /**
     * 
     */
    moveUpdate() {
        // Player movement left - right
        if (this.cursor.left.isDown)
            this.moveLeft(this.VELOCITY);
        else if (this.cursor.right.isDown)
            this.moveRight(this.VELOCITY);
        else
            this.stop();

        // Make the player jump if he is touching the ground
        // if (this.cursor.up.isDown && this.sprite.body.touching.down)
        //     this.jump(this.JUMP_VELOCITY);

        if (this.cursor.up.isDown && this.sprite.body.touching.down) {        //  Allow the player to jump if they are touching the ground.        
            this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            this.playerJumped = true;
        } else if (this.cursor.up.isDown && this.playerJumped == true) {
            if (this.sprite.body.velocity.y > 0) {
                this.sprite.body.gravity.y = this.GRAVITY;
            } else {
                this.sprite.body.gravity.y = this.GRAVITY - 400;
            }
        } else {        // reset gravity once the jump key is released to prevent prolongation       
            this.playerJumped = false;
            this.sprite.body.gravity.y = this.GRAVITY;
        }
    }

    /**
     * 
     * @param height 
     */
    jump(height: number) {
        this.sprite.body.velocity.y = height * -1;
    }

    /**
     * 
     * @param vel 
     */
    moveLeft(vel: number) {
        this.sprite.body.velocity.x = vel * -1;
    }

    /**
     * 
     * @param vel 
     */
    moveRight(vel: number) {
        this.sprite.body.velocity.x = vel;
    }

    /**
     * 
     */
    stop() {
        this.sprite.body.velocity.x = 0;
    }

    reachLeft(): boolean {
        return this.sprite.body.position.x < 0;
    }
}