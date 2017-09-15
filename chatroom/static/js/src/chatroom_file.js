'use strict';

$('textarea').on('drop', function(event) {
    event.preventDefault();
    $(this).removeClass('file-area')
    $('.fa-upload').remove()

    let files = event.originalEvent.dataTransfer.files
    for (let file of files) {
        if (file.size > 200*1024*1024) { // judge whether file size > 200M
            alert('The file size should not exceed 30M!')
            return
        }

        // show progress bar
        let id = Math.random().toString(36).substr(2) // use unique id to recognize different files
        $('#message-list').append(`<div id=${id} class="message-wrapper"></div>`)
        let time_now = format_time_now()
        $(`#${id}`).append(`<div class="message-time">${time_now.split('.')[0]}</div>`)
        $(`#${id}`).append(`<div class="message-content"><span class="mark">READING...</span></div>`)
        $(`#${id} .message-content`).append(`<progress max="100" value="0"></progress>`)

        // user FileReader to determine whether it is a file folder
        let fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = function(e) {
            upload_my_file(file, id)
        }
        fr.onerror = function(e) {
            alert('Only support uploading files but not uploading any file folder!')
        }
    }
})
$('textarea').on('dragenter', function(event) {
    console.log('dragenter');
    event.preventDefault();
    $(this).addClass('file-area')
    $('#send-my-message').append('<i class="fa fa-upload fa-5x" style="position:absolute;"></i>')
    $('.fa-upload').css({
        'left': $('textarea').offset()['left'] + 0.5*$('textarea').width() - 0.5*$('.fa-upload').width() + 'px',
        'top': $('textarea').offset()['top'] + 0.5*$('textarea').height() - 0.5*$('.fa-upload').height() + 'px',
    })
})
$('textarea').on('dragleave', function(event) {
    console.log('dragleave');
    event.preventDefault();
    $(this).removeClass('file-area')
    $('.fa-upload').remove()
})
$('textarea').on('dragover', function(event) {
    console.log('dragover');
    event.preventDefault();
})

function upload_my_file(file, id) {
    let fd = new FormData()
    fd.append('user_name',$('#name-editor').text())
    fd.append('ip',$('#my-ip').text())
    fd.append('file',file)

    $.ajax({
        method: 'POST',
        url: '/upload_my_file',
        data: fd,
        contentType: false,
        processData: false,
        xhr: function() {
            let xhr = $.ajaxSettings.xhr()
            xhr.upload.onloadstart = function(e) {
                $(`#${id} .mark`).text('UPLOADING...')
            }
            xhr.upload.onprogress = function(e) {
                var percent = e.loaded / e.total;
                $(`#${id} .mark`).text('UPLOADING... ' + (percent*100).toFixed(2) + '%')
                $(`progress`).attr('value', percent*100)
                console.log(percent);
            }
            xhr.upload.onload = function(e) {
                $(`#${id} .mark`).text('SAVING...')
            }
            return xhr
        },
    })
    .done(function(response) {
        $(`#${id}`).remove()
        console.log("upload my file SUCCESS");
        console.log(response);
    })
    .fail(function(xhr, status, error) {
        console.log("upload my file FAIL:", xhr.status, status, '\n', error);
    })
}
