export default class Player {
  constructor(name, id, game) {
    this.name = name;
    this.id = id;
    this.play_order = null;
    this.currentTile = null;
    this.infection = 0;
    this.insanity = 0;
    this.color = null;

    this.game = game;
  }

  // Called whenever a player changes position
  updatePlayerPosition(tile) {
    this.currentTile = tile;
    this.game.sendMessageToAll('updatePosition', {player: this.id, tile: tile.uuid});
  }

  // Move a player by amount
  movePlayer(amount) {
    amount > 0 ? this.movePlayerForward(amount) : this.movePlayerBack(amount);
    this.currentTile.tileUpdate();
  }

  // Move player back by an amount
  movePlayerBack(amount) {
    for(let i = 0; i > amount; i--) {
      if (this.currentTile.isStartTile()) {
        return;
      }
      else {
        this.updatePlayerPosition(this.currentTile.previousTiles[0]);
      }
    }
  }

  // Move player forward by an amount
  movePlayerForward(amount) {
    for(let i = 0; i < amount; i++) {
      if (this.currentTile.isJunction) {
        this.sendMessage('chooseNextTile').then((response) => {
          this.updatePlayerPosition(response);
        });
      }
      else {
        this.updatePlayerPosition(this.currentTile.nextTiles[0]);
      }

      if (this.currentTile.isEndTile) {
        this.game.playerFinished(player);
      }
    }
  }

  // Move a player to the start
  jumpToStart() {
    this.updatePlayerPosition(this.game.board.tiles[0]);
  }

  giveCard(card) {
    this.cards.push(card);
    this.sendMessage('giveCard', card).then();
  }

  useCard(card) {
    card.perform();
    this.sendMessage('useCard', card).then();
    this.cards.remove(card);
  }
}