# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse

import os
import re
import json

# Create your views here.

def get_cinema(request):
    return render(request, 'cinema/cinema.html')

def get_repo(request):
    # Determine it is in development mode or in deployment mode
    path = './static/storage/'
    if not os.path.exists(path):
        path = './cinema/static/storage/'

    repo_list = []
    repo_name_list = os.listdir(path)
    for repo_name in repo_name_list:
        if not os.path.isdir(path + repo_name):
            continue

        for file_name in os.listdir(path + repo_name):
            if re.search(r'.*?json$', file_name):
                with open(path + '{}/{}'.format(repo_name, file_name), 'r') as f:
                    repo = json.loads(f.read())
                repo_list.append(repo)

    return HttpResponse(json.dumps(repo_list))
