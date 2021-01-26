class Board {
	constructor(game, boardLength) {
		this.game = game;
		this.tiles = [];
		createBoard(boardLength);
	}
	
	createPath(nTiles, prevTile, nextTile) {
		let path = [];
		for (let i = 0; i <  nTiles; i++) {
			path.push(new Tile(null));
		}
		setPrevious(path);
		setNext(path);
		if(typeof prevTile !== "undefined") {
			if (prevTile != null) {
				prevTile.nextTiles.push(path[0]);
				path[0].previousTiles.push(prevTile);
			}
		}
		if(typeof nextTile !== "undefined") {
			if (nextTile != null) {
				nextTile.previousTiles.push(path[path.length]);
				path[path.length].nextTiles.push(nextTile);
			}
			
		}
		return path;
	}
	
	appendPath(nTiles) {
		//let path;
		if (tiles.length == 0) {
			//path = createPath(nTiles);
			tiles = createPath(nTiles);
		}
		else {
			//path = createPath(nTiles, path[path.length]);
			//let origPathLength = path.length;
			//Add path to tiles
			tiles.push(...createPath(nTiles, tiles[tiles.length]));
			//tiles[origPathLength].nextTiles.push(tiles[origPathLength + 1]);
			//tiles[origPathLength + 1].previousTiles.push(tiles[origPathLength]);
		}	
	}
	
	prependPath(nTiles) {
		if (tiles.length == 0) {
			tiles = createPath(nTiles);
		}
		else {
			tiles.push(...createPath(nTiles, null, tiles[0]));
		}
	}
	
	createBoard(nTiles) {
		appendPath(20);
		
		
		//Create tiles
		/*for (let i = 0; i <  nTiles; i++) {
			tiles.push(new Tile(null));
		}*/
		/*
		setPrevious();
		setNext();	
		
		for (let i = 0; i < game.players.length; i++) {
			jumpToStart(game.players[i]);
		}*/
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
				
			}
		}
	}
	
	movePlayerForward(player, amount) {
		for(let i = 0; i < game.rollDice(); i++) {
			if (player.currentTile.isJunction) {	
				player.sendMessage('chooseNextTile').then((response) => {
					updatePlayerPosition(player, response);
				}
			}
			else {
				updatePlayerPosition(player, player.currentTile.nextTiles[0]);
			}
			
			if (player.currentTile.isEndTile) {
				game.playerFinished(player);
			}
		}	
	}
	
	jumpToStart(player) {
		updatePlayerPosition(player, tiles[0]);
	}
	
	setPrevious(path) {
		for (let i = 1; i < path.length; i++) {
			path[i].previousTiles.push(path[i - 1]);
		}
	}
	
	setNext(path) {
		for (let i = 0; i < path.length - 1; i++) {
			path[i].nextTiles.push(path[i + 1]);
		}
	}
}