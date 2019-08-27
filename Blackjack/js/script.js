
let blackjack = new Vue({
  el: '#blackjack',
  data: {
    starting: true,
    stay: null,
    canBet: true,
    canStay: false,
    dealerTotal: 0,
    playerTotal: 0,
    playerBet: 0,
    playerChips: 10,
    aceCount: 0,
    playerHasAce: false,
    dearlerHasAce: false,
    playerAceCount: 0,
    dealerAceCount: 0,
    tens: ['J','Q','K'],
    hearts: ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
    spades: ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
    diamonds: ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
    clubs: ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
    logs: [
    	{
    		message: 'Welcome to Blackjack, place a bet and hit start to begin. Note: Some game functions are not included in this demo.'
    	}
    ]
  },
  methods: {
  	bet: function(e) {
  		if(this.canBet) {
	  		let betValue = e.target.classList[1];
	  		if(betValue === 'bet1' && this.playerChips > 0) {
	  			this.playerBet += 1;
	  			this.playerChips -= 1;
	  		} else if (betValue === 'bet5' && this.playerChips >= 5) {
	  			this.playerBet += 5;
	  			this.playerChips -= 5;
	  		}
  		}
  	},
  	flip: function(e) {
  		let parent = e.target.parentNode;
  		if(parent.classList.contains('card--flipped')) {
  			parent.classList.remove('card--flipped');
  		} else {
	  		parent.classList.add('card--flipped');
  		}
  	},
  	start: function() {
  		if(this.starting && this.playerBet > 0) {
  			this.dealerTurn = true;
  			this.canBet = false;
  			let log = document.querySelector('.logs');
	  		let dealerVisible = document.querySelector('.dealer--show');
	  		dealerVisible.classList.add('card--flipped');
        let firstCard = this.selectCard();
	  		dealerVisible.getElementsByTagName('div')[1].setAttribute('data-value', firstCard[0]);
	  		dealerVisible.getElementsByTagName('div')[1].style.backgroundPosition = this.setBackground(firstCard[1],firstCard[2]);
        this.dealerTotal = this.calcTotal(firstCard[0]);
	  		this.starting = false;
	  		this.dealerTurn = false;
	  		this.playerTurn = true;
	  		window.setTimeout(this.playerInit.bind(this),500);
	  		this.canStay = true;
  		} else if(this.starting && this.playerBet === 0) {
  			this.createLog('You need to place a bet.');
  		} else {
  			return;
  		}
  	},
    setBackground: function(suit, card) {
      //Takes the index of the suit and the index of the card value to set background position.
      let posY = suit * -75 + 'px';
      let posX = card * -50 + 'px';
      let position = posX + ' ' + posY;
      return position;
    },
  	createLog: function(string) {
  		this.logs.push({message: string})
  		setTimeout(function() {
	  		let elem = document.querySelector('.logs');
	  		elem.scrollTop = elem.scrollHeight
  		},150)
  	},
  	calcTotal: function(item) {
  		let total = 0;
  		let value = item.toString();
		if(this.tens.includes(value) && this.playerTurn === true) {
			total = this.playerTotal + 10;
		} else if(this.tens.includes(value) && this.dealerTurn === true) {
			total = this.dealerTotal + 10;
		} else if(value === 'A' && this.playerTurn === true) {
			total = this.playerTotal + 11;
			this.playerHasAce = true;
			this.playerCards = true;
		} else if(value === 'A' && this.dealerTurn === true) {
			total = this.dealerTotal + 11;
			this.dealerHasAce = true;
		} else if(this.playerTurn) {
			value = Number(item);
			total = this.playerTotal + value;
		} else {
			value = Number(item);
			total = this.dealerTotal + value;
		}
		return total;
	},
	logicCalc: function() {
		if(this.playerTotal > 21 && this.playerHasAce === false) {
  			this.createLog('You went bust. Game will restart shortly');
  			this.playerBet = 0;
  			this.hitBtn.style.pointerEvents = 'none';
  			this.playerCanHit = false;
  			this.playerTotal = this.playerTotal + ' Game Over'
  			window.setTimeout(this.restart.bind(this),3500);
  		} else if (this.dealerTotal > 21 && this.dealerHasAce === false) {
  			this.createLog(' Dealer busted, you win. Game will restart shortly')
  			this.playerBet = 0;
  			this.playerChips = this.playerBet * 2 + this.playerChips;
  			this.dealerTotal = this.dealerTotal + ' You won'
  		} else if (this.playerTotal > 21 && this.playerHasAce) {
  			this.playerTotal -= 10;
  			this.playerHasAce = false;
  			return this.playerTotal;
  		} else if (this.dealerTotal > 21 && this.dealerHasAce) {
  			this.dealerTotal -= 10;
  			this.dealerHasAce = false;
  			return this.dealerTotal;  			
  		}		
  	},
  	playerInit: function() {
  		let playerTable = document.querySelectorAll('.card--player')
  		this.hitBtn = document.querySelector('.btn--inactive');
  		this.hitBtn.style.pointerEvents = 'auto';
  		playerTable.forEach(card => {
  			card.classList.add('card--flipped');
        let newCard = this.selectCard();
  			card.getElementsByTagName('div')[1].setAttribute('data-value', newCard[0]);
        card.getElementsByTagName('div')[1].style.backgroundPosition = this.setBackground(newCard[1], newCard[2]);
  		});
  		let myCards = [];
  	  let playerCards = document.querySelectorAll('.player--front');
  		playerCards.forEach(e => {
  			myCards.push(e.getAttribute('data-value'));
  		});
      let firstCardValue = this.calcTotal(myCards[0]);
  		let secondCardValue = this.calcTotal(myCards[1]);
  		this.playerTotal = firstCardValue + secondCardValue;
  		this.canStay = true;
  		this.playerCanHit = true;
  		this.hitBtn.style.pointerEvents = 'auto';
  		if(this.playerTotal === 21) {
  			this.createLog("You have blackjack, dealer's turn")
  			this.hitBtn.style.pointerEvents = 'none';
  			this.playerTurn = false;
  			this.playerCanHit = false;
  			this.dealerStart();
  		} else if (this.playerTotal > 21) {
  			this.playerTotal = 12;
  			this.playerCanHit = true;
  		}
  	},
  	dealerStart: function() {
  		this.dealerTurn = true;
  		let hiddenCard = document.querySelector('.dealer--hidden')
  		hiddenCard.classList.add('card--flipped');
      let newCard = this.selectCard();
  		hiddenCard.getElementsByTagName('div')[1].setAttribute('data-value', newCard[0]);
      hiddenCard.getElementsByTagName('div')[1].style.backgroundPosition = this.setBackground(newCard[1], newCard[2]);
  		let secondCardValue = hiddenCard.getElementsByTagName('div')[1].getAttribute('data-value');
  		this.dealerTotal = this.calcTotal(secondCardValue);
  		if(this.dealerTotal < 17) {
  			window.setTimeout(this.hit.bind(this),1000);
  		} else {
  			this.checkWinner();
  		}
  	},
  	selectCard: function() {
  		//returns a card index from the available deck as a string
    	let deck = [this.diamonds, this.spades, this.clubs, this.hearts];
      let suit, card, selection, placeholder;
      var checkForCard = function() {
    		suit = Math.floor(Math.random()*4);
    		card = Math.floor(Math.random()*deck[suit].length);
        selection = deck[suit][card];
        deck[suit][card] = 'empty';
        if(selection === 'empty') {
          checkForCard();
        }
      }
      checkForCard();
      return [selection, suit, card];
  	},
  	stop: function() {
  		if(this.canStay === true) {
	  		this.canStay = false;
	  		this.hitBtn.style.pointerEvents = 'none';
	  		this.dealerTurn = true;
	  		this.playerTurn = false;
	  		let hit = document.querySelector('.btn--inactive');
	  		hit.classList.add('disabled')
	  		this.dealerStart();
  		}
  	},
  	hit: function() {
  		let newCard = document.createElement('li');
  		let newCardValue = document.createElement('div');
  		let playerTable = document.querySelector('.player');
  		let dealerTable = document.querySelector('.dealer');

  		if(this.playerTurn && this.playerCanHit === true) {
  			newCardValue.classList.add('card', 'player--front');
  			newCard.classList.add('card--player', 'card--flipped', 'card--flipper');
        let newCards = this.selectCard();
  			newCardValue.setAttribute('data-value', newCards[0]);

  			newCard.appendChild(newCardValue);
        newCard.getElementsByTagName('div')[0].style.backgroundPosition = this.setBackground(newCards[1], newCards[2]);
        playerTable.appendChild(newCard);
  			this.playerTotal = this.calcTotal(newCardValue.getAttribute('data-value'));
  			this.logicCalc();
  			if(this.playerTotal === 21) {
  				this.createLog("You have 21, dealer's turn");
  				this.dealerTurn = true;
  				this.playerTurn = false;
  				this.dealerStart();
  			}
  		} else {
  			newCardValue.classList.add('card', 'dealer--front');
  			newCard.classList.add('card--dealer', 'card--flipper');
        let newCards = this.selectCard();
  			newCardValue.setAttribute('data-value', newCards[0]);
  			newCard.appendChild(newCardValue);
        newCard.getElementsByTagName('div')[0].style.backgroundPosition = this.setBackground(newCards[1], newCards[2]);
  			dealerTable.appendChild(newCard);
  			newCard.classList.add('card--flipped');
  			this.dealerTotal = this.calcTotal(newCardValue.getAttribute('data-value'));
  			if(this.dealerTotal < 17) {
  				window.setTimeout(this.hit.bind(this),1000);
  			} else if(this.dealerTotal > 21) {
  				this.checkWinner();
  			} else {
  				this.checkWinner();
  			}
  		}
  	},
  	checkWinner: function() {
  		if(this.dealerTotal > this.playerTotal && this.dealerTotal < 22) {
  			this.createLog('Dealer wins!');
  			this.playerBet = 0;
  			window.setTimeout(this.restart.bind(this),3500);
  		} else if (this.dealerTotal < this.playerTotal) {
  			this.createLog('You won! Game will restart shortly');
  			this.playerChips = this.playerBet * 2 + this.playerChips
  			this.playerBet = 0;
  			window.setTimeout(this.restart.bind(this),3500);
  		} else if (this.dealerTotal === this.playerTotal) {
  			this.createLog('You tied with the dealer. Game will restart shortly');
  			this.playerChips = this.playerChips + this.playerBet;
  			this.playerBet = 0;
  			window.setTimeout(this.restart.bind(this),3500);
  		} else if (this.dealerTotal > this.playerTotal && this.dealerTotal > 21) {
  			this.createLog('Dealer busted, you win! Game will restart shortly');
  			this.playerChips = this.playerBet * 2 + this.playerChips;
  			this.playerBet = 0;
  			window.setTimeout(this.restart.bind(this),3500);
  		}
  	},
  	restart: function() {
  		let visibleCards = document.querySelectorAll('.player--front, .dealer--front');
  		let playerCards = document.querySelectorAll('.card--player');
  		let dealerCards = document.querySelectorAll('.card--dealer');
  		this.hitBtn.style.pointerEvents = 'none';
  		visibleCards.forEach(e => {
  			e.innerHTML = '';
  		});
  		playerCards.forEach(e => {
  			e.classList.remove('card--flipped');
  		});
  		dealerCards.forEach(e => {
  			e.classList.remove('card--flipped');
  		});
  		for(let i=2;i<playerCards.length;i++) {
  			playerCards[i].remove();
  		}
  		for(let i=2;i<(dealerCards.length);i++) {
  			dealerCards[i].remove();
  		}
  		if(this.playerBet === 0 && this.playerChips === 0) {
  			this.createLog('You ran out of chips, starting over.');
  			this.playerChips = 10;
  		}
  		this.starting = true;
  		this.dealerTotal = 0;
  		this.playerTotal = 0;
  		this.canBet = true;
	    this.diamonds = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
	    this.spades = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
	    this.clubs = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
	    this.hearts = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
  	}

  }
});