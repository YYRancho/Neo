'use strict';

let player = $('video')[0]
player.onseeking(function() {
    console.log('seeking');
})
player.onseeked(function() {
    console.log('seeked');
})
