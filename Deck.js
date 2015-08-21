
function Deck ( shuffled, includeJokers ) {

    // CONSTANTS //
    var RANK_MAP = [ "Joker", "Ace", "Two", "Three", "Four", "Five", "Six",
                     "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King" ];

    var SUIT_MAP = [ "Clubs", "Diamonds", "Hearts", "Spades" ];


    // PRIVATE PROPERTIES //
    var _deck;
    var _that = this;


    // PUBLIC API //
    this.count = function () {

    };

    this.shuffle = function () {
        var shuffledDeck = [];

        while ( _deck.length ) {
            shuffledDeck.push( _deck.splice(  Math.floor( Math.random() * _deck.length ), 1 )[ 0 ] );
        }
    };


    // PRIVATE API //
    function createCards () {
        // initialize deck array
        _deck = new Array();

        // create cards and put into the deck
        for ( var i = 0; i < SUIT_MAP.length; i++ ) {
            for ( var j = 1; j < RANK_MAP.length; j++ ) {

                // TODO: setting card value
                _deck.push( new Card( j, SUIT_MAP[ i ] ) );
            }
        }

        // add 2 Jokers to the deck
        if ( includeJokers ) {
            _deck.push( new Card( 0 ) );
            _deck.push( new Card( 0 ) );
        }

        // shuffle the deck
        if ( shuffled ) {
            _that.shuffle();
        }
    }


    // CARD OBJECT //
    function Card ( rank, suit ) {
        var _rank = rank;   // pip or face: Ace, Four, Seven, Jack, King, etc.
        var _suit = suit;   // symbol: Hearts, Clubs, etc.; undefined for Jokers
        var _value;         // numeric value to mathematically compare cards

        this.getRank = function () {
            return _rank;
        };

        this.getSuit = function () {
            return _suit
        };

        this.toString = function () {
            return RANK_MAP[ _rank ] + ( _rank ? " of " + _suit : "" );
        };

        this.getValue = function () {
            return _value;
        }

        this.setValue = function ( value ) {
            _value = value;
        };
    }


    // STARTING POINT //
    createCards();

}
