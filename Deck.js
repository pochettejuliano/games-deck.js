/*
- Can Borrow methods from Array
- interface array methods
- Extend Array
- Composition
- Array like Object
*/


// .remove = like select but out of play
// .pick = random 1
// .select = actual cards
// .deal = get from top
.insert - put back dealt or removed card
.collect - get all dealt cards
//.sort - sort cards in deck

.inDeck( card )
.isShuffled
.areJokersIncluded

.setAcesHigh
.areAcesHigh



function Deck ( shuffled, includeJokers ) {

    // PUBLIC CONSTANTS //
    this.SUIT_CLUBS = "Clubs";
    this.SUIT_DIAMONDS = "Diamonds";
    this.SUIT_HEARTS = "Hearts";
    this.SUIT_SPADES = "Spades";


    // PRIVATE CONSTANTS //
    var RANK_MAP = [ "Joker", "Ace", "Two", "Three", "Four", "Five", "Six",
                     "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King" ];

    var SUIT_MAP = [ "Clubs", "Diamonds", "Hearts", "Spades" ];


    // PRIVATE PROPERTIES //
    var _deck;
    var _dealtCards = new Array();
    var _removedCards = new Array();

    var _that = this;


    // PUBLIC API //
    this.count = function () {
        return _deck.length;
    };

    this.deal = function ( howMany ) {
        var cardsToDeal = [];

        if ( _deck.length == 0 ) {
            handleError( "Dealing Error", "No more cards in deck." );
        }

        if ( !howMany ) {
            howMany = 1;
        } else if ( howMany > _deck.length ) {
            // Option 1: set to cards remaining
            howMany = _deck.length;

            // Option 2: throw exception
            // handleError( "Dealing Error", "Number of cards requested dealt is more than remaining cards in deck." );
        }

        cardsToDeal = _deck.splice( 0, howMany );
        _dealtCards = _dealtCards.concat( cardsToDeal );
        return cardsToDeal;
    };

    this.insert = function ( cards, location ) {
        // TODO: Remove from _dealtCards or _removedCards
        // TODO: Handle list of cards

        if ( cards instanceof Card && _deck.indexOf( cards ) == -1 ) {
            if ( location == -1 ) {
                _deck.unshift( cards );
            } else if ( location == 0 ) {
                _deck.splice( Math.floor( Math.random() * ( _deck.length - 1 ) ) + 1, 0, cards );
            } else {
                _deck.push( cards );
            }
        }
    }

    this.pick = function () {
        var cardToPick;

        if ( _deck.length == 0 ) {
            handleError( "Dealing Error", "No more cards in deck." );
        }

        cardToPick = _deck.splice( Math.floor( Math.random() * _deck.length ), 1 )[ 0 ];
        _dealtCards.push( cardToPick );
        return cardToPick;
    };

    this.remove = function ( selection ) {
        return getCards( selection, _removedCards );
    }

    this.select = function ( selection ) {
        return getCards( selection, _dealtCards );
    };

    this.shuffle = function () {
        var shuffledDeck = [];

        while ( _deck.length ) {
            shuffledDeck.push( _deck.splice(  Math.floor( Math.random() * _deck.length ), 1 )[ 0 ] );
        }

        _deck = shuffledDeck;
    };

    this.sort = function () {
        _deck.sort( function ( a, b ) {
            if ( a.getSuit() == b.getSuit() ) {
                return a.getRank() < b.getRank() ? -1 : 1;
            } else if ( a.getSuit() < b.getSuit() ) {
                return -1;
            } else {
                return 1;
            }
        } );
    }


    // PRIVATE API //
    function createCards () {
        // initialize deck array
        _deck = new Array();

        // create cards and put into the deck
        for ( var i = 0; i < SUIT_MAP.length; i++ ) {
            for ( var j = 1; j < RANK_MAP.length; j++ ) {

                // TODO: set card value
                _deck.push( new Card( j, SUIT_MAP[ i ] ) );
            }
        }

        // add 2 Jokers to the deck
        if ( includeJokers ) {
            _deck.push( new Card( 0, "" ) );
            _deck.push( new Card( 0, "" ) );
        }

        // shuffle the deck
        if ( shuffled ) {
            _that.shuffle();
        }
    }

    function getCards ( selection, whichStack ) {
        var cardsToSelect;

        switch ( typeof selection ) {
            case "object" :
                cardsToSelect = getCardsByIdentity( selection );
            break;

            case "string" :
                cardsToSelect = getCardsByProperty( "getSuit", selection )
            break;

            case "number" :
                cardsToSelect = getCardsByProperty( "getRank", selection );
            break;

            default :
                handleError( "Get Error", "Improper criteria." );
        }

        whichStack = whichStack.concat( cardsToSelect );
        return cardsToSelect;
    }

    function getCardsByIdentity ( cards ) {
        var cardsToGet = [];
        var j;

        for ( var i = 0; i < cards.length; i++ ) {
            j = 0;

            while ( j < _deck.length ) {
                if ( _deck[ j ].getRank() == cards[ i ].rank && _deck[ j ].getSuit() == cards[ i ].suit ) {
                    cardsToGet.push( _deck.splice( j, 1 )[ 0 ] );
                } else {
                    j++;
                }
            }
        }

        return cardsToGet;
    }

    function getCardsByProperty ( getter, value ) {
        var cardsToGet = [];
        var i = 0;

        while ( i < _deck.length ) {
            if ( _deck[ i ][ getter ]() == value ) {
                cardsToGet.push( _deck.splice( i, 1 )[ 0 ] );
            } else {
                i++;
            }
        }

        return cardsToGet;
    }

    function handleError ( name, message ) {
        throw { name : name, message : message };
    }


    // CARD OBJECT //
    function Card ( rank, suit ) {
        var _rank = rank;   // pip or face: Ace, Four, Seven, Jack, King, etc.
        var _suit = suit;   // symbol: Hearts, Clubs, etc.; "" for Jokers
        var _value;         // numeric value to mathematically compare cards

        this.getRank = function () {
            return _rank;
        };

        this.getSuit = function () {
            return _suit
        };

        this.getValue = function () {
            return _value;
        }

        this.toString = function () {
            return RANK_MAP[ _rank ] + ( _rank ? " of " + _suit : "" );
        };

        this.setValue = function ( value ) {
            _value = value;
        };
    }


    // STARTING POINT //
    createCards();

}
