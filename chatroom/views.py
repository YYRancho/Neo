# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from chatroom.models import User
from chatroom.models import Message

import json
import datetime
import time
import random

def get_chatroom(request):
    return render(request, 'chatroom/chatroom.html')

def get_my_ip(request):
    return HttpResponse(request.META['REMOTE_ADDR'])

def get_messages(request):
    start_time = datetime.datetime.now() # prevent long polling occupying too much resource
    message_list = []
    while len(message_list) == 0 and (datetime.datetime.now()-start_time).seconds < 60:
        last_message_time = request.GET.get('last_message_time')
        messages = Message.objects.raw('SELECT id, sender, sender_ip, time, text FROM chatroom_message WHERE time>"%s"' % last_message_time)
        message_list = [{"time": message.time.strftime('%Y-%m-%d %H:%M:%S.%f'), "sender": message.sender, "sender_ip": message.sender_ip, "text": message.text} for message in messages]
        if len(message_list) > 0:
            break
        time.sleep(1)
    return HttpResponse(json.dumps(message_list))

def send_my_message(request):
    entered_message = request.POST['entered-message']
    name = request.POST['name']
    ip = request.POST['ip']
    Message.objects.create(time=datetime.datetime.now(),sender=name,sender_ip=ip,text=entered_message)
    return HttpResponse('The message was sent successfully!\nSender : %s@%s\nMessage text : %s' % (name,ip,entered_message))


def get_users(request):
    users = User.objects.raw('SELECT id, name, ip FROM chatroom_user')
    user_list = [{"name": user.name, "ip": user.ip} for user in users]
    return HttpResponse(json.dumps(user_list))
