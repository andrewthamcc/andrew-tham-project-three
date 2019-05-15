const warApp = {
  deck: [],
  deckSuits: ['SPADES', 'DIAMONDS', 'CLUBS', 'HEARTS'],
  deckValues: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],

  // instantiate an empty array for when war is declared
  warCardPile: [],

  // an array of possible computer names that the player will face at random
  computerName: ['General Harry Hearts', 'Colonel Amy Aces', 'Admiral Denise Diamonds', 'Sergeant Spike Spades']
};

// init function for war app
warApp.init = () => {
  warApp.buildDeck();
  warApp.shuffleDeck();
  warApp.dealCards();
  warApp.playCard();
}

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
}

// function that randomizes the deck by changing location of array items
warApp.shuffleDeck = () => {
  let shuffleCount = 0;
  while(shuffleCount < 500) {
    // gets two random cards from the deck
    let locationOne = Math.floor(Math.random() * warApp.deck.length);
    let locationTwo = Math.floor(Math.random() * warApp.deck.length);
    let tempLocation = warApp.deck[locationOne];  
    
    // switch the locations of cards in the deck
    warApp.deck[locationOne] = warApp.deck[locationTwo];
    warApp.deck[locationTwo] = tempLocation;

    shuffleCount++;
  }
}

// deal the cards by splicing the now shuffled deck array into two arrays
warApp.dealCards = () => {
  warApp.playerCardPile = warApp.deck.splice(0, 26)
  warApp.computerCardPile = warApp.deck;

  // instantiates the intial count of cards for both players
  warApp.playerCardCount = warApp.playerCardPile.length;
  warApp.computerCardCount = warApp.computerCardPile.length;
}

// battle function when playing cards
warApp.battle = () => {
  // play a user card
  const playerBattleCard = warApp.playerCardPile.shift();
  const computerBattleCard = warApp.computerCardPile.shift();

  // // get the values of each card
  const playerBattleValue = playerBattleCard.value;
  const computerBattleValue = computerBattleCard.value;

  // get the images of each card
  const playerBattleImage = playerBattleCard.image;
  const computerBattleImage = computerBattleCard.image;

  console.log(`Player draws:`, playerBattleValue); 
  console.log(`Computer draws:`, computerBattleValue);

  // determines if the player wins or loses or war is to be declared
  if (playerBattleValue > computerBattleValue) {
    console.log('win');

    // adds the cards to the players pile and updates the count
    warApp.playerCardPile = warApp.playerCardPile.concat([playerBattleCard, computerBattleCard]);
    
    // adds the war cards to the players pile and clears the war card pile array
    warApp.playerCardPile = warApp.playerCardPile.concat(warApp.warCardPile);
    warApp.warCardPile = [];

    warApp.playerCardCount = warApp.playerCardPile.length
    warApp.computerCardCount = warApp.computerCardPile.length;

    console.log(`Player has ${warApp.playerCardPile.length} cards`)

  } else if (playerBattleValue < computerBattleValue) {
    console.log('lose');

    // adds the cards to the computers pile and updates the count
    warApp.computerCardPile = warApp.computerCardPile.concat([playerBattleCard, computerBattleCard])
   
    warApp.computerCardPile = warApp.computerCardPile.concat(warApp.warCardPile);
    warApp.warCardPile = [];
  

    warApp.playerCardCount = warApp.playerCardPile.length
    warApp.computerCardCount = warApp.computerCardPile.length;

    console.log(`Player has ${warApp.playerCardPile.length} cards`)
  
  } else if (playerBattleValue === computerBattleValue) {
    console.log('WAR!!!');

    // pushes the current cards to the empty war array
    warApp.warCardPile.push(playerBattleCard);
    warApp.warCardPile.push(computerBattleCard);

    // splices off three cards off of each player and computer pile
    const playerRemoved = warApp.playerCardPile.splice(0, 3);
    const computerRemoved = warApp.computerCardPile.splice(0, 3);

    // pushes the extra cards from either player/computer onto a war pile that either will win
    warApp.warCardPile = warApp.warCardPile.concat(playerRemoved, computerRemoved);

    console.log(warApp.warCardPile);

    // goes to battle again
    warApp.battle();
  }
};

warApp.playCard = () => {
  $('button').on('click', function (e) {
    warApp.battle();

    // prevent the default behaviour
    e.preventDefault();
  });
}

// document ready
$(function () {
  warApp.init();
});