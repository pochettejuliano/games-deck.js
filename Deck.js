/*
    Deck.JS - A basic playing card engine
    Cesar Juliano
*/

function Deck ( values, acesHigh, shuffled, withJokers ) {

    // PRIVATE PROPERTIES //
    var RANK_MAP = [ "Joker", "Ace", "Two", "Three", "Four", "Five", "Six",
                     "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King" ];

    var SUIT_MAP = [ Deck.SUIT_CLUBS, Deck.SUIT_DIAMONDS, Deck.SUIT_HEARTS, Deck.SUIT_SPADES ];
    var VALUES = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11 ];

    var _deck = new Array();
    var _dealtCards = new Array();
    var _removedCards = new Array();

    var _that = this;

    var _acesHigh = acesHigh || false;
    var _shuffled = shuffled || false;
    var _withJokers = withJokers || false;


    // PUBLIC API //
    this.acesHigh = function () {
        return _acesHigh;
    };

    this.collect = function ( includeRemoved ) {
        while ( _dealtCards.length ) {
            moveCard( _dealtCards[ 0 ], _deck, Deck.INSERT_BOTTOM );
        }

        if ( includeRemoved ) {
            while( _removedCards.length ) {
                moveCard( _removedCards[ 0 ], _deck, Deck.INSERT_BOTTOM );
            }
        }
    };

    this.count = function () {
        return _deck.length;
    };

    this.deal = function ( howMany ) {
        var cardsToDeal = [];

        if ( _deck.length == 0 ) {
            handleError( "Dealing Error", "Deck is empty." );
        }

        if ( !howMany ) {
            howMany = 1;
        } else if ( howMany > _deck.length ) {
            handleError( "Dealing Error", "Number of cards requested dealt is more than remaining cards in deck." );
        }

        while ( howMany-- ) {
            cardsToDeal.push( moveCard( _deck[ 0 ], _dealtCards, Deck.INSERT_BOTTOM ) );
        }

        return cardsToDeal;
    };

    this.insert = function ( item, position ) {
        if ( item instanceof Card ) {
            moveCard( item, _deck, position )
        } else if ( item instanceof Array ) {
            item.forEach( function ( card ) {
                moveCard( card, _deck, position );
            } );
        } else {
            handleError( "Insert Error", "Invalid format" );
        }
    };

    this.pick = function () {
        if ( _deck.length == 0 ) {
            handleError( "Dealing Error", "Deck is empty." );
        }

        return moveCard( _deck[ Math.floor( Math.random() * _deck.length ) ], _dealtCards, Deck.INSERT_BOTTOM );
    };

    this.remove = function ( selection ) {
        return getCards( selection, _deck, _removedCards, Deck.INSERT_BOTTOM );
    };

    this.select = function ( selection ) {
        return getCards( selection, _deck, _dealtCards, Deck.INSERT_BOTTOM );
    };

    this.shuffle = function () {
        var shuffledDeck = [];

        while ( _deck.length ) {
            shuffledDeck.push( _deck.splice( Math.floor( Math.random() * _deck.length ), 1 )[ 0 ] );
        }

        _deck = shuffledDeck;
        _shuffled = true;
    };

    this.shuffled = function () {
        return _shuffled;
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

        _shuffled = false;
    };

    this.withJokers = function () {
        return _withJokers;
    };


    // PRIVATE API //
    function createCards () {
        // check values
        if ( !values ) {
            values = VALUES;
        } else if ( values.length < VALUES.length ) {
            handleError( "Create Error", "Cannot create cards because of improper values array." );
        }

        // create cards and put into the deck
        for ( var i = 0; i < SUIT_MAP.length; i++ ) {
            for ( var j = 1; j < RANK_MAP.length; j++ ) {
                moveCard( new Card( j, SUIT_MAP[ i ], j == 1 && _acesHigh ? values[ values.length - 1 ] : values[ j ] ), _deck );
            }
        }

        // add 2 Jokers to the deck
        if ( _withJokers ) {
            moveCard( new Card( 0, "", values[ 0 ] ), _deck );
            moveCard( new Card( 0, "", values[ 0 ] ), _deck );
        }

        // shuffle the deck
        if ( _shuffled ) {
            _that.shuffle();
        }
    }

    function getCards ( selection, from, to, position ) {
        switch ( typeof selection ) {
            case "object" :
                return getCardsByIdentity( selection, from, to, position );
            break;

            case "string" :
                return getCardsByProperty( "getSuit", selection, from, to, position )
            break;

            case "number" :
                return getCardsByProperty( "getRank", selection, from, to, position );
            break;

            default :
                handleError( "Get Error", "Improper criteria." );
        }
    }

    function getCardsByIdentity ( cards, from, to, position ) {
        var cardsToGet = [];
        var j;

        for ( var i = 0; i < cards.length; i++ ) {
            j = 0;

            while ( j < from.length ) {
                if ( from[ j ].getRank() == cards[ i ].rank && from[ j ].getSuit() == cards[ i ].suit ) {
                    cardsToGet.push( moveCard( from[ j ], to, position ) );
                } else {
                    j++;
                }
            }
        }

        return cardsToGet;
    }

    function getCardsByProperty ( getter, value, from, to, position ) {
        var cardsToGet = [];
        var i = 0;

        while ( i < from.length ) {
            if ( from[ i ][ getter ]() == value ) {
                cardsToGet.push( moveCard( from[ i ], to, position ) );
            } else {
                i++;
            }
        }

        return cardsToGet;
    }

    function handleError ( name, message ) {
        throw { name : name, message : message };
    }

    function moveCard ( card, to, position ) {
        var from;
        var index;
        var state;

        // remove card from source stack, if existing
        switch( card.getState() ) {
            case Deck.CARD_STATE_DEALT :
                from = _dealtCards;
            break;

            case Deck.CARD_STATE_IN_DECK :
                from = _deck;
            break;

            case Deck.CARD_STATE_REMOVED :
                from = _removedCards;
            break;

            default :
        }

        if ( from ) {
            index = from.indexOf( card );
            from.splice( index, 1 );
        }

        // put card in destination stack at specified position
        index = to.indexOf( card );

        if ( index != -1 ) {
            handleError( "Move Error", card.toString() + " is already in the destination stack" );
        }

        switch ( position ) {
            case Deck.INSERT_TOP :
                to.unshift( card );
            break;

            case Deck.INSERT_MIDDLE_RANDOM :
                to.splice( Math.floor( Math.random() * ( to.length -1 ) ) + 1, 0, card );
            break;

            case Deck.INSERT_BOTTOM :
            case undefined :
                to.push( card );
            break;

            default :
                to.splice( position, 0, card );
        }

        // set new card state
        switch ( to ) {
            case _deck :
                state = Deck.CARD_STATE_IN_DECK;
            break;

            case _dealtCards :
                state = Deck.CARD_STATE_DEALT;
            break;

            case _removedCards :
                state = Deck.CARD_STATE_REMOVED;
            break ;

            default :
        }

        card.getStateSetter.call( _that ).call( card, state );
        return card;
    }


    // CARD OBJECT //
    function Card ( rank, suit, value ) {
        var _rank = rank;       // pip or face: Ace, Four, Seven, Jack, King, etc.
        var _state;             // specifies whether card is in deck, dealt, or removed from play
        var _suit = suit;       // symbol: Hearts, Clubs, etc.; "" for Jokers
        var _value = value;     // numeric value to mathematically compare cards


        this.face = function () {
            return _rank > 10;
        }

        this.getRank = function () {
            return _rank;
        };

        this.getState = function () {
            return _state;
        };

        this.getStateSetter = function () {
            if ( this == _that ) {
                return setState;
            } else {
                handleError( "State Set Error", "Cannot set state of " + this.toString() + " outside of Deck API." );
            }
        };

        this.getSuit = function () {
            return _suit
        };

        this.getValue = function () {
            return _value;
        };

        this.toString = function () {
            return RANK_MAP[ _rank ] + ( _rank ? " of " + _suit : "" );
        };

        function setState ( state ) {
            _state = state;
        }
    }


    // STARTING POINT //
    createCards();
}

// CONSTANTS //
Deck.CARD_STATE_DEALT = "Dealt";
Deck.CARD_STATE_IN_DECK = "In Deck";
Deck.CARD_STATE_REMOVED = "Removed";

Deck.INSERT_BOTTOM = -1;
Deck.INSERT_MIDDLE_RANDOM = -2;
Deck.INSERT_TOP = -3;

Deck.SUIT_CLUBS = "Clubs";
Deck.SUIT_DIAMONDS = "Diamonds";
Deck.SUIT_HEARTS = "Hearts";
Deck.SUIT_SPADES = "Spades";
