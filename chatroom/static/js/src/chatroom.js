'use strict';

// ========== get user list ==========
function get_users() {
    $.ajax({
        url: '/chatroom_api/get_users',
        type: 'GET',
        dataType: 'json',
        data: {param1: 'value1'},
    })
    .done(function(users) {
        console.log("get_users SUCCESS");
        users.forEach(function(user) {
            $('#user-list').append(`<div class="user-wrapper"><span class="user-name">${user.name}</span>@<span class="user-ip">${user.ip}</span></div>`)
        })
        $(window).resize()
    })
    .fail(function(xhr, status) {
        console.log("get_users FAIL:", xhr.status, status, '\n', error);
    })
}
get_users()

// generate random string
// let random_str = Math.random().toString(36).substr(2) + ' '
// for (let i = 0; i < 6; i++) {
//     random_str += Math.random().toString(36).substr(2) + ' '
// }
// $('textarea').val(random_str)

// ========== function pane ==========
$('#scroll-top').click(function(event) {
    this.blur()
    $('#message-list').scrollTop(0)
})
$('#scroll-bottom').click(function(event) {
    this.blur()
    $('#message-list').scrollTop($('#message-list')[0].scrollHeight)
})
$('#clear').click(function(event) {
    this.blur()
    $('#message-list').empty()
})
