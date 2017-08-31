function get_messages() {
    $.ajax({
        url: '/get_messages',
        method: 'GET',
        dataType: 'json',
        data: {param1: 'value1'},
        timeout: 2000,
    })
    .done(function(messages) {
        console.log(messages);
        get_messages()
    })
    .fail(function(xhr, status) {
        console.log("error");
        console.log(xhr.status + ': ' + status);
    })
}
