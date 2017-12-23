# -*- coding: utf-8 -*-
import os
import re
import requests
import json

for repo_name in os.listdir('.'):
    # repo_name is the directory name, not equal to repo['name']
    if os.path.isdir(repo_name):
        if '{}.json'.format(repo_name) in os.listdir('./' + repo_name):
            print('{} skip!'.format(repo_name))
        else:
            print('{} begins......'.format(repo_name))

            repo = {}

            video_list = []
            for file_name in os.listdir('./' + repo_name):
                if re.search(r'.*?mp4$', file_name):
                    video_list.append(file_name)

            if len(video_list) != 0:

                if len(video_list) == 1:
                    repo['video'] = '/static/storage/{}/{}'.format(repo_name, video_list[0])
                else:
                    video_list.sort()
                    repo['video'] = ['/static/storage/{}/{}'.format(repo_name, video) for video in video_list]

                headers = {'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/47.0.2526.106 Chrome/47.0.2526.106 Safari/537.36'}
                res = requests.get('https://www.douban.com/search?q=' + repo_name, headers=headers)
                raw_douban_link = re.findall(r'<div class="title">[\s\S]*?<a href="(http.*?)"', res.content)[0]

                res = requests.get(raw_douban_link, headers=headers)
                repo['douban_link'] = res.url # get the redirected link
                repo['name'] = ' '.join(re.findall('h1[\s\S]*?<span.*?>(.*?)</span>[\s\S]*?<span class="year">(.*?)</span>', res.text)[0])

                poster_url = re.findall(r'h1[\s\S]*?<img src="(http.*?)"', res.content)[0]
                res = requests.get(poster_url, headers=headers)
                format_postfix = re.findall(r'.*?(\.[a-zA-Z]+)$', poster_url)[0]
                with open('./{}/{}'.format(repo_name, repo_name + format_postfix), 'wb') as f:
                    f.write(res.content)
                repo['poster'] = '/static/storage/{}/{}'.format(repo_name, repo_name + format_postfix)

                with open('./{}/{}.json'.format(repo_name, repo_name), 'w') as f:
                    json.dump(repo, f)
                    print('{} done! [New]'.format(repo_name))
            else:
                print('No mp4 found!')
