import * as Phaser from "phaser";
import { PhaserEntity } from "./PhaserEntity";
import { Player } from ".";

export class Weapon extends PhaserEntity {

    WEAPON_MAX_TIME: number = 1000;
    ammo: Phaser.Weapon;
    player: Player;
    input: Phaser.Input;
    mousePresed: boolean;
    timePresed: number;
    pad: Phaser.SinglePad;

    constructor(game: Phaser.Game, player: Player, input: Phaser.Input, pad: Phaser.SinglePad) {
        super(game, null);
        this.player = player;
        this.input = input;
        this.pad = pad;

        this.ammo = this.game.add.weapon(5, 'arrow');
        this.ammo.bulletKillType = Phaser.Weapon.KILL_NEVER;
        this.ammo.bulletAngleOffset = 100;
        this.ammo.bulletSpeed = 1000;
        this.ammo.fireRate = 500;
        // this.ammo.bulletAngleVariance = 5;
        this.ammo.bulletGravity.y = 1000;
        this.ammo.bulletRotateToVelocity = true;
        this.ammo.trackSprite(this.player.sprites[0], 14, 0);

        this.ammo.setBulletBodyOffset(30, 30, 15, 15);
        this.ammo.bullets.callAll('anchor.setTo', '', 0.5, 0.5);
    }

    update() {
        if ((this.input.activePointer.leftButton.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_X)) && !this.mousePresed) {
            // this.ammo.fireAtXY(this.input.mouse.input.x, this.input.mouse.input.y);
            this.timePresed = this.game.time.totalElapsedSeconds();
            this.mousePresed = true;
        }

        if (!(this.input.activePointer.leftButton.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_X)) && this.mousePresed || this.input.activePointer.leftButton.isDown && this.game.time.totalElapsedSeconds() - this.timePresed > this.WEAPON_MAX_TIME) {
            const pressedTime = this.game.time.totalElapsedSeconds() - this.timePresed;
            this.shootArrow(pressedTime);
            this.mousePresed = false;
        }

        this.ammo.trackOffset.x = this.player.trackOffset;
    }

    render() {
        this.ammo.bullets.forEachAlive(bullet => {
            this.game.debug.body(bullet, 'red');
        }, () => { })
    }

    shootArrow(pressedTime) {
        this.ammo.bulletGravity.y = 0;
        this.ammo.bulletSpeed = 1000;
        // const direction = this.player.getDirection();
        // this.ammo.fireAtXY(direction.x, direction.y);

    }

    handleCollision(sprite: Phaser.Sprite | Phaser.Group, collideCB, processCB) {
        this.ammo.bullets.forEach(bullets => {
            this.game.physics.arcade.collide(
                sprite,
                bullets,
                collideCB || null,
                processCB || null);
        }, () => { });
    }

    handleCollisionRecollect(sprite: Phaser.Sprite | Phaser.Group, collideCB, processCB) {
        this.ammo.bullets.forEach(bullets => {
            this.game.physics.arcade.collide(
                sprite,
                bullets,
                collideCB || null,
                processCB || null);
        }, () => { });
    }

    /**
     * 
     * @param wall 
     * @param bullet 
     */
    addNewArrowInWall(wall, bullet): Phaser.Sprite {
        const DISTANCE = 13;
        let wallArrow;
        // LEFT
        if (bullet.x > wall.x && bullet.x < wall.x + 50) {
            wallArrow = this.game.add.sprite(wall.body.position.x + DISTANCE * 3, bullet.body.position.y, 'arrow');
        } else if (bullet.x < wall.x && bullet.x > wall.x - 50) {
            wallArrow = this.game.add.sprite(wall.body.position.x - DISTANCE, bullet.body.position.y, 'arrow');
        } else if (bullet.y < wall.y && bullet.y > wall.y - 50) {
            wallArrow = this.game.add.sprite(wall.body.position.x, bullet.body.position.y - DISTANCE, 'arrow');
        } else if (bullet.y > wall.y && bullet.y < wall.y + 50) {
            wallArrow = this.game.add.sprite(wall.body.position.x, bullet.body.position.y - DISTANCE * 3, 'arrow');

        }
        wallArrow.angle = bullet.angle;
        wallArrow.anchor.setTo(.5, .5);
        wallArrow.body.setSize(30, 30, 15, 15);
        return wallArrow;
    }
}