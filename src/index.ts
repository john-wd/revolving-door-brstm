import { BrstmPlayer } from "./player";
const gui = require("./gui");

let player = new BrstmPlayer();
gui.runGUI(player);
window.player = player;
