# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from chatroom.models import User
from chatroom.models import Message

import json
import datetime
import time

import user_agents

def get_chatroom(request):
    if request.META.has_key('HTTP_USER_AGENT'):
        user_agent = user_agents.parse(request.META['HTTP_USER_AGENT'])
        if user_agent.is_mobile or user_agent.is_tablet:
            return render(request, 'chatroom/chatroom_mobile.html')

    return render(request, 'chatroom/chatroom.html')

def get_my_ip(request):
    return HttpResponse(request.META['REMOTE_ADDR'])

def get_messages(request):
    start_time = datetime.datetime.now() # prevent long polling occupying too much resource
    message_list = []
    while len(message_list) == 0 and (datetime.datetime.now()-start_time).seconds < 35:
        last_message_time = request.GET.get('last_message_time')
        messages = Message.objects.raw('SELECT id, sender, sender_ip, time, text FROM chatroom_message WHERE time>"%s"' % last_message_time)
        message_list = [{"time": message.time.strftime('%Y-%m-%d %H:%M:%S.%f'), "sender": message.sender, "sender_ip": message.sender_ip, "is_file": message.is_file, "text": message.text} for message in messages]
        if len(message_list) > 0:
            break
        else:
            time.sleep(0.1)
    return HttpResponse(json.dumps(message_list))

def send_my_message(request):
    entered_message = request.POST['entered-message']
    name = request.POST['name']
    ip = request.POST['ip']
    Message.objects.create(time=datetime.datetime.now(),sender=name,sender_ip=ip,is_file=False,text=entered_message)
    return HttpResponse('The message was sent successfully!\nSender : %s@%s\nMessage text : %s' % (name,ip,entered_message))

@csrf_exempt
def upload_my_file(request):
    user_name = request.POST['user_name']
    ip = request.POST['ip']
    file_name = request.FILES['file'].name
    with open('media/'+file_name,'w') as f:
        for chunk in request.FILES['file'].chunks(chunk_size = 10*1024*1024):
            f.write(chunk)
    Message.objects.create(time=datetime.datetime.now(),sender=user_name,sender_ip=ip,is_file=True,text=file_name)
    return HttpResponse('The file was uploaded successfully!\nSender : %s@%s\nContent : %s' % (user_name, ip, file_name))

def get_users(request):
    users = User.objects.raw('SELECT id, name, ip FROM chatroom_user')
    user_list = [{"name": user.name, "ip": user.ip} for user in users]
    return HttpResponse(json.dumps(user_list))
