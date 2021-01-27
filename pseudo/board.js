class Board {
	constructor(game) {
		this.game = game;
		this.tiles = [];
		this.createBoard();
		
		this.tileWidth = 10;
		this.tileHeight = 10
	}

	// Append the main path by an amount
	appendPath(nTiles) {
		let prevTile = tiles.length == 0 ? null : tiles[tiles.length];
		let startDistance = prevTile == null ? 0 : tiles[tiles.length].xDist + 1;
		
		let tmpPath = [];
		for (let i = 0; i < nTiles; i++) {
			tmpPath.push(new tile(null, null, startDistance, 0));
			startDistance++;
		}
		
		this.setPrevious(tmpPath);
		this.setNext(tmpPath);
		
		tiles[tiles.length].nextTiles.push(tmpPath[0]);
		tmpPath[0].previousTiles.push(tiles[tiles.length]);
		
		this.tiles += tmpPath;
	}
	
	// Append a junction to the main path
	appendJunction(branchLengths) {
		let prevTile = tiles.length == 0 ? null : tiles[tiles.length];
		let startDistance = prevTile == null ? 0 : tiles[tiles.length].xDist + 1;		
		
		let maxLength = 0;
		
		// Get highest branch length
		for (let i = 0; i < branchLengths.length; i++) {
			if (branchLengths[i] > maxLength) {
				maxLength = branchLengths[i];
			}
		}
		
		// Extend main path until it is as long as the longest branch
		//----------------------------------------------------------------//
		let tmpPath = [];
		let tmpDist = 0;
		
		for (let i = 0; i < nTiles; i++) {
			tmpPath.push(new tile(null, null, startDistance + tmpDist));
			tmpDist++;
		}
		
		this.setPrevious(tmpPath);
		this.setNext(tmpPath);
		
		tiles[tiles.length].nextTiles.push(tmpPath[0]);
		tmpPath[0].previousTiles.push(tiles[tiles.length]);
		
		this.tiles += tmpPath;
		//----------------------------------------------------------------//
		
		
		
		// Create branches
		//----------------------------------------------------------------//
		for (let i = 0; i < branchLengths.length; i++) {
			let tmpPath = [];
			let xPos = startDistance;
			let endTile = prevTile;
			
			for (let j = 0; j < branchLengths[i]; j++) {
				let yPos = 0;
				
				yPos = -math.floor(branchLength / 2) + j;
				// Amount of branches is even
				if (branchLengths.length % 2 == 0 && yPos >= 0) {
					yPos++;
				}
				
				tmpPath.push(new tile(null, null, xPos, yPos));
				xPos++;
				endTile = endTile.nextTiles[0];
			}
			
			this.setPrevious(tmpPath);
			this.setNext(tmpPath);
			
			//First element of branch and element it connects to
			prevTile.nextTiles.push(tmpPath[0]);
			tmpPath[0].previousTiles.push(prevTile);
			
			//Last element of branch and element it connects to
			tmpPath[tmpPath.length].nextTiles.push(endTile);
			endTile.previousTiles.push(mpPath[tmpPath.length]);
			
			this.tiles += tmpPath;
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
		let func = amount > 0 ? movePlayerForward : movePlayerBack;
		func(player, amount);
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
		for(let i = 0; i < game.rollDice(); i++) {
			if (player.currentTile.isJunction) {	
				player.sendMessage('chooseNextTile').then((response) => {
					this.updatePlayerPosition(player, response);
				});
			}
			else {
				this.updatePlayerPosition(player, player.currentTile.nextTiles[0]);
			}
			
			if (player.currentTile.isEndTile) {
				game.playerFinished(player);
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
			path[i].previousTiles.push(path[i - 1]);
		}
	}

	// Insert next direct neighbours for every tile in a path
	setNext(path) {
		for (let i = 0; i < path.length - 1; i++) {
			path[i].nextTiles.push(path[i + 1]);
		}
	}
}