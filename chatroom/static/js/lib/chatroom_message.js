'use strict';

// initial time

$(document).ready(function () {
    var time_now = format_time_now();
    $('.message-time').text(time_now.split('.')[0]);
    $('.message-wrapper').attr('id', time_now);

    get_messages();
});

function format_time_now() {
    var date = new Date();
    var time_now = '%Y-%m-%d %H:%M:%S';
    var add_zero = function add_zero(s) {
        return String(s).length === 2 ? s : '0' + String(s);
    };
    time_now = time_now.replace('%Y', date.getFullYear());
    time_now = time_now.replace('%m', add_zero(date.getMonth() + 1));
    time_now = time_now.replace('%d', add_zero(date.getDate()));
    time_now = time_now.replace('%H', add_zero(date.getHours()));
    time_now = time_now.replace('%M', add_zero(date.getMinutes()));
    time_now = time_now.replace('%S', add_zero(date.getSeconds()));
    time_now += '.' + String(date.getMilliseconds());
    return time_now;
}

// ========== get messages ==========
function get_messages() {
    $.ajax({
        url: '/get_messages',
        method: 'GET',
        dataType: 'json',
        data: { last_message_time: $('.message-wrapper').slice(-1)[0].id },
        timeout: 60000 // long polling
    }).done(function (messages) {
        console.log('get_messages SUCCESS');
        messages.forEach(function (message) {
            var time_str = '<div id="${message.time}" class="message-wrapper">';
            // determine whether the new message is sent by user self
            if ($('#name-editor').text() === message.sender && $('#my-ip').text() === message.sender_ip) {
                time_str += '<div id="' + message.time + '" class="message-wrapper"><div class="message-time">' + message.time.split('.')[0].split(' ')[1];
                time_str += '&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                time_str += '<span class="message-arrow">\u27A2\u27A3\u27A4</span></div>';
            } else {
                time_str += '<div id="' + message.time + '" class="message-wrapper"><div class="message-time">' + message.time.split('.')[0] + '</div>';
            }

            var content_str = '<div class="message-content"><span class="user-name">' + message.sender + '</span>';
            content_str += '@<span class="user-ip">' + message.sender_ip + '</span>';
            // determine whether the new message is file uploading
            if (message.is_file) {
                content_str += ' : <span class="message-text"><span class="mark">UPLOAD</span> <a class="uploaded-file" href="static/upload/' + message.text + '">' + message.text + '</a></span></div></div>';
            } else {
                content_str += ' : <span class="message-text">' + message.text + '</span></div></div>';
            }

            $('#message-list').append(time_str + content_str);

            // limit the height of the new message
            var fs = Number($('html').css('font-size').slice(0, -2));
            var ele = $($('#message-list').children().slice(-1)[0]);
            limit_height(ele, fs);
        });
        // scroll to bottom
        $('#message-list').scrollTop($('#message-list')[0].scrollHeight);

        get_messages(); // Automatically re-query
    }).fail(function (xhr, status, error) {
        if (status === 'timeout') {
            console.log('get_messages timeout');

            get_messages(); // Automatically re-query
        } else {
            console.log("get_messages FAIL:", xhr.status, status, '\n', error);
        }
    });
}

// ========== send my message ==========
$('#message-editor').keydown(function (event) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault(); /*prevent wrapping automatically*/
        if (detect_name('#name-editor')) {
            $('input[name=name]').val($('#name-editor').text());
        } else {
            return;
        }
        get_my_ip();

        var message_editor = $(this);
        var message_text = message_editor.val();
        if (message_text.length > 1000) {
            alert('Your message can not be longer than 1000 characters!');
            message_editor.val(message_text.substr(0, 1000));
            return;
        }
        $('#send-my-message').submit();
    }
});
$('#send-my-message').submit(function (event) {
    event.preventDefault(); /* prevent page jump*/
    var form = $(this);
    $.ajax({
        url: '/send_my_message',
        method: 'POST',
        data: form.serialize()
    }).done(function (response) {
        console.log("send my message SUCCESS");
        $('#message-editor').val("");
    }).fail(function (xhr, status, error) {
        console.log("send my message FAIL:", xhr.status, status, '\n', error);
    });
});
//# sourceMappingURL=chatroom_message.js.map