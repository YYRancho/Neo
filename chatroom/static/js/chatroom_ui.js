// ========== Draw dividers and keep layout aligned ==========
$(window).resize(function(event) {
    console.log('window resize');

    // set the height of message-pane and my-pane
    let h_rem = Math.floor(Number($('body').height()-10)/16)
    h_rem = h_rem % 2 ? h_rem + 1 : h_rem
    let h1_rem = Math.floor(h_rem*0.70)
    h1_rem = h1_rem % 2 ? h1_rem + 1 : h1_rem
    $('.main-content').height(`${h_rem}rem`)
    $('.message-pane').height(`${h1_rem}rem`)
    $('.my-pane').height(`calc(100% - ${h1_rem}rem)`)

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
});
$(window).resize()

// ========== scroll control ==========
class Rolling {
    constructor(selector) {
        this.ele = $(selector)
        this.scroll_pos = 0
    }

    control_step() {
        let ele = this.ele
        let scroll_pos = this.scroll_pos
        let step = Number($('body').css('line-height').slice(0,-2))
        ele.scroll(function(event) {
            console.log('before:', scroll_pos,'now:', ele.scrollTop())
            if (ele.scrollTop() > scroll_pos) {
                scroll_pos += step
                while (ele.scrollTop() > scroll_pos) {
                    scroll_pos += step
                }
                console.log('+', step)
            } else if (ele.scrollTop() < scroll_pos){
                scroll_pos -= step
                console.log('-', step)
            }
            ele.scrollTop(scroll_pos)
            console.log('*',ele.scrollTop())
        });
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
let message_list = new Rolling('#message-list')
message_list.control_step()
message_list.adjust_width(resize_detection=false, retreat_detection=false)
let message_editor = new Rolling('#message-editor')
message_editor.control_step()
message_editor.adjust_width(resize_detection=false, retreat_detection=true)
let user_list = new Rolling('#user-list')
user_list.control_step()
user_list.adjust_width(resize_detection=true, retreat_detection=false)
