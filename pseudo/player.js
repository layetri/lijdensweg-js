class Player {
	constructor(connection) {
		this.connection = connection;
		this.currentTile = null;
		this.cards = [];
		this.infection = 0;
		this.insanity = 50;
	}
	
	giveCard(card) {
		this.cards.push(card);
		this.sendMessage(messageType.giveCard, card)
	}
	
	useCard(card) {
		card.perform();
		this.sendMessage(messageType.useCard, card)
		this.cards.remove(card);
	}
	
	async sendMessage(messageType, data) {
		//this.connection.send(messageType, data);

		return 'yay';
	}
}