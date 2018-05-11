from django.urls import path
from . import views

app_name = 'common'
urlpatterns = [
    path('', views.home_page, name='homepage'),
    path('lab_members', views.people_page, name='people'),
    path('research', views.research_page, name='research'),
    path('publications', views.publications_page, name='publications'),
    path('participate', views.participate_page, name='participate'),
    path('data_software', views.data_page, name='datasoftware'),
    path('directions', views.directions_page, name='directions'),
    path('contact', views.contact_page, name='contact')
]
