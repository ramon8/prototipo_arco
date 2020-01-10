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
    ANGLES = {
        "RIGHT": 0,
        "DOWN": 90,
        "LEFT": 180,
        "UP": 270,
        "UP-LEFT": 225,
        "UP-RIGHT": 315
    }

    constructor(game: Phaser.Game, player: Player, input: Phaser.Input, pad: Phaser.SinglePad, sprite: Phaser.Sprite) {
        super(game, sprite);
        this.sprites[0].anchor.setTo(.5, .5);
        this.player = player;
        this.input = input;
        this.pad = pad;

        this.ammo = this.game.add.weapon(20, 'arrow');
        this.ammo.bulletKillType = Phaser.Weapon.KILL_NEVER;
        // this.ammo.bulletAngleOffset = 100;
        this.ammo.bulletSpeed = 1000;
        this.ammo.fireRate = 500;
        this.ammo.bulletAngleVariance = 1;
        this.ammo.bulletGravity.y = 1000;
        this.ammo.trackSprite(this.player.sprites[0], 0, 0);
        // this.ammo.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.ammo.bulletLifespan = 1000 * 10;
        // this.ammo.bulletRotateToVelocity = true;
        // this.ammo.bulletInheritSpriteSpeed = true;

        this.ammo.setBulletBodyOffset(10, 10, 7, 5);
        // this.ammo.bullets.callAll('anchor.setTo', '', 0.5, 0.5);
    }

    update() {
        this.setPositionWeapon();
        if (this.pad.isDown(Phaser.Gamepad.XBOX360_X)) {
            this.shootArrow();
        }

        this.ammo.bullets.forEachAlive((bullet: Phaser.Sprite) => {
            if (!bullet['dead']) {
                bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
            }
        }, () => { });
    }

    render() {
        this.ammo.bullets.forEachAlive((bullet) => {
            this.game.debug.body(bullet);
        }, () => { });
    }

    setPositionWeapon() {
        this.sprites[0].angle = 0;
        switch (this.player.facing) {
            case "DOWN": break;
            case "LEFT":
                this.turnLeft();
                this.sprites[0].position.x = this.player.sprites[0].position.x - 30;
                this.sprites[0].position.y = this.player.sprites[0].position.y + 25;
                break;
            case "RIGHT":
                this.turnRight();
                this.sprites[0].position.x = this.player.sprites[0].position.x + 30;
                this.sprites[0].position.y = this.player.sprites[0].position.y + 25;
                break;
            case "UP":
                this.turnUp();
                this.sprites[0].position.x = this.player.sprites[0].position.x;
                this.sprites[0].position.y = this.player.sprites[0].position.y - 15;
                break;
            case "UP-LEFT":
                this.turnUpLeft();
                this.sprites[0].position.x = this.player.sprites[0].position.x - 25;
                this.sprites[0].position.y = this.player.sprites[0].position.y - 15;
                break;
            case "UP-RIGHT":
                this.turnUpRight();
                this.sprites[0].position.x = this.player.sprites[0].position.x + 25;
                this.sprites[0].position.y = this.player.sprites[0].position.y - 15;
                break;
        }
    }

    turnLeft() {
        this.ammo.trackSprite(this.player.sprites[0], -60, 25);
        this.sprites[0].scale.setTo(-1, 1);
    }

    turnRight() {
        this.ammo.trackSprite(this.player.sprites[0], 60, 25);
        this.sprites[0].scale.setTo(1, 1);
    }

    turnUp() {
        this.ammo.trackSprite(this.player.sprites[0], 0, -50);
        this.sprites[0].scale.setTo(-1, 1);
        this.sprites[0].angle = 90;
    }

    turnUpLeft() {
        this.ammo.trackSprite(this.player.sprites[0], -50, -50);
        this.sprites[0].scale.setTo(-1, 1);
        this.sprites[0].angle = 45;
    }

    turnUpRight() {
        this.ammo.trackSprite(this.player.sprites[0], 50, -50);
        this.sprites[0].scale.setTo(-1, 1);
        this.sprites[0].angle = 135;
    }

    shootArrow() {
        // this.ammo.bulletGravity.y = 0;
        // this.ammo.bulletSpeed = 1000;
        let direction;
        const playerPos = this.player.sprites[0].body.position;
        this.ammo.fireAngle = this.ANGLES[this.player.facing];
        this.ammo.fire();

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

}