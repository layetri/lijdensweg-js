class Board {
	constructor(game, nTiles) {
		this.game = game;
		this.tiles = [];
		createBoard(nTiles);
	}
	
	createBoard(nTiles) {
		//Create tiles
		for (let i = 0; i <  nTiles; i++) {
			tiles.push(new Tile(null));
		}
		setPrevious();
		setNext();	
		
		for (let i = 0; i < game.players.length; i++) {
			jumpToStart(game.players[i]);
		}
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
	
	setPrevious() {
		for (let i = 1; i < tiles.length; i++) {
			tiles[i].previousTiles.push(tiles[i - 1]);
		}
	}
	
	setNext() {
		for (let i = 0; i < tiles.length - 1; i++) {
			tiles[i].nextTiles.push(tiles[i + 1]);
		}
	}
}