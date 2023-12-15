import Tile from './Tile';

export default class Board {
  constructor(game) {
    this.game = game;
    this.tiles = [];

    this.tileWidth = 10;
    this.tileHeight = 10
    this.colors = ['blue', 'green', 'yellow', 'red', 'pink', 'purple', 'indigo'];
  }

  // Fill function transforms the received data into objects and fills the local board array
  fill(board) {
    for(let i = 0; i < board.length; i++) {
      let obj = Object.assign(new Tile, board[i]);
      this.tiles.push(obj);
    }
  }

  // Find last tile in path
  findLast() {
    return this.tiles.filter(itm => {
      return itm.main;
    }).sort((a,b) => {
      return b.xDist - a.xDist
    })[0];
  }

  // Find tile for given UUID
  find(id) {
    return this.tiles.find(t => {
      return t.uuid === id;
    });
  }

  // Append the main path by an amount
  appendPath(nTiles) {
    let prevTile = this.tiles.length === 0 ? null : this.findLast();
    let startDistance = prevTile === null ? 0 : prevTile.xDist + 1;

    let tmpPath = [];
    for (let i = 0; i < nTiles; i++) {
      let color = this.colors[Math.floor(Math.random() * this.colors.length)];
      // Optional: implement random money tiles
      // if(Math.random() > 0.9) {
      //   func = ['current', 'earn', '10'];
      // }

      tmpPath.push(new Tile(null, color, startDistance, 0, true));
      startDistance++;
    }

    this.setPrevious(tmpPath);
    this.setNext(tmpPath);

    if(this.tiles.length > 0) {
      prevTile.nextTiles.push(tmpPath[0].uuid);
      tmpPath[0].previousTiles.push(prevTile.uuid);
    } else {
      tmpPath[0].type = 'startTile';
    }

    this.tiles = this.tiles.concat(tmpPath);
  }

  // Append a junction to the main path
  appendJunction(branchLengths) {
    let prevTile = this.tiles.length === 0 ? null : this.findLast();
    let startDistance = prevTile === null ? 0 : prevTile.xDist + 1;

    let maxLength = 0;

    // Get highest branch length
    for (let i = 0; i < branchLengths.length; i++) {
      if (branchLengths[i] > maxLength) {
        maxLength = branchLengths[i];
      }
    }

    // Sort the branches by length
    let branches = branchLengths.sort((a,b) => {
      return b - a;
    });
    let yPositions = [1, -1, 2, -2, 3, -3];

    // Set junction type for start tile
    if (branches.length < 2) {
      prevTile.type = 'tJunc';
    } else {
      prevTile.type = 'qJunc';
    }

    // Extend main path until it is as long as the longest branch
    //----------------------------------------------------------------//
    let tmpPath = [];
    let tmpDist = 0;

    for (let i = 0; i < branches[0]; i++) {
      let color = this.colors[Math.floor(Math.random() * this.colors.length)];
      tmpPath.push(new Tile(null, color, startDistance + tmpDist, 0, true));
      tmpDist++;
    }

    if(tmpPath.length > 0) {
      this.setPrevious(tmpPath);
      this.setNext(tmpPath);

      if (this.tiles.length > 1) {
        prevTile.nextTiles.push(tmpPath[0].uuid);
        tmpPath[0].previousTiles.push(prevTile.uuid);
      }

      this.tiles = this.tiles.concat(tmpPath);
    }
    //----------------------------------------------------------------//



    // Create branches
    //----------------------------------------------------------------//
    for (let i = 0; i < branches.length; i++) {
      let tmpPath = [];
      let xPos = startDistance;
      let yPos = yPositions[i];

      for (let j = 0; j < branches[i]; j++) {
        let specTile = 'path';
        if(j === 0 && i % 2 !== 0) {
          specTile = 'branchStart-t';
        } else if(j === 0) {
          specTile = 'branchStart';
        } else if(j === branches[i] - 1 && i % 2 !== 0) {
          specTile = 'branchEnd-t';
        } else if(j === branches[i] - 1) {
          specTile = 'branchEnd';
        }

        let color = this.colors[Math.floor(Math.random() * this.colors.length)];

        tmpPath.push(new Tile(null, color, xPos - 1, yPos, false, specTile));
        xPos++;
      }

      let endTile = this.tiles.find(t => {
        return t.main && t.xDist === xPos - 2
      });

      this.setPrevious(tmpPath);
      this.setNext(tmpPath);

      //First element of branch and element it connects to
      prevTile.nextTiles.push(tmpPath[0].uuid);
      tmpPath[0].previousTiles.push(prevTile.uuid);

      //Last element of branch and element it connects to
      tmpPath[tmpPath.length - 1].nextTiles.push(endTile.uuid);
      endTile.previousTiles.push(tmpPath[tmpPath.length - 1].uuid);

      // Set junction type of endTile
      if(branches.length > 1 && branches[0] === branches[1]) {
        endTile.type = 'qJunc';
      } else if(i % 2 !== 0) {
        endTile.type = 'tJunc-i';
      } else {
        endTile.type = 'tJunc';
      }

      this.tiles = this.tiles.concat(tmpPath);
    }
    //----------------------------------------------------------------//
  }

  // Creates the board
  createBoard() {
    this.appendPath(Math.floor(Math.random() * 6) + 2);
    this.appendJunction([Math.floor(Math.random() * 5) + 3, Math.floor(Math.random() * 5) + 3]);
    this.appendPath(Math.floor(Math.random() * 7) + 2);
    this.appendJunction([Math.floor(Math.random() * 9) + 3, Math.floor(Math.random() * 5) + 3]);
    this.appendPath(Math.floor(Math.random() * 4) + 2);
    this.tiles[this.tiles.length - 1].type = 'finishTile';
  }

  // Insert previous direct neighbours for every tile in a path
  setPrevious(path) {
    for (let i = 1; i < path.length; i++) {
      path[i].previousTiles.push(path[i - 1].uuid);
    }
  }

  // Insert next direct neighbours for every tile in a path
  setNext(path) {
    for (let i = 0; i < path.length - 1; i++) {
      path[i].nextTiles.push(path[i + 1].uuid);
    }
  }
}