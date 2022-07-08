;(function() {

var solitaire = document.getElementsByTagName("solitaire")[0],
    style     = solitaire.style;

function getSize(size) {
    return size.indexOf('%') !== -1 ? size : size.replace('px', '') + 'px';
}

if (solitaire) {
    style.width  = getSize(solitaire.getAttribute('width') || "100%");
    style.height = getSize(solitaire.getAttribute('height') || "100%");
}

require(
[
    'main'
],

function(Solitaire) {
    'use strict';
    Solitaire({
        draw3: true,
        allowedDraws: Infinity,
        every: 10,
        deduct: 2,
        points: {
            move_to_foundation: 10,
            waste_to_tableau: 5,
            foundation_to_tableau: -15,
            turn_card: 5
        }
    })
});
}())