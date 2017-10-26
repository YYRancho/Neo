'use strict';

// switch the visibility of the navigation bar
let before_scrolltop = $(window).scrollTop()
$(window).scroll(function() {
    let nav = $('nav')
    let nav_a = $('nav>a')
    let site_heading = $('div.site-heading')
    let after_scrolltop = $(window).scrollTop()
    if (after_scrolltop < before_scrolltop && after_scrolltop > site_heading.outerHeight()) {
        nav.css('position','fixed').css('background-color','rgba(0,133,161,0.8)')
        nav_a.css('padding-top','1.5%').css('padding-bottom','1.5%')
    } else {
        nav.css('position','').css('background-color','rgba(0,0,0,0)')
        nav_a.css('padding-top','2%').css('padding-bottom','1%')
    }
    before_scrolltop = after_scrolltop
})
