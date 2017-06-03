$(window).scroll(function() {
    var nav = $('nav')
    var nav_a = $('nav>a')
    if ($(window).scrollTop() > 370) {
        nav.css('position','fixed').css('background-color','rgba(0,133,161,0.8)')
        nav_a.css('padding-top','1%').css('padding-bottom','1%')
    } else {
        nav.css('position','').css('background-color','rgba(0,0,0,0)')
        nav_a.css('padding-top','2%').css('padding-bottom','1%')
    }
})
