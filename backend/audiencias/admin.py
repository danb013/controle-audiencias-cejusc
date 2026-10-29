from django.contrib import admin

from .models import Audiencia, Conciliadora

admin.site.register(Conciliadora)
admin.site.register(Audiencia)