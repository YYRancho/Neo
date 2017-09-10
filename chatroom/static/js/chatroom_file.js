$('textarea').on('drop', function(event) {
    event.preventDefault();
    $(this).removeClass('file-area')

    let files = event.originalEvent.dataTransfer.files
    for (let file of files) {
        if (file.size > 30*1024*1024) { // judge whether file size > 1024K(10M)
            alert('The file size should not exceed 10M!')
            return
        }
        let fr = new FileReader()
        // make file data Base64 encoded(from binary to ascii), in order to facilitate the transmission
        fr.readAsDataURL(file)
        fr.onload = function(e) {
            upload_my_file(file.name, /data.*?base64,(.*)/g.exec(fr.result).slice(-1)[0])
        }
        fr.onerror = function(e) {
            alert('Only support uploading files but not uploading any file folder!')
        }
    }
})
$('textarea').on('dragenter', function(event) {
    event.preventDefault();
    $(this).addClass('file-area')
})
$('textarea').on('dragleave', function(event) {
    event.preventDefault();
    $(this).removeClass('file-area')
})

function upload_my_file(file_name, file_content) {
    if (detect_name('#name-editor')) {
        $('input[name=name]').val($('#name-editor').text())
    } else {
        return
    }
    get_my_ip()

    $.ajax({
        url: '/upload_my_file',
        method: 'POST',
        data: {
            user_name: $('#name-editor').text(),
            ip: $('#my-ip').text(),
            file_name: file_name,
            file_content: file_content,
        },
    })
    .done(function(response) {
        console.log("upload my file SUCCESS");
        console.log(response);
    })
    .fail(function(xhr, status) {
        console.log("upload my file FAIL", xhr.status, ':', status);
    })
}
