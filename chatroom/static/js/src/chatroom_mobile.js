// Rewrite some functions

// limit_height is cited in chatroom_message.js
function limit_height() {}

// format_message is cited in chatroom_message.js
function format_message(message) {
    let sender_flag
    // determine whether the new message is sent by the user self
    if ($('#name-editor').text() === message.sender && $('#my-ip').text() === message.sender_ip) {
        sender_flag = true
    } else {
        sender_flag = false
    }

    let content_str = '<div class="message-content">'
    if (sender_flag) {
        content_str += '<span class="user-name message-arrow">➢➣➤</span>'
    } else {
        content_str += `<span class="user-name">${message.sender.replace(/ \(guest\)/g, '')}</span>`
    }
    // determine whether the new message is file uploading
    if (message.is_file) {
        content_str += ` : <span class="message-text"><span class="mark">UPLOAD</span> <a href="static/upload/${message.text}">${message.text}</a></span></div></div>`
    } else {
        content_str += ` : <span class="message-text">${message.text}</span></div></div>`
    }
    // process format
    // process '\n'
    content_str = content_str.replace(/\n/g, '<br/>')
    // process url
    let url_reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:)+)/g
    content_str = content_str.replace(url_reg, '<a href="$1$2">$1$2</a>')
    // make all links open in a new tab
    content_str = content_str.replace(/<a(.*?)>/g, '<a target="_blank" $1>')

    let time_str = ''
    time_str += `<div id="${message.time}" class="message-wrapper"><div class="message-time">${message.time.split('.')[0]}</div>`
    // notify if the current tab is not active
    if (!active_flag && !sender_flag) {
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
    return time_str + content_str
}
