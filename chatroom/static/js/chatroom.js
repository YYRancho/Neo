// ========== get user list ==========
function get_users() {
    $.ajax({
        url: '/get_users',
        type: 'GET',
        dataType: 'json',
        data: {param1: 'value1'},
    })
    .done(function(users) {
        console.log("get_users SUCCESS");
        users.forEach(function(user) {
            $('#user-list').append(`<div class="user-wrapper"><span class="user-name">${user.name}</span>@<span class="user-ip">${user.ip}</span></div>`)
        })
    })
    .fail(function(xhr, status) {
        console.log("get_users ERROR", xhr.status, ':', status);
    })
}
get_users()

// generate random string
let random_str = Math.random().toString(36).substr(2) + ' '
for (let i = 0; i < 6; i++) {
    random_str += Math.random().toString(36).substr(2) + ' '
}
$('textarea').val(random_str)
