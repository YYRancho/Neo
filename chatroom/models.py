# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class User(models.Model):
    name = models.CharField(max_length=30)
    ip = models.GenericIPAddressField()
    creation_time = models.DateTimeField(auto_now=False,auto_now_add=True)

    def __unicode__(self):
        return '%s(%s) %s' % (self.name, self.ip, self.creation_time)

class Message(models.Model):
    time = models.DateTimeField(auto_now=False,auto_now_add=True)
    sender = models.CharField(max_length=30)
    sender_ip = models.GenericIPAddressField()
    text = models.CharField(max_length=1000)

    def __unicode__(self):
        return '%s %s(%s): %s' % (self.time, self.sender, self.sender_ip, self.text)
