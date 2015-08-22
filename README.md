# Deck.JS: A Playing Cards Engine in JavaScript

Deck.JS is a basic playing cards engine written in vanilla JavaScript. It provides a handful of methods that allow users to perform standard actions on a French-suited 52-card deck.

### Documentation

##### Instantiation

##### Deck API

- __acesHigh()__ returns `true` if the value of Ace cards have been set to high (have a value of one greater than the King cards) or `false` if not. By default, Aces have a value of 11 if they are set to high and one if low. This value is negligible if custom values are set for the cards.

- __collect( includeRemoved )__ puts all `Card` objects that have been dealt back into the bottom of the deck, except for removed cards. If removed cards are also to be put back into the deck, call this method with the `includeRemoved` parameter set to `true`. If Joker cards were added to the deck when the deck was instantiated but later removed, they are put back in as well.

- __count()__ returns how many cards are in the deck.

- __deal( howMany )__ returns an array of `Card` objects taken from the 'top' of the deck. The `howMany` parameter specifies the number of cards to return; if none is specified the default is one.

- __insert( cardOrCards, position )__ puts back a dealt or removed card or an array of cards in the deck at the specified position. The `position` parameter could be:

⋅⋅* a positive integer that corresponds to the position in the deck where the card or cards will be inserted. The higher the number, the further down the deck the card or cards are placed in. If the number provided is greater than the number of cards still in the deck, the card or cards are placed at the bottom.
⋅⋅* one of the `Deck` object's insertion constants (see below).

- __pick()__ returns a single random card from the deck. This card is considered dealt.

- __remove( selection )__ returns an array of `Card` objects that have been taken from the deck and are not in play. These cards are not put back into the deck when `collect()` is called, unless specified otherwise. The selection parameter could be:

⋅⋅* a rank value, where 1 = Ace and 13 = King. This removes cards of the same rank across all suits that are still in the deck.
⋅⋅* a suit value, represented by the `Deck` object's suit constants (see below). This removes cards of the same suit that are still in the deck.
⋅⋅* an array of objects with _rank_ and _suit_ keys that identify individual cards.

- __select( selection )__ returns an array of `Card` objects from the deck. These cards are considered dealt. The `selection` parameter works in the same way as the `remove()` method.

- __shuffle()__ randomly rearranges the order of the cards in the deck. Dealt or removed cards are not included.

- __shuffled()__ returns `true` if the deck has been shuffled and `false` if the deck has been sorted.

- __sort()__ sorts the cards in the deck by suit, then by rank. Dealt or removed cards are not included.

- __withJokers()__ returns `true` if Joker cards were added to the deck when the deck was created and `false` if not. This can not be used to to determine if the Joker cards where added to the deck on instantiation but later removed.


##### Deck Constants

- Insertion Constants: use to specify the position of cards to be put back into the deck with `insert()`

⋅⋅* Deck.INSERT_BOTTOM for inserting cards at the bottom of the deck
⋅⋅* Deck.INSERT_MIDDLE_RANDOM for inserting cards at random positions between the top and bottom cards in the deck
⋅⋅* Deck.INSERT_TOP for inserting cards at the top of the deck;

- Suit Constants: use to specify the cards to be removed with `remove()` or selected with `select()`

⋅⋅* Deck.SUIT_CLUBS for selecting or removing Club cards
⋅⋅* Deck.SUIT_DIAMONDS for selecting or removing Diamond cards
⋅⋅* Deck.SUIT_HEARTS for selecting or removing Heart cards
⋅⋅* Deck.SUIT_SPADES for selecting or removing Spade cards

- State Constants: use to check the state of the card

⋅⋅* Deck.CARD_STATE_DEALT card has been dealt, selected or picked
⋅⋅* Deck.CARD_STATE_IN_DECK card is in deck
⋅⋅* Deck.CARD_STATE_REMOVED card has been removed from play


##### Card API

- __face()__ returns true if a card is a Jack, Queen or King and false if not.

- __getRank()__ returns the rank of a card, which is 0 for Jokers and 1 to 13 for Ace to King.

- __getState()__ returns whether the card is in deck, removed from play, or dealt.

- __getSuit()__ returns the suit of the card.

- __getValue()__ returns the numeric value of the card.

- __toString()__ returns a human readable representation of the card, with the format `rank` of `suit`.
