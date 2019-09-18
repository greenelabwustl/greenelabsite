from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from .models import *

# homepage
def home_page(request):
    return render(request, 'common/home.html')

# lab member page
def people_page(request):
    # Get all lab members
    members = lab_member.objects.all().exclude(alumni=True).exclude(trainees=True).order_by('position')
    alumni = lab_member.objects.all().filter(alumni=True).order_by('position')
    trainees = lab_member.objects.all().filter(trainees=True).order_by('position')
    return render(request, 'common/people.html', {'members': members, 'alumni': alumni, 'trainees': trainees})

# research
def research_page(request):
    return render(request, 'common/research.html')

# publications
def publications_page(request):
    publications = publication.objects.all().order_by('-date')
    dateobjs = publication.objects.dates('date','year',order='DESC')
    years = [date.year for date in dateobjs]
    return render(request, 'common/publications.html',{'publications':publications,'years': years})

def participate_page(request):
    studies = current_study.objects.all()
    return render(request, 'common/participate.html',{'studies': studies})

# data/software
def data_page(request):
    data = data_listing.objects.all().order_by('title')
    software = software_listing.objects.all().order_by('title')
    return render(request, 'common/data_software.html', {'data': data, 'software': software})

# jobs
def jobs_page(request):
    return render(request, 'common/join_us.html')

# directions
def directions_page(request):
    return render(request, 'common/directions.html')

# contact
def contact_page(request):
    return render(request, 'common/contact.html')
