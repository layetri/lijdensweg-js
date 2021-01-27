class Board {
	constructor(game) {
		this.game = game;
		this.tiles = [];
		this.createBoard();
		
		this.tileWidth = 10;
		this.tileHeight = 10;
		this.totalTiles = 0;
	}

	// Create a single branch and link it to its parent
	createPath(nTiles, prevTile, nextTile) {
		let path = [];
		// Fill the path array
		for (let i = 0; i <  nTiles; i++) {
			path.push(new Tile(null));
		}
		// Set the direct previous neighbour
		this.setPrevious(path);
		// Set the direct next neighbour
		this.setNext(path);
		// Find and set any indirect previous neighbours
		if(typeof prevTile !== "undefined") {
			if (prevTile != null) {
				prevTile.nextTiles.push(path[0]);
				path[0].previousTiles.push(prevTile);
			}
		}
		// Find and set any indirect next neighbours
		if(typeof nextTile !== "undefined") {
			if (nextTile != null) {
				nextTile.previousTiles.push(path[path.length]);
				path[path.length].nextTiles.push(nextTile);
			}
			
		}
		return path;
	}

	// Append a number of tiles in a straight line
	appendPath(nTiles) {
		//let path;
		if (this.tiles.length === 0) {
			this.tiles = this.createPath(nTiles);
		}
		else {
			//Add path to tiles
			this.tiles += this.createPath(nTiles, this.tiles[this.tiles.length]);
		}	
	}

	// Prepend a number of tiles in a straight line
	prependPath(nTiles) {
		if (this.tiles.length === 0) {
			this.tiles = this.createPath(nTiles);
		}
		else {
			this.tiles.splice(0, 0, this.createPath(nTiles, null, this.tiles[0]));
			//tiles.push(...createPath(nTiles, null, tiles[0]));
		}
	}
	
	// Append a junction
	// example: [3, 6] would give
	// *
	// |\  \
	// | | |
	// |/  |
	// *  /
	// | /  
	// |/
	// *
	
	createJunction(branchLengths) {
		// Get first tile
		let junctionTile = tiles[tiles.length]
		let maxLength = 0;
		// Get highest path length
		for(let i = 0; i < branchLengths.length; i++) {
			if (branchLengths[i] > maxLength) {
				maxLength = branchLengths[i];
			}
		}
		// Append main path till the end of the longest branch
		this.appendPath(maxLength);
		
		// 
		for (let i = 0; i < branchLengths.length; i++) {
			let tmpTile = junctionTile;
			for (let j = 0; j < branchLengths[i]; j++) {
				tmpTile = tmpTile.nextTiles[0];
			}
			this.tiles += this.createPath(nTiles, junctionTile, tmpTile);
		}
	}

	// Create a board for n amount of tiles
	createBoard() {
		this.appendPath(5);
		this.createJunction([3,6]);
		this.appendPath(7);
		this.createJunction([5,4,8]);
		this.appendPath(3);
	}
	
	updatePlayerPosition(player, tile) {
		player.currentTile = tile;
		game.sendMessageToAll('updatePosition', player, tile);
	}
	
	movePlayer(player, amount) {
		let func = amount > 0 ? movePlayerForward : movePlayerBack;
		func(player, amount);
		player.currentTile.tileUpdate();
	}
	
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