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
    score: 0,
  },

  computer: {
    // an array of possible computer names that the player will face at random
    possibleNames: ['General Harry Hearts', 'Colonel Amy Aces', 'Admiral Denise Diamonds', 'Major Steven Spades'],
    possiblePhrases: ['']
  }
};

// init function for war app
warApp.init = () => {
  // cache of jquery selectors
  warApp.battleButton = $('.play-player-area-controls-buttons-battle');
  warApp.ceasefireButton = $('.play-player-area-controls-buttons-ceasefire');
  
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
  // if the user refreshes the page mid game it does not lock the user to the screen
  // if (window.pageYOffset === 0) {
  //   $('body').css('overflow', 'hidden');
  // }
}

// gets player name from input field
warApp.playerName = () => {
  $('#header-about-form').on('submit', function(e){
    warApp.player.name = $('#header-about-form-input-name').val()

    // RegEx for validating name entry
    const re = /^[a-z .-]+$/i;    
    
    if (re.test(warApp.player.name)){
      // update the UI
      $('#instructions-player-name').html(warApp.player.name);
      $('#play-player-name').html(warApp.player.name);

      // enable scroll and show skip arrow
      $('body').css('overflow', 'auto');
      $('.header-skip-arrow').fadeIn();
    } else {
      // clear the input field
      $('#header-about-form-input-name').val()

      // display modal message
      $('.header-modal').fadeIn();

      // click to close
      $('.header-modal-button').on('click', function(){
        $('.header-modal').fadeOut()
      });
    }

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
  $('.instructions-button').on('click', function(e){
    
    $('.instructions-text-fun').toggleClass('instructions-hide');
    $('.instructions-text-plain').toggleClass('instructions-show');

    $(this).text(function (index, current) {
      return (current === 'Standard Rules') ? 'Fun Rules' : 'Standard Rules';
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

  $('.card-flip-reverse').addClass('rotate');
  $('.card-flip-forward').addClass('rotate');

  // time out to return the cards to normal position
  setTimeout(() => {
    $('.card-flip-reverse').removeClass('rotate');
    $('.card-flip-forward').removeClass('rotate');
  }, 2000)

  // determines if the player wins or loses or war is to be declared
  if (playerBattleValue > computerBattleValue) {
    // show the ui message
    setTimeout(() => {
      $('.play-battle-message-text').html('WIN').fadeIn();
      
      setTimeout(() => {
        $('.play-battle-message-text').fadeOut()
        // enables buttons for play again
        warApp.battleButton.removeAttr('disabled').removeClass('disabled');
        warApp.ceasefireButton.removeAttr('disabled').removeClass('disabled');
      }, 1000);
    }, 1500);

    // count the cards
    warApp.cardCount();

    // adds the cards to the players pile and updates the count
    warApp.playerCardPile = warApp.playerCardPile.concat([playerBattleCard, computerBattleCard]);
    
    // adds to the player's score based on the card values*5 the player collects
    warApp.player.score += (computerBattleValue * 5);

    // updates the UI score
    warApp.playerScore()

    // adds cards to the pile if war was declared and won
    if (warApp.warCardPile.length > 0) {
      warApp.playerCardPile = warApp.playerCardPile.concat(warApp.warCardPile);
      warApp.warCardPile = [];

      // adds a score when the player wins a round of war
      warApp.player.score =+ 1500;

      // updates the UI score
      warApp.playerScore()

      // count the cards
      warApp.cardCount();

      // removes camo background if war was declared 
      $('.play').css('background', ``);
    }
  } else if (playerBattleValue < computerBattleValue) {
    // show the ui message
    setTimeout(() => {
      $('.play-battle-message-text').html('LOSE').fadeIn();

      setTimeout(() => { 
        $('.play-battle-message-text').fadeOut() 
        // enables buttons for play again
        warApp.battleButton.removeAttr('disabled').removeClass('disabled');
        warApp.ceasefireButton.removeAttr('disabled').removeClass('disabled');
      }, 1000);
    }, 1500);

    // adds the cards to the computers pile and updates the count
    warApp.computerCardPile = warApp.computerCardPile.concat([playerBattleCard, computerBattleCard])
    warApp.cardCount();

    // adds cards to the pile if war was declared and won
    if (warApp.warCardPile.length > 0) {
      warApp.computerCardPile = warApp.computerCardPile.concat(warApp.warCardPile);
      warApp.warCardPile = [];

      // count the cards
      warApp.cardCount();

      // removes camo background if war was declared 
      $('.play').css('background', ``);
    }
  
  } else if (playerBattleValue === computerBattleValue) {
    // change the background of the playing field
    setTimeout(() =>{
      $('.play').css('background', `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('./assets/camo.jpg')`);
    }, 2800);

    // show the ui message
    setTimeout(() => {
      $('.play-battle-message-text').html('WAR').fadeIn();

      setTimeout(() => {
        $('.play-battle-message-text').fadeOut()
        // enables buttons for play again
        warApp.battleButton.removeAttr('disabled').removeClass('disabled');
        warApp.ceasefireButton.removeAttr('disabled').removeClass('disabled');
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

  // disables buttons and greys them out so user can't play game
  warApp.battleButton.attr('disabled', true).addClass('disabled');
  warApp.ceasefireButton.attr('disabled', true).addClass('disabled');

  // displays the appropriate message and title
  $('#play-modal-title').html(title);
  $('#play-modal-message').html(warApp.gameMessage);
  $('#play-modal-score').html(warApp.playerScoreString);

};

warApp.playAgain = () => {
  $('.play-modal-button').on('click', function(){
    window.location.reload(true);
  });
}

// calls the battle function when the user plays a card
warApp.playCard = () => {
  warApp.battleButton.on('click', function (e) {    
    warApp.battle();

    warApp.battleButton.attr('disabled', true).addClass('disabled');
    warApp.ceasefireButton.attr('disabled', true).addClass('disabled');

    e.preventDefault();
  });
};

// calls for ceasefire
warApp.ceasefire = () => {
  warApp.ceasefireButton.on('click', function (e) {
    console.log(true);

    warApp.gameMessage = `General, you've called a ceasefire and made peace. Our two nations will work together to rebuild and attempt to prevent the atrocitiy of war from happening again. Your brilliant negotation and steadfast resolution to peace will usher forth an englightment in the world.  As you know, there are truly no winners of war.`
    
    warApp.gameModal('CEASEFIRE');

    e.preventDefault();
  });
};

// document ready
$(function () {
  warApp.init();
});