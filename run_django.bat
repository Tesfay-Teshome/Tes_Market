@echo off
set PYTHONPATH=E:\Tes Market\Tes_Market;E:\Tes Market\Tes_Market\backend
set DJANGO_SETTINGS_MODULE=backend.config.settings
venv\Scripts\python.exe manage.py runserver
