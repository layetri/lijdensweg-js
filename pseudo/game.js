class Card {
	perform() {
		
	}
}

class Game {
	constructor() {
		this.allPlayers = [];
		this.activePlayers = [];
	}
	
	playerJoins(player) {
		this.allPlayers.push(player);
	}
	
	playerLeaves(player) {
		this.allPlayers.remove(player);
	}
	
	startGame() {
		this.activePlayers = this.allPlayers.shuffled;
		this.sendInfoToAll();
		while(this.activePlayers.length > 0) {
			this.nextTurn();
		}
		this.endGame();
	}
	
	endGame() {
		
	}
	
	nextTurn() {
		let player = this.activePlayers.shift();
		this.activePlayers.push(player);
		let currentTile = player.currentTile;
		
		player.sendMessage(messageType.chooseCard).then((response) => {
			if (response.pickedCard) {
				player.giveCard(getRandomCard)
			}
		});

		//wait for response

		player.sendMessage(messageType.rollDice);
		//wait for response
		
		for(let i = 0; i < this.rollDice(); i++) {
			currentTile = currentTile.nextTile;
			player.movePlayer(player, currentTile);
			if (currentTile.isEndTile) {
				this.playerFinished(player);
				return;
			}
		}	
		currentTile.tileUpdate();
	}
	
	playerFinished(player) {
		this.activePlayers.remove(player);
		this.sendMessageToAll(messageType.playerFinished, player);
	}

	sendMessageToAll(messageType, data) {
		for(let i = 0; i < this.allPlayers.length; i++) {
			this.allPlayers[i].sendMessage(messageType, data);
		}	
	}	
	
	rollDice() {
		return Math.round(Math.random() * 5) + 1;
	}
}