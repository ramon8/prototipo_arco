import * as Phaser from "phaser";
import { PhaserEntity } from ".";

export class CollisionManager extends PhaserEntity {

    collisions;

    constructor(game: Phaser.Game) {
        super(game, null);
        this.collisions = [];
    }

    newCollision(sprite1, sprite2, collideCB?, processCB?) {
        this.collisions.push(
            this.game.physics.arcade.collide(
                sprite1,
                sprite2,
                collideCB || null,
                processCB || null));
    }
}