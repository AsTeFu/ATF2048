document.addEventListener("DOMContentLoaded", () => {
    this.size = 4;

    const buttons = new Map();
    buttons.set("ArrowRight", {x: -1, y: 0});
    buttons.set("ArrowLeft", {x: 1, y: 0});
    buttons.set("ArrowUp", {x: 0, y: 1});
    buttons.set("ArrowDown", {x: 0, y: -1});

    let game = new Game(document.getElementById("game-container"), this.size, 2);
    document.addEventListener("keydown", ev => {
        if (buttons.has(ev.code)) {
            game.removeMergedTiles();
            game.swipe(buttons.get(ev.code));
            //right(game.tiles, this.size);
            game.updateTiles();
            console.log(game.tiles);
        }
    });
});


randomInt = (min, max) => {
    return Math.floor(min + Math.random() * (max - min + 1));
}

