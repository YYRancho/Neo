# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.

def home(request):
    home_url = ''
    return render(request, 'blog/home.html', {'home_url': home_url})

def test(request):
    return render(request, 'blog/article_test.html')

def animation(request):
    return render(request, 'blog/animation.html')
