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
from guide import views as guide_view
from blog import views as blog_view
from chatroom import views as chatroom_view
from game import views as game_view
from cinema import views as cinema_view

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', guide_view.guide),

    url(r'^blog$', blog_view.home),
    url(r'^blog/article$', blog_view.test),

    url(r'^chatroom$', chatroom_view.get_chatroom),
    url(r'^chatroom_api/get_my_ip$', chatroom_view.get_my_ip),
    url(r'^chatroom_api/get_messages$', chatroom_view.get_messages),
    url(r'^chatroom_api/send_my_message$', chatroom_view.send_my_message),
    url(r'^chatroom_api/upload_my_file$', chatroom_view.upload_my_file),
    url(r'^chatroom_api/get_users$', chatroom_view.get_users),

    url(r'^game/tetris$', game_view.tetris),

    url(r'^cinema$', cinema_view.get_cinema),
]
