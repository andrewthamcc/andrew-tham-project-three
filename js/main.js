// instantiate war app object
const warApp = {
  deck: [],
  deckSuits: ['SPADES', 'DIAMONDS', 'CLUBS', 'HEARTS'],
  deckValues: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],

  // instantiate an empty array for when war is declared
  warCardPile: [],

  // player information
  player: {
    name: '',
    score: 0
  },

  computer: {
    // an array of possible computer names that the player will face at random
    possibleNames: ['General Harry Hearts', 'Colonel Amy Aces', 'Admiral Denise Diamonds', 'Sergeant Spike Spades']
  }
};

// init function for war app
warApp.init = () => {
  warApp.playerName();
  warApp.computerName();
  warApp.toggleRules();
  warApp.buildDeck();
  warApp.playCard();
  warApp.ceasefire();
  warApp.playerScore();
  warApp.playAgain();
}

// gets player name from input field
warApp.playerName = () => {
  $('#header-about-form').on('submit', function(e){
    warApp.player.name = $('#header-about-form-input-name').val()

    // update UI with player name
    $('#instructions-player-name').html(warApp.player.name);
    $('#play-player-name').html(warApp.player.name);
    e.preventDefault();
  });
};

// gets random computer name
warApp.computerName = () => {
  warApp.computer.name = warApp.computer.possibleNames[Math.floor(Math.random() * warApp.computer.possibleNames.length)];

  // update UI with computer name
  $('#instructions-computer-name').html(warApp.computer.name);
  $('#play-computer-name').html(warApp.computer.name);
};

// toggles the rules and button text
warApp.toggleRules = () => {
  $('#instructions-button').on('click', function(e){
    
    $('.instructions-text-fun').toggleClass('instructions-hide');
    $('.instructions-text-plain').toggleClass('instructions-show');

    $(this).text(function (index, current) {
      return (current === 'Read Standard Rules') ? 'Read Fun Rules' : 'Read Standard Rules';
    })

  });
};

// https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
// build the deck from the cards in order by looping through each array and matchig up items
warApp.buildDeck = () => {
  warApp.deckSuits.forEach((suit) => {
    warApp.deckValues.forEach((value) =>{
      // each card is an object with an associated suit and value
      card =  {
        suit: suit,
        value: value,
        image: `./assets/cards/${suit}${value}.png`
      };
      
      // push the card object onto the deck thereby creating a suited deck
      warApp.deck.push(card);
    });
  });

  warApp.shuffleDeck();
};

// function that randomizes the deck by changing location of array items
warApp.shuffleDeck = () => {
  // I know this can be done in a for loop but we were told there were few aspects to use a while loop.  This is a practical example of when one can be used.
  let shuffleCount = 0;
  while(shuffleCount < 500) {
    // gets two random cards from the deck
    let locationOne = Math.floor(Math.random() * warApp.deck.length),
        locationTwo = Math.floor(Math.random() * warApp.deck.length),
        tempLocation = warApp.deck[locationOne];  
    
    // switch the locations of cards in the deck
    warApp.deck[locationOne] = warApp.deck[locationTwo];
    warApp.deck[locationTwo] = tempLocation;

    shuffleCount++;
  };

  warApp.dealCards();
};

// deal the cards by splicing the now shuffled deck array into two arrays
warApp.dealCards = () => {
  warApp.playerCardPile = warApp.deck.splice(0, 26)
  warApp.computerCardPile = warApp.deck;

  // count the cards
  warApp.cardCount();
};

// updates UI for card count
warApp.cardCount = () => {
  // count the number of cards for both players
  warApp.playerCardCount = warApp.playerCardPile.length;
  warApp.computerCardCount = warApp.computerCardPile.length;

  $('#play-player-area-info-count').html(warApp.playerCardCount);
  $('#play-computer-area-info-count').html(warApp.computerCardCount);

  // determines if the player has won or lost
  warApp.determineWin();
};

warApp.playerScore = () => {
  //convert player score to string to add leading zeros
  warApp.playerScoreString = warApp.player.score.toString().padStart(7, '0');

  // update the UI
  $('#play-player-area-info-score').html(warApp.playerScoreString)
};


