FROM python:3.8-slim

RUN apt-get update && apt-get install -y \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

ADD . /app
WORKDIR /app
RUN pip install -U --force-reinstall pip
RUN pip install -r requirements.txt
RUN python manage.py collectstatic --noinput

ENTRYPOINT [ "/usr/local/bin/gunicorn", "-b", "0.0.0.0:8000", "--workers", "4", "labsite.wsgi" ] 
