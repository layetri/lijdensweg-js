class Player {
	constructor(connection) {
		this.connection = connection;
		currentTile;
		cards = [];
	}
	
	function giveCard(card) {
		cards.push(card);
		sendMessage(messageType.giveCard, card)
	}
	
	function useCard(card) {
		card.perform();
		sendMessage(messageType.useCard, card)
		cards.remove(card);
	}
	
	function sendMessage(messageType, data) {
		send(connection, messageType, data);
	}
}