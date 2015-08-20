
var RANK_MAP = [ "Ace", "Two", "Three", "Four", "Five", "Six", "Seven",
                 "Eight", "Nine", "Ten", "Jack", "Queen", "King" ];

var SUIT_MAP = [ "Clubs", "Diamonds", "Hearts", "Spades" ];


function Card ( rank, suit ) {
    var _rank = rank;   // pip or face: Ace, Seven, Queen, etc.
    var _suit = suit;   // symbol: Hearts, Clubs, etc.
    var _value;         // numeric value to mathematically compare cards


    this.getRank = function () {
        return _rank;
    };

    this.getSuit = function () {
        return _suit
    };

    this.toString = function () {
        return RANK_MAP[ _rank - 1 ] + " of " + _suit;
    };

    this.getValue = function () {
        return _value;
    }

    this.setValue = function ( value ) {
        _value = value;
    };
}
