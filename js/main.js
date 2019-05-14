const warApp = {
  deck: [],
  deckSuits: ['SPADES', 'DIAMONDS', 'CLUBS', 'HEARTS'],
  deckValues: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
};

// init function for war app
warApp.init = () => {
  warApp.buildDeck();
  warApp.shuffleDeck();
  warApp.dealCards();
}

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
  warApp.playerCardCount = 26,
  warApp.computerCardCount = 26;
}

$(function () {
  warApp.init();

  warApp.playerCardPile.forEach((card) => {
    document.getElementById('main').innerHTML += `<img src="${card.image}">`;

  })
});