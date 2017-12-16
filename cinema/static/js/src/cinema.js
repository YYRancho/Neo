'use strict';

function window_resize() {
    $('.poster-hover').css('left', $('.repo').width()/2 - 25 + 'px')
}
$(window).resize(window_resize)

$.get('/cinema_api/get_repo')
.done(function(repo_list) {
    JSON.parse(repo_list)['repo_list'].forEach(function(repo) {
        let repo_node = $('<div>').addClass('repo')
        repo_node.append('<img class="poster-hover" src="/static/images/play-red.png" />')
        let poster = $('<img>').addClass('poster').attr({
            'src': repo['poster'],
        })
        poster.appendTo(repo_node)

        // link the play link to each poster
        if (typeof repo['video'] == "string") { // condition 1: single video
            poster.click(function() {
                window.open(repo['video'])
            })
        } else { // condition 2: a series of videos(episodes)
            poster.click(function() {
                let episode_wrapper = $('<div>').addClass('episode-wrapper').css('opacity', '0')
                repo['video'].forEach(function(video_link, index) {
                    $('<a>').addClass('episode').html(`Episode ${index+1} - ${repo['name']}`).attr({
                        'href': video_link,
                        'target': '_blank',
                    }).appendTo(episode_wrapper)
                })
                episode_wrapper.appendTo('body')

                // fade in
                episode_wrapper.stop().animate({
                    opacity: 1,
                }, 500)
                // background blur
                $('main').css('filter', 'blur(5px)')
                // when other areas are clicked, the episode-wrapper will disapprear
                $(document).mouseup(function(e){
                    let episode = $('.episode')
                    if(!episode.is(e.target) && episode.has(e.target).length === 0){
                        let episode_wrapper = $('.episode-wrapper')
                        episode_wrapper.stop().animate({
                            opacity: 0,
                        }, 500, () => episode_wrapper.remove())
                        $('main').css('filter', '')
                    }
                });
                // make ios respond to touch events of all elements in body
                if (navigator.userAgent.match((/\(i[^;]+;( U;)? CPU.+Mac OS X/))) {
                    $('body').css('cursor', 'pointer')
                }
            })
        }


        // add the name of each repo
        $('<a>').addClass('name').attr({
            'href': repo['douban_link'],
            'target': '_blank',
        }).html(repo['name']).appendTo(repo_node)

        $('div.showroom').append(repo_node)
    })

    window_resize()
})

// search videos
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
