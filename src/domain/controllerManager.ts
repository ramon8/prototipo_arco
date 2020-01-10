import * as Phaser from "phaser";
import { PhaserEntity } from "./PhaserEntity";

export class ControllerManager extends PhaserEntity {

    cursors: Phaser.CursorKeys;

    keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    keyS = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    keyD = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    keyF = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

    pad: Phaser.SinglePad;

    constructor(game: Phaser.Game) {
        super(game, null);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.pad = this.game.input.gamepad.pad1;
    }

    controlls = {
        kbc: {
            up: () => this.cursors.up.isDown,
            down: () => this.cursors.down.isDown,
            left: () => this.cursors.left.isDown,
            right: () => this.cursors.right.isDown,
            cross: () => this.keyA.isDown,
            circle: () => this.keyS.isDown,
            square: () => this.keyD.isDown,
            triangle: () => this.keyF.isDown
        },

        pad: {
            up: () => this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP),
            down: () => this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN),
            left: () => this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT),
            right: () => this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT),
            cross: () => this.pad.isDown(Phaser.Gamepad.XBOX360_A),
            circle: () => this.pad.isDown(Phaser.Gamepad.XBOX360_B),
            square: () => this.pad.isDown(Phaser.Gamepad.XBOX360_X),
            triangle: () => this.pad.isDown(Phaser.Gamepad.XBOX360_Y)
        },

        up: () => this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.cursors.up.isDown,
        down: () => this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.cursors.down.isDown,
        left: () => this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.cursors.left.isDown,
        right: () => this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.cursors.right.isDown,
        cross: () => this.pad.isDown(Phaser.Gamepad.XBOX360_A) || this.keyA.isDown,
        circle: () => this.pad.isDown(Phaser.Gamepad.XBOX360_B) || this.keyS.isDown,
        square: () => this.pad.isDown(Phaser.Gamepad.XBOX360_X) || this.keyD.isDown,
        triangle: () => this.pad.isDown(Phaser.Gamepad.XBOX360_Y) || this.keyF.isDown
    }
}