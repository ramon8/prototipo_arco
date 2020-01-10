import "../assets/coin.png";
import "../assets/empty.png";
import "../assets/enemy.png";
import "../assets/floor.png";
import "../assets/lava.png";
import "../assets/player_1.png";
import "../assets/arrow.png";
import "../assets/small_floor.png";
import "../assets/player_large.png";
import "../assets/large_arrow.png";
import "../assets/bow.png";

import * as Phaser from "phaser";

import {
    Player,
    CollisionManager,
    Map,
    PhaserEntity,
    CustomWordWrap,
    Weapon,
    ControllerManager


} from './domain'

import {
    MenuState,
    TowerfallAscension,
    BowGame
} from './states';

class Game extends Phaser.Game {

    constructor() {
        // let width = document.documentElement.clientWidth > 768 ? 768 : document.documentElement.clientWidth;
        // let height = document.documentElement.clientHeight > 1024 ? 1024 : document.documentElement.clientHeight;
        super(1000, 800, Phaser.AUTO, "game", null);


        this.state.add("Menu", MenuState);
        this.state.add("TowerfallAscension", TowerfallAscension);
        this.state.add("BowGame", BowGame);

        this.state.start("BowGame");
    }
}

new Game();