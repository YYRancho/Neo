// hide the hr while it is below the subtransparent navigation bar
$(window).scroll(function() {
    let hrs = $('hr')
    let nav = $('nav')
    for (let hr of hrs) {
        if (hr.offsetTop < nav.offset().top + nav.height()) {
            hr.style.opacity = 0;
        } else {
            hr.style.opacity = 1;
        }
    }
})
