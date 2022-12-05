import { BrstmPlayer } from "./player";
const gui = require("./gui");

let player = new BrstmPlayer("https://smashcustommusic.net");
gui.runGUI(player);
window.player = player;
