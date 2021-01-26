class Card {
	perform() {
		
	}
}

class Game {
	constructor() {
		this.allPlayers = [];
		this.activePlayers = [];
		this.board;
		this.hasStarted = false;
		this.maxPlayers = 4;
	}
	
	canJoin() {
		return !hasStarted && allPlayers.length < maxPlayers;
	}
	
	playerJoins(player) {
		if (canJoin) {
			//accept
			this.allPlayers.push(player);
		}
	}
	
	playerLeaves(player) {
		this.allPlayers.remove(player);
		this.activePlayers.remove(player);
	}
	
	startGame() {
		this.activePlayers = this.allPlayers.shuffled;
		this.board = new Board(50);
		
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

		player.sendMessage("rollDice");
		//wait for response
		
		board.movePlayer(player, this.rollDice());
	}
	
	playerFinished(player) {
		this.activePlayers.remove(player);
		this.sendMessageToAll('playerFinished', player);
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