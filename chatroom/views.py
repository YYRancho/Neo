# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
import time
import random

def get_chatroom(request):
    return render(request, 'chatroom/chatroom.html')

def get_messages(request):
    messages = request.GET.get('param1')
    foo = random.uniform(1,3)
    time.sleep(foo)
    return HttpResponse('{"param1":"%s"}' % messages)
