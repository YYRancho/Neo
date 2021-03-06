'use strict';

// ========== generate name randomly and get ip ==========
$(document).ready(function() {
    let my_name = Math.random().toString(36).substr(2).replace(/\d/g,'')
    my_name = my_name.substr(0,1).toUpperCase() + my_name.substr(1).toLowerCase()
    my_name += ' (guest)'
    $('#name-editor').text(my_name)
    get_my_ip('#my-ip')
})

// ========== update my name ==========
$('#name-editor').keydown(function(event) {
    if (event.keyCode === 13) {
        event.preventDefault() /*prevent wrapping automatically*/
        if (detect_name('#name-editor')) {
            let my_name = $(this).text()
            console.log("update my name SUCCESS");
            console.log(my_name);
            alert(`Name update completed!\nNew name : ${my_name}`)
        }
        $('#name-editor').blur() /*stop focusing*/
    }
})

function detect_name(selector) {
    let name_editor = $(selector)
    let name_text = name_editor.text()
    if (/[^\w ()]/g.test(name_text.replace(/[\u4E00-\u9FFF]/g,''))) {
        console.log(name_text);
        alert('Name is invalid!')
        name_editor.text(my_name)
        return false
    }
    if (name_text.length > 30) {
        alert('Your name can not be longer than 30 characters!')
        name_editor.text(name_text.substr(0,30))
        return false
    }
    if (name_text.length < 3) {
        alert('Your name is too short!')
        return false
    }
    return true
}

function get_my_ip(selector) {
    $.get('/chatroom_api/get_my_ip')
    .done(function(ip) {
        console.log('get my ip SUCCESS');
        $(selector).text(ip)
        $('input[name=ip]').val(ip)
    })
}
