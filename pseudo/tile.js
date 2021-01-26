class Tile {
	constructor(specialFunction) {
		this.nextTiles = [];
		this.previousTiles = [];
		this.players = [];
		this.specialFunction = specialFunction;
	}
	
	boolean isEndTile() {
		return nextTiles.length < 1;
	}
	
	function tileUpdate() {
		infectionFunction();
		insanityFunction();
		if (specialFunction != null) specialFunction;
	}
	
	function infectionFunction() {
		if (players.length > 1) {
			for (int i = 0; i < players.length; i++) {
				players[i].infection++;
			}
		}
	}
	
	function insanityFunction() {
		if (players.length > 1) {
			for (int i = 0; i < players.length; i++) {
				players[i].insanity++;
			}
		}
	}
}