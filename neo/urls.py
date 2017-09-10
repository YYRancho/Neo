"""neo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from blog import views as blog_view
from chatroom import views as chatroom_view

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^blog$', blog_view.home),
    url(r'^test/article$', blog_view.test),
    url(r'^animation$', blog_view.animation),
    url(r'^$', chatroom_view.get_chatroom),
    url(r'^get_my_ip$', chatroom_view.get_my_ip),
    url(r'^get_messages$', chatroom_view.get_messages),
    url(r'^send_my_message$', chatroom_view.send_my_message),
    url(r'^upload_my_file$', chatroom_view.upload_my_file),
    url(r'^get_users$', chatroom_view.get_users),
]
