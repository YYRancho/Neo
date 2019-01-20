'use strict';

$(document).ready(function() {
    let time_now = format_time_now()
    $('.message-time').text(time_now.split('.')[0])
    $('.message-wrapper').attr('id', time_now)

    get_messages()
})

// initial time
function format_time_now() {
    let date = new Date()
    let time_now = '%Y-%m-%d %H:%M:%S'
    let add_zero = s => String(s).length === 2 ? s : '0' + String(s)
    time_now = time_now.replace('%Y', date.getFullYear())
    time_now = time_now.replace('%m', add_zero(date.getMonth() + 1))
    time_now = time_now.replace('%d', add_zero(date.getDate()))
    time_now = time_now.replace('%H', add_zero(date.getHours()))
    time_now = time_now.replace('%M', add_zero(date.getMinutes()))
    time_now = time_now.replace('%S', add_zero(date.getSeconds()))
    time_now += '.' + String(date.getMilliseconds())
    return time_now
}

// determine whether the current tab is active
let active_flag = true
window.onfocus = function() {
    active_flag = true
}
window.onblur = function() {
    active_flag = false
}

// ========== get messages ==========
function get_messages() {
    $.ajax({
        url: '/chatroom_api/get_messages',
        method: 'GET',
        dataType: 'json',
        data: {last_message_time: $('.message-wrapper').slice(-1)[0].id},
        timeout: 30000, // long polling
    })
    .done(function(messages) {
        console.log('get_messages SUCCESS');
        messages.forEach(function(message) {
            $('#message-list').append(format_message(message))

            // limit the height of the new message
            let fs = Number($('html').css('font-size').slice(0,-2))
            let ele = $($('#message-list').children().slice(-1)[0])
            limit_height(ele,fs)
        })
        // scroll to bottom
        $('#message-list').scrollTop($('#message-list')[0].scrollHeight)

        get_messages() // Automatically re-query
    })
    .fail(function(xhr, status, error) {
        if (status === 'timeout') {
            console.log('get_messages timeout');

            get_messages() // Automatically re-query
        } else {
            console.log("get_messages FAIL:", xhr.status, status, '\n', error);
        }
    })
}
function format_message(message) {
    let content_str = `<div class="message-content"><span class="user-name">${message.sender}</span>`
    content_str += `@<span class="user-ip">${message.sender_ip}</span>`
    // determine whether the new message is file uploading
    if (message.is_file) {
        content_str += ` : <span class="message-text"><span class="mark">UPLOAD</span> <a href="media/${message.text}">${message.text}</a></span></div></div>`
    } else {
        content_str += ` : <span class="message-text">${message.text}</span></div></div>`
        // process url
        let url_reg = /((https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g
        content_str = content_str.replace(url_reg, '<a href="$1">$1</a>')
        // make all links open in a new tab
        content_str = content_str.replace(/<a(.*?)>/g, '<a target="_blank" $1>')
    }

    // process '\n'
    content_str = content_str.replace(/\n/g, '<br/>')

    let time_str = ''
    // determine whether the new message is sent by the user self
    if ($('#name-editor').text() === message.sender && $('#my-ip').text() === message.sender_ip) {
        time_str += `<div id="${message.time}" class="message-wrapper"><div class="message-time">${message.time.split('.')[0].split(' ')[1]}`
        time_str += '&nbsp;'.repeat(12)
        time_str += `<span class="message-arrow">➢➣➤</span></div>`
    } else {
        time_str += `<div id="${message.time}" class="message-wrapper"><div class="message-time">${message.time.split('.')[0]}</div>`
        // notify if the current tab is not active
        if (!active_flag) {
            Push.create(`${message.sender}@${message.sender_ip}`, {
                body: message.text,
                icon: '/static/images/Neo-96.png',
                timeout: 6000,
                onClick: function() {
                    window.focus()
                    this.close()
                }
            })
        }
    }

    return time_str + content_str
}

// ========== send my message ==========
$('#message-editor').keydown(function(event) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault() /*prevent wrapping automatically*/
        $('#send-my-message').submit()
    }
})
$('#send-my-message').submit(function(event) {
    event.preventDefault() /* prevent page jump*/

    let message_editor = $('#message-editor')
    let message_text = message_editor.val()
    if (message_text.length > 1000) {
        alert('Your message can not be longer than 1000 characters!')
        message_editor.val(message_text.substr(0,1000))
        return
    }
    if (message_text.length == 0) {
        alert('Blank text can not be sent!')
        return
    }

    if (detect_name('#name-editor')) {
        $('input[name=name]').val($('#name-editor').text())
    } else {
        return
    }
    get_my_ip()

    let form = $(this)
    $.ajax({
        url: '/chatroom_api/send_my_message',
        method: 'POST',
        data: form.serialize()
    })
    .done(function(response) {
        console.log("send my message SUCCESS");
        $('#message-editor').val("")
    })
    .fail(function(xhr, status, error) {
        console.log("send my message FAIL:", xhr.status, status, '\n', error);
    })
})
