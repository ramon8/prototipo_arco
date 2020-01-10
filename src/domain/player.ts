import * as Phaser from "phaser";
import { PhaserEntity } from "./PhaserEntity";
import { ControllerManager } from "./controllerManager";
import { Facing } from './../types';

export class Player extends PhaserEntity {

    VELOCITY: number = 400;
    JUMP_VELOCITY: number = 650;
    MAX_VELOCITY: number = 1000;
    GRAVITY: number = 1500;
    jumpTimer: number = 0;
    facing: Facing;
    jumpCont: number = 0;
    MAXJUMPS: number = 2;

    ANGLES = {
        'UP': 180,
        'UP-LEFT': 135,
        'UP-RIGHT': -135,
        'LEFT': 90,
        'RIGHT': -90
    }

    jumpTween: Phaser.Tween;

    playerJumped: boolean;
    trackOffset: number;
    cm: ControllerManager;

    constructor(game: Phaser.Game, sprite: Phaser.Sprite, pad: Phaser.SinglePad) {
        super(game, sprite);
        sprite.body.gravity.y = this.GRAVITY;
        sprite.anchor.setTo(.5, 0);
        sprite.body.maxVelocity.y = this.MAX_VELOCITY;
        this.cm = new ControllerManager(this.game);
    }

    update() {
        super.update();
        this.handleMovement();
        this.handleJump();
    }

    render() {
        this.game.debug.body(this.sprites[0]);
    }

    handleMovement() {
        if (this.cm.controlls.left())
            this.moveLeft(this.VELOCITY);
        else if (this.cm.controlls.right())
            this.moveRight(this.VELOCITY);
        else
            this.stop();

        if (this.cm.controlls.up() && !this.cm.controlls.left() && !this.cm.controlls.right())
            this.facing = 'UP';

        if (this.cm.controlls.up() && this.cm.controlls.left() && !this.cm.controlls.right())
            this.facing = 'UP-LEFT';

        if (this.cm.controlls.up() && !this.cm.controlls.left() && this.cm.controlls.right())
            this.facing = 'UP-RIGHT';

        if (this.cm.controlls.down()) {
            this.cross();
        }


    }

    handleJump() {
        if (this.canJump()) {
            this.jump();
        }
    }

    jump(height?: number) {
        this.sprites.forEach(sprite => {
            sprite.body.velocity.y = height | -this.JUMP_VELOCITY;
            this.playerJumped = true;
            this.jumpCont++;
        });
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

    cross() {
        this.sprites.forEach(sprite => {
            // sprite.scale.setTo(1, .5);
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
        this.facing = 'LEFT';
    }

    turnRight(sprite) {
        sprite.scale.setTo(1, 1);
        this.facing = 'RIGHT';
    }

    turnUp(sprite) {
        this.facing = 'UP';
    }

    canJump(): boolean {
        console.log(this.jumpCont);
        return this.sprites[0].body.touching.down && this.cm.controlls.cross() || !this.sprites[0].body.touching.down && this.jumpCont < this.MAXJUMPS;
    }
}