// initial
let date = new Date()
console.log(date);
let init_time = '%Y-%m-%d %H:%M:%S'
let add_zero = s => String(s).length === 2 ? s : '0' + String(s)
init_time = init_time.replace('%Y', date.getFullYear())
init_time = init_time.replace('%m', add_zero(date.getMonth() + 1))
init_time = init_time.replace('%d', add_zero(date.getDate()))
init_time = init_time.replace('%H', add_zero(date.getHours()))
init_time = init_time.replace('%M', add_zero(date.getMinutes()))
init_time = init_time.replace('%S', add_zero(date.getSeconds()))
$('.message-time').text(init_time)
init_time += String(date.getMilliseconds())
$('.message-wrapper').attr('id', init_time)

// ========== get messages ==========
function get_messages() {
    $.ajax({
        url: '/get_messages',
        method: 'GET',
        dataType: 'json',
        data: {last_message_time: $('.message-wrapper').slice(-1)[0].id},
        timeout: 60000, // long polling
    })
    .done(function(messages) {
        console.log('get_messages SUCCESS');
        messages.forEach(function(message) {
            let time_str = `<div id="${message.time}" class="message-wrapper"><div class="message-time">${message.time.split('.')[0]}</div>`
            let content_str = `<div class="message-content"><span class="user-name">${message.sender}</span>`
            content_str += `@<span class="user-ip">${message.sender_ip}</span>`
            content_str += ` : <span class="message-text">${message.text}</span></div></div>`
            $('#message-list').append(time_str + content_str)
        })
        // scroll to bottom
        $('#message-list').scrollTop($('#message-list')[0].scrollHeight)

        get_messages() // Automatically re-query
    })
    .fail(function(xhr, status) {
        if (status === 'timeout') {
            console.log('get_messages timeout');

            get_messages() // Automatically re-query
        } else {
            console.log("get_messages ERROR", xhr.status, ':', status);
        }
    })
}
get_messages()

// ========== send my message ==========
$('#message-editor').keydown(function(event) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault() /*prevent wrapping automatically*/
        if (detect_name('#name-editor')) {
            $('input[name=name]').val($('#name-editor').text())
        } else {
            return
        }
        get_my_ip()

        let message_editor = $(this)
        let message_text = message_editor.html()
        if (message_text.length > 1000) {
            alert('Your message can not be longer than 1000 characters!')
            message_editor.html(message_text.substr(0,1000))
            return
        }
        $('#send-my-message').submit()
        $('#message-list').append(message_text)
        message_editor.blur() /*stop focusing*/
    }
})
$('#send-my-message').submit(function(event) {
    event.preventDefault() /* prevent page jump*/
    let form = $(this)
    $.ajax({
        url: '/send_my_message',
        method: 'POST',
        dataType: 'html',
        data: form.serialize()
    })
    .done(function(response) {
        console.log("send my message SUCCESS");
        // alert(response)
    })
    .fail(function() {
        console.log("send my message ERROR");
    })
})
