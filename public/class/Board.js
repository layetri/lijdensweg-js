import Tile from './Tile';

export default class Board {
  constructor(game) {
    this.game = game;
    this.tiles = [];

    this.tileWidth = 10;
    this.tileHeight = 10
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

  // Append the main path by an amount
  appendPath(nTiles) {
    let prevTile = this.tiles.length === 0 ? null : this.findLast();
    let startDistance = prevTile === null ? 0 : prevTile.xDist + 1;

    let tmpPath = [];
    for (let i = 0; i < nTiles; i++) {
      tmpPath.push(new Tile(null, 'red', startDistance, 0, true));
      startDistance++;
    }

    this.setPrevious(tmpPath);
    this.setNext(tmpPath);

    if(this.tiles.length > 0) {
      prevTile.nextTiles.push(tmpPath[0].uuid);
      tmpPath[0].previousTiles.push(prevTile.uuid);
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

    // Extend main path until it is as long as the longest branch
    //----------------------------------------------------------------//
    let tmpPath = [];
    let tmpDist = 0;

    for (let i = 0; i < branches[0]; i++) {
      tmpPath.push(new Tile(null, 'blue', startDistance + tmpDist, 0, true));
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
        // let yPos = 0;
        //
        // // Rework
        // // branch 1 => yPos 1
        // // branch 2 => yPos -1
        // // branch 3 => yPos 2
        // yPos = -1 * Math.floor(i / 2) + j;
        // // Amount of branches is even
        // if (branches.length % 2 === 0 && yPos >= 0) {
        //   yPos++;
        // }


        tmpPath.push(new Tile(null, 'yellow', xPos - 1, yPos, false));
        xPos++;
      }

      let endTile = tmpPath.find(t => {
        return t.nextTiles.length === 0
      });

      this.setPrevious(tmpPath);
      this.setNext(tmpPath);

      //First element of branch and element it connects to
      prevTile.nextTiles.push(tmpPath[0].uuid);
      tmpPath[0].previousTiles.push(prevTile.uuid);

      //Last element of branch and element it connects to
      tmpPath[tmpPath.length - 1].nextTiles.push(endTile.uuid);
      endTile.previousTiles.push(tmpPath[tmpPath.length - 1].uuid);

      this.tiles = this.tiles.concat(tmpPath);
    }
    //----------------------------------------------------------------//
  }

  // Creates the board
  createBoard() {
    this.appendPath(5);
    this.appendJunction([3,6]);
    this.appendPath(7);
    this.appendJunction([5,4,8]);
    this.appendPath(3);
  }

  // Called whenever a player changes position
  updatePlayerPosition(player, tile) {
    player.currentTile = tile;
    game.sendMessageToAll('updatePosition', player, tile);
  }

  // Move a player by amount
  movePlayer(player, amount) {
    amount > 0 ? this.movePlayerForward(amount) : this.movePlayerBack(amount);
    player.currentTile.tileUpdate();
  }

  // Move player back by an amount
  movePlayerBack(player, amount) {
    for(let i = 0; i > amount; i--) {
      if (player.currentTile.isStartTile) {
        return;
      }
      else {
        this.updatePlayerPosition(player, player.currentTile.previousTiles[0]);
      }
    }
  }

  // Move player forward by an amount
  movePlayerForward(player, amount) {
    for(let i = 0; i < amount; i++) {
      if (player.currentTile.isJunction) {
        player.sendMessage('chooseNextTile').then((response) => {
          this.updatePlayerPosition(player, response);
        });
      }
      else {
        this.updatePlayerPosition(player, player.currentTile.nextTiles[0]);
      }

      if (player.currentTile.isEndTile) {
        this.game.playerFinished(player);
      }
    }
  }

  // Move a player to the start
  jumpToStart(player) {
    this.updatePlayerPosition(player, this.tiles[0]);
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