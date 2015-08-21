/*
    Deck.JS - A playing card engine
    Cesar Juliano
*/

function Deck ( shuffled, withJokers ) {

    // PUBLIC CONSTANTS //
    this.CARD_STATE_DEALT = "Dealt";
    this.CARD_STATE_IN_DECK = "In Deck";
    this.CARD_STATE_REMOVED = "Removed";

    this.INSERT_BOTTOM = -1;
    this.INSERT_MIDDLE_RANDOM = -2;
    this.INSERT_TOP = -3;

    this.SUIT_CLUBS = "Clubs";
    this.SUIT_DIAMONDS = "Diamonds";
    this.SUIT_HEARTS = "Hearts";
    this.SUIT_SPADES = "Spades";


    // PRIVATE CONSTANTS //
    var RANK_MAP = [ "Joker", "Ace", "Two", "Three", "Four", "Five", "Six",
                     "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King" ];

    var SUIT_MAP = [ "Clubs", "Diamonds", "Hearts", "Spades" ];


    // PRIVATE PROPERTIES //
    var _deck = new Array();
    var _dealtCards = new Array();
    var _removedCards = new Array();

    var _that = this;


    // PUBLIC API //
    this.collect = function () {
        _dealtCards.forEach ( function ( card ) {
            moveCard( card, _deck, this.INSERT_BOTTOM )
        } );
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
            cardsToDeal( moveCard( _deck[ 0 ], _dealtCards, this.INSERT_BOTTOM ) );
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

        return moveCard( _deck[ Math.floor( Math.random() * _deck.length ) ], _deck, _dealtCards, this.INSERT_BOTTOM );
    };

    this.remove = function ( selection ) {
        return getCards( selection, _deck, _removedCards, this.INSERT_BOTTOM );
    };

    this.select = function ( selection ) {
        return getCards( selection, _deck, _dealtCards, this.INSERT_BOTTOM );
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
    };


    // PRIVATE API //
    function createCards () {
        // initialize deck array
        _deck = new Array();

        // create cards and put into the deck
        for ( var i = 0; i < SUIT_MAP.length; i++ ) {
            for ( var j = 1; j < RANK_MAP.length; j++ ) {

                // TODO: set card value
                moveCard( new Card( j, SUIT_MAP[ i ] ), _deck );
            }
        }

        // add 2 Jokers to the deck
        if ( withJokers ) {
            moveCard( new Card( 0, "" ), _deck );
            moveCard( new Card( 0, "" ), _deck );
        }

        // shuffle the deck
        if ( shuffled ) {
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
            case _that.CARD_STATE_DEALT :
                from = _dealtCards;
            break;

            case _that.CARD_STATE_IN_DECK :
                from = _deck;
            break;

            case _that.CARD_STATE_REMOVED :
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
            case _that.INSERT_TOP :
                to.unshift( card );
            break;

            case _that.INSERT_MIDDLE_RANDOM :
                to.splice( Math.floor( Math.random() * ( to.length -1 ) ) + 1, 0, card );
            break;

            case _that.INSERT_BOTTOM :
            case undefined :
                to.push( card );
            break;

            default :
                to.splice( position, 0, card );
        }

        // set new card state
        switch ( to ) {
            case _deck :
                state = _that.CARD_STATE_IN_DECK;
            break;

            case _dealtCards :
                state = _that.CARD_STATE_DEALT;
            break;

            case _removedCards :
                state = _that.CARD_STATE_REMOVED;
            break ;

            default :
        }

        card.getStateSetter.call( this ).call( card, state );
        return card;
    }


    // CARD OBJECT //
    function Card ( rank, suit ) {
        var _rank = rank;       // pip or face: Ace, Four, Seven, Jack, King, etc.
        var _suit = suit;       // symbol: Hearts, Clubs, etc.; "" for Jokers
        var _state = state;     // specifies whether card is in deck, dealt, or removed from play
        var _value;             // numeric value to mathematically compare cards

        this.getRank = function () {
            return _rank;
        };

        this.getSuit = function () {
            return _suit
        };

        this.getState = function () {
            return _state;
        };

        this.getValue = function () {
            return _value;
        };

        this.getStateSetter = function () {
            if ( this == _that ) {
                return setState;
            } else {
                handleError( "State Set Error", "Cannot set state of card outside of the deck." );
            }
        };

        this.toString = function () {
            return RANK_MAP[ _rank ] + ( _rank ? " of " + _suit : "" );
        };

        this.setValue = function ( value ) {
            _value = value;
        };

        function setState ( state ) {
            _state = state;
        }
    }


    // STARTING POINT //
    createCards();
}
