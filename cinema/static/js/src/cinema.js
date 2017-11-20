'use strict';

function window_resize() {
    $('.poster-hover').css('left', $('.repo').width()/2 - 25 + 'px')
}
window_resize()
