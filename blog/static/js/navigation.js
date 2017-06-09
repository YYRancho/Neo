// switch the visibility of the navigation bar
var before_scrolltop = $(window).scrollTop()
$(window).scroll(function() {
    var nav = $('nav')
    var nav_a = $('nav>a')
    var after_scrolltop = $(window).scrollTop()
    if (after_scrolltop < before_scrolltop && after_scrolltop > 390) {
        nav.css('position','fixed').css('background-color','rgba(0,133,161,0.8)')
        nav_a.css('padding-top','1.5%').css('padding-bottom','1.5%')
    } else {
        nav.css('position','').css('background-color','rgba(0,0,0,0)')
        nav_a.css('padding-top','2%').css('padding-bottom','1%')
    }
    before_scrolltop = after_scrolltop
})
