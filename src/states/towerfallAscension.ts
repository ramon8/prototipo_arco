import * as Phaser from "phaser";
import { Player, Map, CollisionManager, Weapon } from "../domain";

export class TowerfallAscension extends Phaser.State {

    player: Player;

    enemmy: Player;

    map: Map;

    cm: CollisionManager;

    mousePresed: boolean = false;

    timePresed: number;
    wastedBullets: Phaser.Group;

    weapon: Weapon;

    pad;

    preload() {
        this.load.image('floor', './small_floor.png');
        this.load.image('player', './player_large.png');
        this.load.image('coin', './coin.png');
        this.load.image('arrow', './arrow.png');
        this.load.image('large_arrow', './large_arrow.png');
    }

    create() {
        this.input.gamepad.start();
        this.pad = this.input.gamepad.pad1;
        // Set the background color
        this.game.stage.backgroundColor = '#3598db';

        // Start the Arcade physics system (for movements and collisions)
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add the physics engine to all game objects
        this.game.world.enableBody = true;

        // Capture the mouse
        this.input.mouse.capture = true;

        // Add new Player
        this.player = new Player(
            // pas the Game instance
            this.game,
            // and pas the sprite instance
            this.add.sprite(100, 100, 'player'),
            this.pad
        );

        // Add new Enemy
        this.enemmy = new Player(
            // pas the Game instance
            this.game,
            // and pas the sprite instance
            this.add.sprite(550, 550, 'coin'),
            null
        );

        this.wastedBullets = this.add.group();
        this.weapon = new Weapon(this.game, this.player, this.input, this.pad, null);

        var level = [
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xx                                      xx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        ];

        this.map = new Map(this.game, level);

        this.cm = new CollisionManager(this.game);
    }


    update() {
        this.player.handleCollision(this.map.tiles, () => { }, () => { });
        this.player.handleCollision(this.enemmy.sprites[0], () => { }, () => { });
        this.enemmy.handleCollision(this.map.tiles, () => { }, (enemmy, tiles) => {

            if (enemmy.body.velocity.x > 5) enemmy.kill();
            if (enemmy.body.velocity.y < -5) enemmy.kill();
        });

        this.enemmy.handleCollision(this.weapon.ammo.bullets, () => { },
            (enemmy: Phaser.Sprite, bullet: Phaser.Sprite) => {
                enemmy.body.velocity.y = bullet.body.velocity.y;
                enemmy.body.velocity.x = bullet.body.velocity.x;
                // enemmy.position = bullet.position;
                return false;
            });

        this.weapon.handleCollision(this.map.tiles, (wall: Phaser.Sprite, bullet: Phaser.Sprite) => {},
            (bullet: Phaser.Sprite, wall: Phaser.Sprite) => {
                bullet.body.velocity.x = 0;
                bullet.body.velocity.y = 0;
                bullet.angle
                return true;
            });

        this.player.handleCollision(this.weapon.ammo.bullets,
            () => { },
            (player: Phaser.Sprite, bullet: Phaser.Sprite) => {
                bullet.kill();
                return false;
            });

        this.physics.arcade.collide(
            this.player.sprites[0],
            this.wastedBullets,
            () => { },
            (player: Phaser.Sprite, bullet: Phaser.Sprite) => {
                bullet.kill();
                return false;
            });



        this.weapon.update();
        this.player.update();
    }

    render() {
        // this.wastedBullets.forEachAlive((bullet) => {
        //     this.game.debug.body(bullet);
        // }, () => { });
        this.player.render();
        // this.weapon.render();
        // this.map.render();
    }
}