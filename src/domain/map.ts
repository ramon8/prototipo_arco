import * as Phaser from "phaser";
import { PhaserEntity } from "./PhaserEntity";

export class Map extends PhaserEntity {

    TILE_SIZE: number = 25;

    tiles: Phaser.Group;

    level: string[];

    constructor(game: Phaser.Game, level: string[], tiles?: Phaser.Group) {
        super(game, null);
        this.tiles = tiles || this.game.add.group();
        this.level = level;

        // Create the level by going through the array
        level.forEach((tileRow, i) => {
            for (var j = 0; j < tileRow.length; j++) {
                // Create a wall and add it to the 'walls' group
                if (tileRow[j] == 'x') {
                    const tile = this.game.add.sprite((this.TILE_SIZE * j) - this.TILE_SIZE, (this.TILE_SIZE * i) - this.TILE_SIZE, 'floor');
                    tile.body.immovable = true;
                    this.tiles.add(tile);
                }
            }
        });
    }

    render() {
        this.tiles.forEachAlive(bullet => {
            this.game.debug.body(bullet);
        }, () => { })
    }

}