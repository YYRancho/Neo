// hide the hr while it is below the subtransparent navigation bar
$(window).scroll(function() {
    var hrs = $('hr')
    var nav = $('nav')
    for (var hr of hrs) {
        if (hr.offsetTop < nav.offset().top + nav.height()) {
            hr.style.opacity = 0;
        } else {
            hr.style.opacity = 1;
        }
    }
})
