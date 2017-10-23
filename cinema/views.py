# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.

def get_cinema(request):
    return render(request, 'cinema/cinema.html')