// battle function when playing cards
warApp.battle = () => {
  // play a user card
  const playerBattleCard = warApp.playerCardPile.shift(),
        computerBattleCard = warApp.computerCardPile.shift();

  // get the values of each card
  const playerBattleValue = playerBattleCard.value,
        computerBattleValue = computerBattleCard.value;

  // get the images of each card
  const playerBattleImage = playerBattleCard.image,
        computerBattleImage = computerBattleCard.image;

  console.log(`Player draws:`, playerBattleValue); 
  console.log(`Computer draws:`, computerBattleValue);

  // count the cards
  warApp.cardCount();

  // determines if the player wins or loses or war is to be declared
  if (playerBattleValue > computerBattleValue) {
    console.log('win');

    // adds the cards to the players pile and updates the count
    warApp.playerCardPile = warApp.playerCardPile.concat([playerBattleCard, computerBattleCard]);
    
    // adds to the player's score based on the card values*5 the player collects
    warApp.player.score += (computerBattleValue * 5);

    // updates the UI score
    warApp.playerScore()

    console.log(`Player has ${warApp.playerCardPile.length} cards.  Player score: ${warApp.player.score}`)

    // count the cards
    warApp.cardCount();

    // adds the war cards to the players pile and clears the war card pile array
    if (warApp.warCardPile.length > 0) {
      warApp.playerCardPile = warApp.playerCardPile.concat(warApp.warCardPile);
      warApp.warCardPile = [];

      // adds a score when the player wins a round of war
      warApp.player.score =+ 1000;

      // updates the UI score
      warApp.playerScore()

      // count the cards
      warApp.cardCount();
    }
  } else if (playerBattleValue < computerBattleValue) {
    console.log('lose');

    // adds the cards to the computers pile and updates the count
    warApp.computerCardPile = warApp.computerCardPile.concat([playerBattleCard, computerBattleCard])
    warApp.cardCount();

    if (warApp.warCardPile.length > 0) {
      warApp.computerCardPile = warApp.computerCardPile.concat(warApp.warCardPile);
      warApp.warCardPile = [];

      // count the cards
      warApp.cardCount();
    }

    console.log(`Player has ${warApp.playerCardPile.length} cards`)
  
  } else if (playerBattleValue === computerBattleValue) {
    console.log('WAR!!!');

    // pushes the current cards to the empty war array
    warApp.warCardPile.push(playerBattleCard);
    warApp.warCardPile.push(computerBattleCard);

    // splices off three cards off of each player and computer pile
    const playerRemoved = warApp.playerCardPile.splice(0, 3),
          computerRemoved = warApp.computerCardPile.splice(0, 3);

    // count the cards
    warApp.cardCount();

    // pushes the extra cards from either player/computer onto a war pile that either will win
    warApp.warCardPile = warApp.warCardPile.concat(playerRemoved, computerRemoved);

    // goes to battle again
    warApp.battle();
  };
};

// determine if the player or computer has won
warApp.determineWin = () => {
  if (warApp.playerCardCount >= 36) {
    console.log('YOU ARE VICTORIOUS');
  } else if (warApp.playerCardCount <= 16) {
    console.log('Our forces have been depleted. They have won the war...');
  };
};

// modal appears when game ends
warApp.gameModal = (title, message) => {
  $('.play-modal').fadeIn();

  // disables buttons so user can't play game
  $('#play-player-area-controls-buttons-battle').attr('disabled', true);
  $('#play-player-area-controls-buttons-ceasefire').attr('disabled', true);

  $('#play-modal-title').html(title);
  $('#play-modal-message').html(message);

};

warApp.playAgain = () => {
  $('#play-modal-button').on('click', function(){
    window.location.reload(true);
  });
}

// calls the battle function when the user plays a card
warApp.playCard = () => {
  $('#play-player-area-controls-buttons-battle').on('click', function (e) {
    warApp.battle();

    e.preventDefault();
  });
};

// calls for ceasefire
warApp.ceasefire = () => {
  $('#play-player-area-controls-buttons-ceasefire').on('click', function (e) {
    
    warApp.gameMessage = `General, you've called a ceasefire and made peace with the enemy.  Our two nations will work together to rebuild and attempt to prevent the atrocitiy of war from happening again. Your brilliant negotation and steadfast resolution to peace will usher forth an englightment in the world.`
    
    warApp.gameModal('CEASEFIRE', warApp.gameMessage);
    console.log(true);

    e.preventDefault();
  });
};

// document ready
$(function () {
  warApp.init();
});