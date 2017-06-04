# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.

def home(request):
    home_url = 'http://127.0.0.1:8000'
    return render(request, 'blog/home.html', {'home_url': home_url})
