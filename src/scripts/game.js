/*getStartField = (amount) => {
    let tiles = new Map();
    for (let i = 0; i < amount; i++) {
        let availableTile = getAvailableTile(tiles);
        tiles.set(availableTile, createTile(availableTile));
    }
    return tiles;
};

isAvailableTile = (tiles, tile) => {
    for (let t of tiles.keys()) {
        if (tile.x === t.x && tile.y === t.y) return false;
    }
    return true;
};


getAvailableTile = (tiles) => {
    let pos;
    do {
        pos = {x: randomInt(0, sizeGrid - 1), y: randomInt(0, sizeGrid - 1)};
    } while (!isAvailableTile(tiles, pos));
    return pos;
}; */

createElement = (className, parentElement, tag = 'div') => {
    let element = document.createElement(tag);
    element.className = className;
    parentElement.appendChild(element);
    return element;
};
createGrid = (parent, size) => {
    let grid = createElement("grid", parent);

    let cells = [];
    for (let i = 0; i < size; i++) {
        cells[i] = [];
        let row = createElement("row", grid);
        for (let j = 0; j < size; j++) {
            cells[i][j] = createElement("cell", row);
        }
    }

    return cells;
};
getAvailableCell = (tiles, size) => {
    let availableCell;
    do {
        availableCell = {x: randomInt(0, size - 1), y: randomInt(0, size - 1)};
    } while (tiles.has(availableCell.x * size + availableCell.y));
    console.log(availableCell);
    return availableCell;
};

createStartTiles = (parent, size, amount) => {
    let pos = [{x: 0, y: 0}, {x: 0, y: 2}]; // remove
    let index = 0;
    let tiles = new Map();
    for (let i = 0; i < amount; i++) {
        let availableCell = pos[index++]; // getAvailableCell(tiles, size);
        tiles.set(availableCell.x * size + availableCell.y, new Tile(parent, availableCell));
    }
    return tiles;
};

class Tile {
    constructor(parent, {x, y}) {
        this.parent = parent;
        this.position = {x: x, y: y};
        this.value = Math.random() > 0.9 ? 4 : 2;
        this.html = createElement("tile", parent);
        this.merged = null;

        this.html.innerText = this.value;
    }
}

class Game {
    constructor(parent, size = 4, startTiles = 2) {
        this.size = size;

        this.cells = createGrid(parent, size);
        this.field = createElement("field", parent);

        this.tiles = createStartTiles(this.field, size, startTiles);

        this.tiles.forEach(value => {
            value.html.style.width = `${this.cells[0][0].clientWidth}px`;
            value.html.style.height = `${(this.cells)[0][0].clientHeight}px`;

            this.updateTile(value);
        });
    }

    updateTile(tile) {
        tile.html.innerText = tile.value;
        let cellPosition = this.cells[tile.position.x][tile.position.y].getBoundingClientRect();
        tile.html.style.left = `${cellPosition.left - this.field.getBoundingClientRect().left}px`;
        tile.html.style.top = `${cellPosition.top - this.field.getBoundingClientRect().top}px`;
    };

    updateTiles() {
        this.tiles.forEach(value => this.updateTile(value));
    }

    removeMergedTiles() {
        let mergedTiles = [];
        this.tiles.forEach(value => {
            if (value.merged) {
                mergedTiles.push(value.merged);
                value.merged = null;
            }
        });
        mergedTiles.forEach(value => {
            value.html.parentNode.removeChild(value.html);
            this.tiles.delete(value.keyMerged);
        });
    }

    getLine(direction, i) {
        let line = [];
        let dir = {x: Math.abs(direction.x), y: Math.abs(direction.y)};

        for (let j = 0; j < size; j++) {
            let x = i * dir.x + j * dir.y;
            let y = i * dir.y + j * dir.x;
            line.push(this.tiles.get(x * this.size + y));
        }

        return direction.x === -1 || direction.y === -1 ? line.reverse() : line;
    };

    swipe(direction) {
        for (let i = 0; i < this.size; i++) {
            let line = this.getLine(direction, i);

            line.forEach((tile, index) => {
                if (tile) {

                }
            });

            //DELETE

            //console.log(line);

            for (let j = 0; j < this.size; j++) {
                if (line[j]) {
                    if (!line[j].merged) {
                        let nextTile = this.getNextTile(line, j);

                        if (nextTile.tile && line[j].value === nextTile.tile.value) {
                            line[j].value *= 2;
                            let pos = nextTile.tile.position.x * this.size + nextTile.tile.position.y;
                            //this.tiles.delete(nextTile.tile.position.x * this.size + nextTile.tile.position.y);
                            this.setPosition(direction, nextTile.tile, j);
                            line[j].merged = nextTile.tile;
                            line[j].merged.keyMerged = pos;
                            line[nextTile.index] = null;
                        }
                    }
                } else {
                    let nextTile = this.getNextTile(line, j);
                    if (nextTile.tile) {
                        this.swap(line, j, nextTile.index);
                        this.tiles.delete(nextTile.tile.position.x * this.size + nextTile.tile.position.y);
                        this.setPosition(direction, nextTile.tile, j);
                        this.tiles.set(nextTile.tile.position.x * this.size + nextTile.tile.position.y, nextTile.tile);
                        j -= 1;
                    }
                }
            }

            //console.log(this.tiles);

            //DELETE
        }
    };

    swap(line, i, j) {
        let a = line[i];
        line[i] = line[j];
        line[j] = a;
    }

    getNextTile(line, i) {
        let j = i + 1;
        while (!line[j] && j < this.size) {
            j++;
        }
        return {tile: line[j], index: j};
    };

    setPosition(direction, tile, i) {
        if (direction.x !== 0) {
            tile.position.y = this.size - i - 1;
        } else {
            tile.position.x = this.size - i - 1;
        }
    }
}


getLine = (direction, i, size) => {
    const arr = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]];
    let line = [];

    let dir = {x: Math.abs(direction.x), y: Math.abs(direction.y)};

    for (let j = 0; j < size; j++) {
        line.push({x: i * dir.x + j * dir.y, y: i * dir.y + j * dir.x});
    }

    return direction.x === -1 || direction.y === -1 ? line.reverse() : line;
};

right = (tiles, size) => {
    for (let row = 0; row < size; row++) {
        for (let i = size - 1; i > 0; i--) {
            if (tiles.has(row * size + i)) {
                let tile = tiles.get(row * size + i);
                if (!tile.merged) {
                    let mergeTile;
                    let j = i - 1;
                    while (!tiles.has(row * size + j) && j >= 0) {
                        j--;
                    }
                    mergeTile = tiles.get(row * size + j);
                    if (mergeTile && tile.value === mergeTile.value) {
                        tile.value *= 2;
                        //mergeTile.html.parentNode.removeChild(mergeTile.html);
                        mergeTile.position.y = i;
                        //tiles.delete(row * size + j);
                        tile.merged = mergeTile;
                        i = j + 1;
                    }
                }
            } else {
                let tile;
                let j = i - 1;
                while (!tiles.has(row * size + j) && j > 0) {
                    j--;
                }
                tile = tiles.get(row * size + j);
                if (tile) {
                    tile.position.y = i;
                    tiles.set(row * size + i, tile);
                    tiles.delete(row * size + j);
                    i = i + 1;
                }
            }
        }
    }
};