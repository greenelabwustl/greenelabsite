#!/bin/bash
gunicorn labsite.wsgi --bind=127.0.0.1:5001 -w 4 -D
