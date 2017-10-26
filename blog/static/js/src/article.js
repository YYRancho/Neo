'use strict';

// make the catelog fixed when the position is below the header
$(window).scroll(function() {
    let sidebar = $('div.sidebar')
    let left_distance = sidebar.position()['left']
    let site_heading = $('div.site-heading')
    let scrolltop = $(window).scrollTop()
    if (scrolltop > site_heading.outerHeight()) {
        sidebar.css('position','fixed').css('top','0px').css('left',left_distance.toString() + 'px')
    } else {
        sidebar.css('position','')
    }
})
