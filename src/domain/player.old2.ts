import * as Phaser from "phaser";
import { PhaserEntity } from "./PhaserEntity";
import { ControllerManager } from "./controllerManager";

export class Player extends PhaserEntity {

    VELOCITY: number = 400;
    JUMP_VELOCITY: number = 400;
    GRAVITY: number = 1250;

    ANGLES = {
        'TOP': 180,
        'TOP-LEFT': 135,
        'TOP-RIGHT': -135,
        'LEFT': 90,
        'RIGHT': -90
    }

    // direction: Phaser.Sprite;

    playerJumped: boolean;
    trackOffset: number;
    cm: ControllerManager;

    constructor(game: Phaser.Game, sprite: Phaser.Sprite, pad: Phaser.SinglePad) {
        super(game, sprite);
        sprite.body.gravity.y = this.GRAVITY;
        sprite.anchor.setTo(.5, 0);
        // this.game.physics.arcade.enable(sprite);
        // this.direction = this.game.add.sprite(50, 50, 'large_arrow').kill();
        // this.direction.anchor.setTo(.5, 0);
        // this.direction.angle = -180;
        this.cm = new ControllerManager(this.game);
    }

    update() {
        super.update();
        // Handle the player movement
        this.handleMovement();

        // Handle the player jump
        this.handleJump();
    }

    render() {
        // this.game.debug.body(this.direction);
        this.game.debug.body(this.sprites[0]);
    }

    /**
     * 
     */
    handleMovement() {
        // Player movement left - right
        if (!this.cm.controlls.square()) {
            if (this.cm.controlls.left())
                this.moveLeft(this.VELOCITY);
            else if (this.cm.controlls.right())
                this.moveRight(this.VELOCITY);
            else
                this.stop();
            // this.hideDirection();
        } else {
            if (this.cm.controlls.up() && !this.cm.controlls.left() && !this.cm.controlls.right()) {
                this.displayDirection('TOP');
            } else if (this.cm.controlls.up() && this.cm.controlls.left() && !this.cm.controlls.right()) {
                this.displayDirection('TOP-LEFT');
            } else if (this.cm.controlls.up() && !this.cm.controlls.left() && this.cm.controlls.right()) {
                this.displayDirection('TOP-RIGHT');
            } else if (this.cm.controlls.left()) {
                this.displayDirection('LEFT');
            } else if (this.cm.controlls.right()) {
                this.displayDirection('RIGHT');
            } else {
                this.stop();
                // this.hideDirection();
            }
            // this.stop();
        }
    }

    /**
     * 
     */
    displayDirection(direction: 'TOP' | 'TOP-LEFT' | 'TOP-RIGHT' | 'LEFT' | 'RIGHT') {
        // this.direction.reset(this.sprites[0].position.x, this.sprites[0].position.y);
        // console.log(this.direction.angle);
        // if (direction === 'TOP-LEFT' || direction == 'LEFT') {
        //     this.turnLeft(this.sprites[0]);
        // } else if (direction === 'TOP-RIGHT' || direction == 'RIGHT') {
        //     this.turnRight(this.sprites[0]);
        // }
        // this.direction.angle = this.ANGLES[direction];
    }


    /**
     * 
     */
    getDirection() {
        // let direction;
        // switch (this.direction.angle) {
        //     case -180:
        //         direction = { x: this.sprites[0].position.x, y: this.sprites[0].position.y - 1000 };
        //         break;
        //     case 135: // TOP-LEFT
        //         direction = { x: this.sprites[0].position.x - 1000, y: this.sprites[0].position.y - 1000 };
        //         break;
        //     case -135: // TOP-RIGHT
        //         direction = { x: this.sprites[0].position.x + 1000, y: this.sprites[0].position.y - 1000 };
        //         break;
        //     case 90: // LEFT
        //         direction = { x: this.sprites[0].position.x - 1000, y: this.sprites[0].position.y };
        //         break;
        //     case -90: // RIGHT
        //         direction = { x: this.sprites[0].position.x + 1000, y: this.sprites[0].position.y };
        //         break;
        // }
        // return direction;
    }

    // hideDirection() {
    //     this.direction.kill();
    // }

    handleJump() {
        //  Allow the player to jump if they are touching the ground. 
        if (this.canJump())
            this.jump();
        else if (this.isInAirButJumped()) {
            if (this.isGoingDown()) {
                this.setYGravity(this.GRAVITY);
            } else {
                this.setYGravity(this.GRAVITY - 400);
            }
        } else {
            // reset gravity once the jump key is released to prevent prolongation 
            this.playerJumped = false;
            this.setYGravity(this.GRAVITY);
        }
    }

    jump(height?: number) {
        this.sprites.forEach(sprite => {
            sprite.body.velocity.y = height | -this.JUMP_VELOCITY;
            this.playerJumped = true;
        });
        //     if (this.cursor.up.isDown && this.sprite.body.touching.down) {        //  Allow the player to jump if they are touching the ground.        
        //         this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
        //         this.playerJumped = true;
        //     } else if (this.cursor.up.isDown && this.playerJumped == true) {
        //         if (this.sprite.body.velocity.y > 0) {
        //             this.sprite.body.gravity.y = this.GRAVITY;
        //         } else {
        //             this.sprite.body.gravity.y = this.GRAVITY - 400;
        //         }
        //     } else {        // reset gravity once the jump key is released to prevent prolongation       
        //         this.playerJumped = false;
        //         this.sprite.body.gravity.y = this.GRAVITY;
    }

    moveLeft(vel: number) {
        this.sprites.forEach(sprite => {
            this.turnLeft(sprite);
            sprite.body.velocity.x = -vel;
        });
    }

    moveRight(vel: number) {
        this.sprites.forEach(sprite => {
            this.turnRight(sprite);
            sprite.body.velocity.x = vel;
        });
    }

    stop() {
        this.sprites.forEach(sprite => {
            sprite.body.velocity.x = 0;
        });
    }

    setYGravity(gravity: number) {
        this.sprites.forEach(sprite => {
            sprite.body.gravity.y = gravity;
        });
    }

    isGoingDown(): boolean {
        return this.sprites[0].body.velocity.y > 0;
    }
    isInAirButJumped(): boolean {
        return this.canJump() && this.playerJumped == true;
    }
    turnLeft(sprite) {
        sprite.scale.setTo(-1, 1);
        this.trackOffset = -35;
    }
    turnRight(sprite) {
        sprite.scale.setTo(1, 1);
        this.trackOffset = 35;
    }
    canJump(): boolean {
        return this.cm.controlls.cross() && this.sprites[0].body.touching.down
    }



}