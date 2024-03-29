import Player from './Player';

export default class LocalPlayer extends Player {
  constructor(name, id, game, connection, local) {
    super(name, id, game);
    this.connection = connection;
    this.local = local;
    this.cards = [];
    this.card = null;
    this.choice = null;

    this.vaccined = false;
    this.skipTurns = 0;
    this.infected = 0;

    this.money = 10;
    this.items = [
      {name: 'mondkapje', icon: 'mondkapje', amount: 0, price: 10, buyable: true, actions: [['current', 'infection', "-5"]]},
      {name: 'desinfectiegel', icon: 'desinfectiegel', amount: 0, price: 15, buyable: true, actions: [['current', 'infection', "-10"]]},
      {name: 'toiletpapier', icon: 'toiletpapier', amount: 0, price: 20, buyable: true, actions: [['others', 'insanity', "+5"]]},
      {name: 'treinkaartje', icon: 'treinkaartje', amount: 0, price: 50, buyable: false, actions: [['current', 'move', "+4"]]},
      {name: 'vaccin', icon: 'vaccin', amount: 0, price: 50, buyable: false, actions: [['current', 'vaccinate']]},
      //{name: '', icon: '', amount: 0, price: 10, buyable: true, actions: [['', '', 1]]},
    ];
  }

  earn(amount) {
    this.money += amount;
    this.sendMessage('modMoney', amount);
  }

  gift(amount, item) {
    this.items.find(itm => {
      return itm.name === item;
    }).amount += amount;
  }

  buy(amount, it) {
    let item = this.items.find(itm => {
      return itm.name === it;
    });

    if(this.money - (amount*item.price) >= 0) {
      this.money -= (amount*item.price);
      this.sendMessage('modMoney', -1 * amount * item.price);
      this.gift(amount, item.name);
    } else {
      this.sendMessage('insufficientFunds').then();
    }
  }

  useItem(item) {
    let itm = this.items.find(itm => {
      return itm.name === item;
    });

    if(itm.amount > 0) {
      for(let i = 0; i < itm.actions.length; i++) {
        this.handleAction(itm.actions[i]);
      }
      itm.amount--;
    }
  }

  handleAction(action) {
    if(action[1] === 'infection') {
      this.increaseInfection(Number(action[2]));
    } else if(action[1] === 'insanity') {
      this.increaseInsanity(Number(action[2]));
    } else if(action[1] === 'move') {
      this.movePlayer(Number(action[2]));
    } else if(action[1] === 'money') {
      this.earn(Number(action[2]));
    } else if(action[1] === 'item') {
      this.gift(Number(action[2]), action[3]);
    } else if(action[1] === 'buy') {
      this.buy(Number(action[2]), action[3]);
    } else if(action[1] === 'vaccinate') {
      this.vaccined = true;
    }
  }

  increaseInfection(amount = 1) {
    if(!this.vaccined) {
      if (this.infection + amount <= 100 && this.infection + amount >= 0) {
        this.infection += amount;
      } else if (this.infection + amount > 100) {
        this.infection = 100;
      } else if (this.infection + amount < 0) {
        this.infection = 0;
      }

      if(this.infection === 100) {
        this.skipTurns = 2;
        this.infected++;
        this.sendMessage('beenInfected');
      }
    }
  }

  increaseInsanity(amount = 1) {
    if(this.insanity + amount <= 50 && this.insanity + amount >= -50) {
      this.insanity += amount;
    }
  }

  async sendMessage(messageType, data) {
    //this.connection.send(messageType, data);
    /*
    Events:
    - startGame
    - chooseCard {response->type: [pickedCard, ...]}
    - rollDice
    - chooseNextTile
    - playerFinished

    - giveCard
    - useCard

    - yourTurn
    - beenInfected
    - modMoney *
    - insufficientFunds
     */
    this.local.$emit(messageType, data);

    return this.local.$on('resumeBackend', res => {
      return res;
    });
  }
}