'use strict';

// ========== initial ==========
$(document).ready(function() {
    $(window).resize()

    let message_list = new Rolling('#message-list')
    message_list.control_step()
    message_list.adjust_width(false, false)
    let message_editor = new Rolling('#message-editor')
    message_editor.control_step()
    message_editor.adjust_width(false, true)
    let user_list = new Rolling('#user-list')
    user_list.control_step()
    user_list.adjust_width(true, false)
})

// ========== Draw dividers and keep layout aligned ==========
$(window).resize(function(event) {
    console.log('window resize');

    // in order to use rem unit
    let fs = Number($('html').css('font-size').slice(0,-2))

    // make the height of message-pane an integral multiple of line-height
    let h_rem = Math.floor(Number($('body').height()-10)/fs)
    h_rem = h_rem % 2 ? h_rem + 1 : h_rem
    $('.main-content').height(`${h_rem}rem`)

    // make the height of tip message wrappers an integral multiple of line-height
    $('.message-wrapper').each(function(index, ele) {
        ele = $(ele)
        limit_height(ele,fs)
    })

    // set textarea placeholder vertical alignment
    $('head').append(`<style type="text/css">textarea::placeholder {line-height:${$('#send-my-message').height()}px !important;}</style>`)

    // layout alignment
    $('.function-pane').width($('.message-time').width())

    // draw left divider
    $('.left-divider').remove()
    let left_d1 = $('.message-content').offset().left - 15 - 4
    let top_d1 = $('.main-content').offset().top
    let s1 = `<div class="left-divider" style="top:${top_d1}px;left:${left_d1}px;">`
    s1 += '▎<br>'.repeat(h_rem/2)
    s1 += '</div>'
    $('body').append(s1)
    // draw right divider
    $('.right-divider').remove()
    let left_d2 = $('.user-pane').offset().left - 15 - 4
    let top_d2 = $('.rightbar').offset().top
    let s2 = `<div class="right-divider" style="top:${top_d2}px;left:${left_d2}px;">`
    s2 += '▎<br>'.repeat(h_rem/2)
    s2 += '</div>'
    $('body').append(s2)
})

function limit_height(ele,font_size) {
    /*
    here we need to clear old height parameter or it will influence the calculation
    because the calculation need the new natural(not original and not modified by script) height number
    after some layout changes
    */
    ele.height('')
    ele.height(Math.floor(ele.height()/font_size) + 'rem')
}

// ========== scroll control ==========
class Rolling {
    constructor(selector) {
        this.ele = $(selector)
        this.scroll_pos = this.ele.scrollTop()
    }

    // make every scroll step equal to line-height
    control_step() {
        let ele = this.ele
        let scroll_pos = this.scroll_pos
        let step = Number($('body').css('line-height').slice(0,-2))
        ele.scroll(function(event) {
            console.log('before:', scroll_pos, 'now:', ele.scrollTop())
            if (ele.scrollTop() > scroll_pos) {
                scroll_pos += step
                while (ele.scrollTop() > scroll_pos) {
                    scroll_pos += step
                }
                console.log('+')
            } else if (ele.scrollTop() < scroll_pos){
                scroll_pos -= step
                while (ele.scrollTop() < scroll_pos) {
                    scroll_pos -= step
                }
                console.log('-')
            }
            ele.scrollTop(scroll_pos)
            console.log('*',ele.scrollTop())
        })
    }

    adjust_width(resize_detection, retreat_detection) {
        let ele = this.ele
        let timer = setInterval(function() {
            if (ele[0].scrollHeight > ele[0].clientHeight) {
                // wider than 100%(parent element) to make the vertical scroll bar hidden
                ele.width('calc(100% + 16px)')
                ele.css('overflow-y', 'auto')

                if (resize_detection) {
                    $(window).resize()
                }

                if (!retreat_detection) {
                    clearInterval(timer)
                }
            } else if (retreat_detection) {
                ele.css('overflow-y', 'hidden')
                ele.width('100%')
            }
        }, 500)
    }
}
