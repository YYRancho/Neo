# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from chatroom.models import User

import random
import string
import datetime
import time

for i in range(10):
    name = ''.join(random.sample(string.ascii_letters, random.randint(4,12))).capitalize()
    ip = '10.199.%s.%s' % (random.randint(10,100), random.randint(100,255))
    print name, ip
    User.objects.create(name=name,ip=ip,creation_time=datetime.datetime.now())
    time.sleep(1)
