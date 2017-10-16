# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.

def tetris(request):
    return render(request, 'game/tetris.html')
