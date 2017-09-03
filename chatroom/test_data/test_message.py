# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from chatroom.models import User
from chatroom.models import Message

import random
import string
import datetime
import time

count = 30
senders = [{'name':user.name, 'ip':user.ip} for user in User.objects.raw("SELECT id, name, ip FROM chatroom_user")]
for i in range(count):
    user = random.sample(senders, 1)[0]
    sender = user['name']
    sender_ip = user['ip']
    random_str = ''.join([random.sample(string.ascii_letters+string.digits,1)[0] for i in range(random.randint(10,150))])
    text = "Hello, I'm %s. This a random string: %s" % (sender, random_str)
    Message.objects.create(time=datetime.datetime.now(),sender=sender,sender_ip=sender_ip,text=text)
    time.sleep(1)
