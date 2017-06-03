# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'blog/home.html', {'home_url': 'http://192.168.1.66:8000'})
