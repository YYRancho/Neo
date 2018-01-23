'use strict';

$('.list-btn').mouseover(function () {
    $('.game-btn').css({
        'opacity': 1,
        'transform': 'scaleY(1) scaleX(1) translateY(0px)'
    });
});
$('.switcher').mouseleave(function () {
    $('.game-btn').css({
        'opacity': 0,
        'transform': 'scaleY(0.4) scaleX(0.4) translateY(-20px)'
    });
});
//# sourceMappingURL=switcher.js.map