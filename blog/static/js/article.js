// make the catelog fixed when the position is below the header
$(window).scroll(function() {
    var sidebar = $('div.sidebar')
    var left_distance = sidebar.position()['left']
    var site_heading = $('div.site-heading')
    var scrolltop = $(window).scrollTop()
    if (scrolltop > site_heading.outerHeight()) {
        sidebar.css('position','fixed').css('top','0px').css('left',left_distance.toString() + 'px')
    } else {
        sidebar.css('position','')
    }
})
