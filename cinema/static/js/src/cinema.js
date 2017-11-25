'use strict';

function window_resize() {
    $('.poster-hover').css('left', $('.repo').width()/2 - 25 + 'px')
}
$(window).resize(window_resize)

$.get('/cinema_api/get_repo')
.done(function(repo_list) {
    JSON.parse(repo_list).forEach(function(repo) {
        let repo_node = $('<div>').addClass('repo')
        repo_node.append('<img class="poster-hover" src="/static/images/play-red.png" />')
        $('<img>').addClass('poster').attr({
            'src': repo['poster'],
            'onclick': `window.open("${repo['video']}")`,
        }).appendTo(repo_node)
        $('<a>').addClass('name').attr({
            'href': repo['douban_link'],
            'target': '_blank',
        }).html(repo['name']).appendTo(repo_node)

        $('div.showroom').append(repo_node)
    })

    window_resize()
})

$('input').on('input', function() {
    $('.repo').css('display', 'none')

    let keywords = $('#search-keywords').val()
    let keyword_list = keywords.split(/\s/)
    keyword_list.forEach(function(keyword) {
        $('.repo').each(function(index, ele) {
            if (new RegExp(keyword, 'i').test(ele.children[2].text)) {
                ele.style.display = 'inline-block'
            }
        })
    })
})
