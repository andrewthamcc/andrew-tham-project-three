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
    possibleNames: ['General Harry Hearts', 'Colonel Amy Aces', 'Admiral Denise Diamonds', 'Major Steven Spades']
  }
};

// init function for war app
warApp.init = () => {
  warApp.windowScroll();
  warApp.playerName();
  warApp.computerName();
  warApp.toggleRules();
  warApp.buildDeck();
  warApp.playCard();
  warApp.ceasefire();
  warApp.playAgain();
}

// prevents the user from scrolling until their name is filled out
warApp.windowScroll = () => {
  
  // prevents user from scrolling until their name is filled out
  // if (warApp.player.name) {
  //   $('body').css('overflow', 'auto');
  // } else {
  //   $('body').css('overflow', 'hidden');
  // }
}

// gets player name from input field
warApp.playerName = () => {
  $('#header-about-form').on('submit', function(e){
    warApp.player.name = $('#header-about-form-input-name').val()
    $('#instructions-player-name').html(warApp.player.name);
    $('#play-player-name').html(warApp.player.name);

    warApp.windowScroll();

    // const re = /^[a-z ,.'-]+$/i;
    // if (!re.test(name)){
    //   warApp.player.name = $('#header-about-form-input-name').val()
    //   console.log('valid');  
    // } else {
    //   console.log('invalid');
    //   // $('#header-about-form-input-name').val('')
    // }

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
  warApp.playerScoreString = warApp.player.score.toString().padStart(6, '0');

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

  // put the cards into the ui
  $('.computer-card').html(`<img src=${computerBattleImage}>`);
  $('.player-card').html(`<img src=${playerBattleImage}>`);

  $('.card-flip-reverse').toggleClass('rotate');
  $('.card-flip-forward').toggleClass('rotate');

  // time out to return the cards to normal position
  setTimeout(() => {
    $('.card-flip-reverse').removeClass('rotate');
    $('.card-flip-forward').removeClass('rotate');
  }, 2000)

  // count the cards
  warApp.cardCount();

  // determines if the player wins or loses or war is to be declared
  if (playerBattleValue > computerBattleValue) {
    // show the ui message
    setTimeout(() => {
      $('.play-battle-message-text').html('WIN').fadeIn();
      
      setTimeout(() => {
        $('.play-battle-message-text').fadeOut()
        // enables buttons for play again
        $('#play-player-area-controls-buttons-battle').removeAttr('disabled');
        $('#play-player-area-controls-buttons-ceasefire').removeAttr('disabled');
      }, 1000);
    }, 1500);

    // enables buttons for play again
    $('#play-player-area-controls-buttons-battle').removeAttr('disabled');
    $('#play-player-area-controls-buttons-ceasefire').removeAttr('disabled');

    // removes camo background if war was declared 
    $('.play').css('background', ``);

    // adds the cards to the players pile and updates the count
    warApp.playerCardPile = warApp.playerCardPile.concat([playerBattleCard, computerBattleCard]);
    
    // adds to the player's score based on the card values*5 the player collects
    warApp.player.score += (computerBattleValue * 5);

    // updates the UI score
    warApp.playerScore()

    // count the cards
    warApp.cardCount();

    // adds the war cards to the players pile and clears the war card pile array
    if (warApp.warCardPile.length > 0) {
      warApp.playerCardPile = warApp.playerCardPile.concat(warApp.warCardPile);
      warApp.warCardPile = [];

      // adds a score when the player wins a round of war
      warApp.player.score =+ 1500;

      // updates the UI score
      warApp.playerScore()

      // count the cards
      warApp.cardCount();
    }
  } else if (playerBattleValue < computerBattleValue) {
    // show the ui message
    setTimeout(() => {
      $('.play-battle-message-text').html('LOSE').fadeIn();

      setTimeout(() => { 
        $('.play-battle-message-text').fadeOut() 
        // enables buttons for play again
        $('#play-player-area-controls-buttons-battle').removeAttr('disabled');
        $('#play-player-area-controls-buttons-ceasefire').removeAttr('disabled');
      }, 1000);
    }, 1500);

    // removes camo background if war was declared 
    $('.play').css('background', ``);

    // adds the cards to the computers pile and updates the count
    warApp.computerCardPile = warApp.computerCardPile.concat([playerBattleCard, computerBattleCard])
    warApp.cardCount();

    if (warApp.warCardPile.length > 0) {
      warApp.computerCardPile = warApp.computerCardPile.concat(warApp.warCardPile);
      warApp.warCardPile = [];

      // count the cards
      warApp.cardCount();
    }
  
  } else if (playerBattleValue === computerBattleValue) {
    // change the background of the playing field
    setTimeout(() =>{
      $('.play').css('background', `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url('../assets/camo.jpg')`);
    }, 2800);

    // show the ui message
    setTimeout(() => {
      $('.play-battle-message-text').html('WAR').fadeIn();

      setTimeout(() => {
        $('.play-battle-message-text').fadeOut()
        // enables buttons for play again
        $('#play-player-area-controls-buttons-battle').removeAttr('disabled');
        $('#play-player-area-controls-buttons-ceasefire').removeAttr('disabled');
      }, 1000);
    }, 1500);

    // pushes the current cards to the empty war array
    warApp.warCardPile.push(playerBattleCard);
    warApp.warCardPile.push(computerBattleCard);

    // splices off two cards off of each player and computer pile
    const playerRemoved = warApp.playerCardPile.splice(0, 2),
          computerRemoved = warApp.computerCardPile.splice(0, 2);

    // pushes the extra cards from either player/computer onto a war pile that either will win
    warApp.warCardPile = warApp.warCardPile.concat(playerRemoved, computerRemoved);
  };
};

// determine if the player or computer has won
warApp.determineWin = () => {
  if (warApp.playerCardCount >= 36) {
    warApp.gameMessage = `General, you have defeated the enemy forces. This is the best thing in life. To be able to crush your enemies, see them driven before you, and to hear the lamentation of the weak! We will rule the enemy nation with an iron fist and wipe out all others that oppose us.`

    warApp.gameModal(`VICTORY!`)

  } else if (warApp.playerCardCount <= 16) {
    warApp.gameMessage = `General, our forces have been depleted and you have lost many lives. You futile attempts to win have caused much suffering and grief. As a result of your failure, the highest powers have deemed that you are now demoted to the rank of Private.`

    warApp.gameModal(`DEFEAT!`)
  };
};

// modal appears when game ends
warApp.gameModal = (title) => {
  $('.play-modal').fadeIn();

  // disables buttons so user can't play game
  $('#play-player-area-controls-buttons-battle').attr('disabled', true);
  $('#play-player-area-controls-buttons-ceasefire').attr('disabled', true);
  
  // displays the appropriate message and title
  $('#play-modal-title').html(title);
  $('#play-modal-message').html(warApp.gameMessage);
  $('#play-modal-score').html(warApp.playerScoreString);

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

    // disables buttons so user can't spam buttons
    $('#play-player-area-controls-buttons-battle').attr('disabled', true);
    $('#play-player-area-controls-buttons-ceasefire').attr('disabled', true);

    e.preventDefault();
  });
};

// calls for ceasefire
warApp.ceasefire = () => {
  $('#play-player-area-controls-buttons-ceasefire').on('click', function (e) {
    
    warApp.gameMessage = `General, you've called a ceasefire and made peace. Our two nations will work together to rebuild and attempt to prevent the atrocitiy of war from happening again. Your brilliant negotation and steadfast resolution to peace will usher forth an englightment in the world.  As you know, there are truly no winners of war.`
    
    warApp.gameModal('CEASEFIRE');

    e.preventDefault();
  });
};

// document ready
$(function () {
  warApp.init();
});