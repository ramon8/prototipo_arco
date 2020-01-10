import * as Phaser from "phaser";

export class MenuState extends Phaser.State {

    constructor() {
        super();
    }

    create() {
        let textStart = "Start";
        let textExit = "Exit";
        let style = { font: "2rem Arial", fill: "#ffffff", align: "center" };

        let start = this.game.add.text(100, this.game.world.centerY - 50, textStart, style);
        let exit = this.game.add.text(100, this.game.world.centerY, textExit, style);
        start.inputEnabled = true;
        start.events.onInputDown.add(() => {
            this.game.state.start("Game");
        }, this);
    }

    update() {

    }
}