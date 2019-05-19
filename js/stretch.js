// API calls to deck of cards API
// not used as API crashed last week but the code is here

// get the deck ID
warApp.buildDeck = async () => {
  const cardResponse = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
  const cardData = await cardResponse.json()

  return cardData
}

// get the shuffled cards
warApp.buildCards = async (deckID) => {
  const dealResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`);
  const dealData = await dealResponse.json();

  return dealData
}

// deal the cards into player and computer hands
warApp.dealCards = async () => {
  warApp.deckData = await warApp.buildDeck();
  warApp.allCards = await warApp.buildCards(warApp.deckData[deck_id]);

  warApp.playerCardPile = warApp.allCards.cards.splice(0, 26)
  warApp.computerCardPile = warApp.allCards.cards;
}

// card object is different and values are returned as strings with face cards as: 'JACK', 'QUEEN', 'KING', 'ACE'
// can parseInt number valued cards and use IF statement to convert face value cards to an integer value