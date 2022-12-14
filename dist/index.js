"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("./player");
const gui = require("./gui");
let player = new player_1.BrstmPlayer("https://smashcustommusic.net/brstm");
gui.runGUI(player);
window.player = player;
