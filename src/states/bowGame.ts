import * as Phaser from "phaser";
import { Player, Weapon, Map, CollisionManager } from "../domain";

export class BowGame extends Phaser.State {

    player: Player;
    game: Phaser.Game;
    weapon: Weapon;
    pad: Phaser.SinglePad;
    map: Map;
    cm: CollisionManager;

    preload() {
        this.load.image('floor', './small_floor.png');
        this.load.image('player', './player_large.png');
        this.load.image('coin', './coin.png');
        this.load.image('arrow', './arrow.png');
        this.load.image('large_arrow', './large_arrow.png');
        this.load.image('bow', './bow.png');
    }

    create() {
        this.input.gamepad.start();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.enableBody = true;
        this.game.stage.backgroundColor = '#3598db';

        this.pad = this.input.gamepad.pad1;

        this.player = new Player(
            this.game,
            this.add.sprite(100, 100, 'player'),
            this.pad
        );

        this.weapon = new Weapon(
            this.game,
            this.player,
            this.input,
            this.pad,
            this.game.add.sprite(50, 50, 'bow')
        );

        this.cm = new CollisionManager(
            this.game
        );

        var level = [
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxx          xxxxxx          xxxxxxxx',
            'xxxxx                                xxxxx',
            'xxxxx                                xxxxx',
            'xxxxx                                xxxxx',
            'xxx                                    xxx',
            'xx                                      xx',
            'xxx                                    xxx',
            'xxx               xxxxxx               xxx',
            'xxx               xxxxxx               xxx',
            'xxx               xxxxxx               xxx',
            'xxx               xxxxxx               xxx',
            'xx       xxx      xxxxxx      xxx       xx',
            'xx       xxx      xxxxxx      xxx       xx',
            'xx   x   xxx                  xxx   x   xx',
            'xx       xxx                  xxx       xx',
            'xx                                      xx',
            'xx                                      xx',
            'xxx                                    xxx',
            'xxx                                    xxx',
            'xxx                                    xxx',
            'xxxx              xxxxxx              xxxx',
            'xxx               xxxxxx               xxx',
            'xxx               xxxxxx               xxx',
            'xx      xxxx      xxxxxx      xxxx      xx',
            'xxx               xxxxxx               xxx',
            'xxxxx                                xxxxx',
            'xxxxx                                xxxxx',
            'xxxxx                                xxxxx',
            'xxxxxxxx          xxxxxx          xxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        ];

        this.map = new Map(
            this.game,
            level
        );
    }

    update() {
        this.player.handleCollision(this.map.tiles, () => { }, (player, wall) => {
            if(player.position.y < wall.position.y){
                this.player.jumpCont = 0;
            }
        });

        this.player.handleCollision(this.weapon.ammo.bullets, () => { },
            (player: Phaser.Sprite, bullet: Phaser.Sprite) => {
                bullet['dead'] = false;
                bullet.kill();
                return false;

            }
        );

        this.weapon.handleCollision(this.map.tiles, () => { },
            (bullet: Phaser.Sprite, wall: Phaser.Sprite) => {
                const maxVel = 150;
                if (bullet.body.velocity.y < -maxVel || bullet.body.velocity.y > maxVel || bullet.body.velocity.x < -maxVel || bullet.body.velocity.x > maxVel) {
                    // this.weapon.ammo.bulletRotateToVelocity = false;
                    // bullet.rotation = bullet.body.velocity.y;
                    bullet['dead'] = true;
                    bullet.body.velocity.setTo(0, 0);
                    bullet.body.gravity.setTo(0, 0);
                }
                return true;
            });

        // this.weapon.handleCollision(this.weapon.ammo.bullets, () => { }, () => { return false });

        // this.player.handleCollision(this.weapon.sprites[0], () => { }, () => { });

        this.player.update();
        this.weapon.update();
    }

    render() {
        // this.player.render();
        // this.weapon.render();
    }
}