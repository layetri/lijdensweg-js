class Card {
	function perform() {
		
	}
}

class Game {
	constructor() {
		this.allPlayers = [];
		this.activePlayers = [];
	}
	
	function playerJoins(player) {
		allPlayers.push(player);
	}
	
	function playerLeaves(player) {
		allPlayers.remove(player);
	}
	
	function startGame() {
		activePlayers = allPlayers.shuffled;
		sendInfoToAll();
		while(activePlayers.length > 0) {
			nextTurn();
		}
		endGame();
	}
	
	function endGame() {
		
	}
	
	function nextTurn() {
		var player = activePlayers.shift();
		activePlayers.push(player);
		var currentTile = player.currentTile;
		
		player.sendMessage(messageType.chooseCard);
		//wait for response
		
		if (response.pickedCard) {
			player.giveCard(getRandomCard)
		}
		
		player.sendMessage(messageType.rollDice);
		//wait for response
		
		for (int i = 0; i < rollDice(); i++) {
			currentTile = currentTile.nextTile;
			movePlayer(player, currentTile);
			if (currentTile.isEndTile) {
				playerFinished(player);
				return;
			}
		}	
		currentTile.tileUpdate();
	}
	
	function playerFinished(player) {
		activePlayers.remove(player);
		sendMessageToAll(messageType.playerFinished, player);
	}

	function sendMessageToAll(messageType, data) {
		for (int i = 0; i < allPlayers.length; i++) {
			allPlayers[i].sendMessage(messageType, data);
		}	
	}	
	
	function rollDice() {
		return random(1,6);
	}
}