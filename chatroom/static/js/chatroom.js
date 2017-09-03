// ========== Draw dividers and keep layout aligned ==========
$(window).resize(function(event) {
    console.log('window resize');

    // layout alignment
    $('.function-pane').width($('.message-time').width())

    // draw left divider
    $('.left-divider').remove()
    let left_d1 = $('.message-content').offset().left - 15 - 4
    let top_d1 = $('.message-content').offset().top
    let s1 = `<div class="left-divider" style="top:${top_d1}px;left:${left_d1}px;">`
    s1 += '▎<br>'.repeat(100)
    s1 += '</div>'
    $('body').append(s1)
    // draw right divider
    $('.right-divider').remove()
    let left_d2 = $('.rightbar').offset().left
    let top_d2 = $('.user-pane').offset().top
    let s2 = `<div class="right-divider" style="top:${top_d2}px;left:${left_d2}px;">`
    s2 += '▎<br>'.repeat(100)
    s2 += '</div>'
    $('body').append(s2)
});
$(window).resize()

// ========== scroll control ==========
let ml_scroll_d = 0
let ul_scroll_d = 0
$('#message-list').scroll(function(event) {
    let ml = $('#message-list')
    let step = Number($('body').css('line-height').slice(0,-2))
    console.log('before:', ml_scroll_d,'now:', ml.scrollTop(), )
    if (ml.scrollTop() > ml_scroll_d) {
        ml_scroll_d += step
        console.log('+', step)
    } else if (ml.scrollTop() < ml_scroll_d){
        ml_scroll_d -= step
        console.log('-', step)
    }
    ml.scrollTop(ml_scroll_d)
    console.log('*',ml.scrollTop())
});
$('#user-list').scroll(function(event) {
    let ul = $('#user-list')
    let step = Number($('body').css('line-height').slice(0,-2))
    console.log('before:', ul_scroll_d,'now:', ul.scrollTop(), )
    if (ul.scrollTop() > ul_scroll_d) {
        ul_scroll_d += step
        console.log('+', step)
    } else if (ul.scrollTop() < ul_scroll_d){
        ul_scroll_d -= step
        console.log('-', step)
    }
    ul.scrollTop(ul_scroll_d)
    console.log('*',ul.scrollTop())
});

// ========== get messages ==========
$('#get_messages').click(function(event) {
    $.ajax({
        url: '/get_messages',
        method: 'GET',
        dataType: 'json',
        data: {param1: 'value1'},
        timeout: 2000,
    })
    .done(function(messages) {
        messages.forEach(function(message) {
            let time_str = `<div class="message-wrapper"><div class="message-time">${message.time}</div>`
            let content_str = `<div class="message-content"><span class="message-sender">${message.sender}</span>`
            content_str += `@<span class="message-sender-ip">${message.sender_ip}</span>`
            content_str += ` : <span class="message-text">${message.text}</span></div></div>`
            $('#message-list').append(time_str + content_str)
        })
        console.log('get_messages success');
        // get_messages()
    })
    .fail(function(xhr, status) {
        if (status === 'timeout') {
            console.log('get_messages timeout');
        } else {
            console.log("get_messages error", xhr.status, ':', status);
        }
    })
});

// ========== get user list ==========
function get_users() {
    $.ajax({
        url: '/get_users',
        type: 'GET',
        dataType: 'json',
        data: {param1: 'value1'},
    })
    .done(function(users) {
        console.log("get_users success");
        users.forEach(function(user) {
            $('#user-list').append(`<div class="user-wrapper"><span class="user-name">${user.name}</span>@<span class="user-ip">${user.ip}</span></div>`)
        })

        $(window).resize()
    })
    .fail(function(xhr, status) {
        console.log("get_users error", xhr.status, ':', status);
    })
}
get_users()

// ========== update my name ==========
$('#name-editor').keydown(function(event) {
    name_editor = $(this)
    if (event.keyCode === 13) {
        event.preventDefault() /*prevent wrapping automatically*/
        $('input[name=entered-name]').val(name_editor.html())
        $('#update-my-name').submit()
        name_editor.blur() /*stop focusing*/
    }
});
$('#update-my-name').submit(function(event) {
    event.preventDefault() /* prevent page jump*/
    let form = $(this)
    $.ajax({
        url: '/update_my_name',
        type: 'GET',
        dataType: 'html',
        data: form.serialize()
    })
    .done(function(response) {
        console.log("update my name success");
        alert(response)
    })
    .fail(function() {
        console.log("update my name error");
    })

});
