# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from chatroom.models import User
from chatroom.models import Message

import json
import time
import random

def get_chatroom(request):
    return render(request, 'chatroom/chatroom.html')

def get_messages(request):
    receiver = request.GET.get('param1')

    foo = random.uniform(1,3)
    # time.sleep(foo)

    users = User.objects.raw('SELECT id, name, ip, creation_time FROM chatroom_user')
    user_list = [{"name": user.name, "ip": user.ip, "creation_time": user.creation_time,} for user in users]

    messages = Message.objects.raw('SELECT id, sender, sender_ip, time, text FROM chatroom_message')
    message_list = [{"time": message.time.strftime('%Y-%m-%d %H:%M:%S'), "sender": message.sender, "sender_ip": message.sender_ip, "text": message.text} for message in messages]
    return HttpResponse(json.dumps(random.sample(message_list,1)))

def get_users(request):
    users = User.objects.raw('SELECT id, name, ip FROM chatroom_user')
    user_list = [{"name": user.name, "ip": user.ip} for user in users]
    return HttpResponse(json.dumps(user_list))

def update_my_name(request):
    entered_name = request.GET.get('entered-name')
    return HttpResponse('Update success!\nNew name : %s' % entered_name)
