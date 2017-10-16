// ========== switch the color and theme in transition ==========
let switcher = $('div.switcher')
let background = $('body, div.stage')
let switcher_timer
switcher.click(function() {
    console.log('bg: ' + background.css('background-color'))
    clearInterval(switcher_timer)
    let old_bd_bgc = background.css('background-color')
    let old_rgb_array = old_bd_bgc.substr(4,old_bd_bgc.length-5).split(',')
    let new_r = Math.floor(Math.random()*255)
    let new_g = Math.floor(Math.random()*255)
    let new_b = Math.floor(Math.random()*255)
    let velocity_r = (new_r-Number(old_rgb_array[0]))/20;
    let velocity_g = (new_g-Number(old_rgb_array[1]))/20;
    let velocity_b = (new_b-Number(old_rgb_array[2]))/20;
    switcher_timer = setInterval(function() {
        let bd_bgc = background.css('background-color')
        let rgb_array = bd_bgc.substr(4,bd_bgc.length-5).split(',')
        if (Math.abs(Number(rgb_array[0])-new_r) >= 2) {
            let r = Math.floor(Number(rgb_array[0])+velocity_r)
            let g = Math.floor(Number(rgb_array[1])+velocity_g)
            let b = Math.floor(Number(rgb_array[2])+velocity_b)
            background.css('background-color','rgb('+r+','+g+','+b+')')
        } else {
            clearInterval(switcher_timer)
        }
    },15)
})


// ========== switch the opacity of the footer icons ==========
let footer = $('footer')
let footer_icons = $('div.footer-icons')
let footer_icon_timer
footer_icons.mouseover(function() {
    clearInterval(footer_icon_timer)
    footer_icons.css('opacity','1')
})
footer_icons.mouseout(function() {
    // fade animation
    footer_icon_timer = setInterval(function() {
        if (footer_icons.css('opacity') > 0) {
            footer_icons.css('opacity',Number(footer_icons.css('opacity'))-0.05+'')
        } else {
            clearInterval(footer_icon_timer)
        }
    },50)
})
