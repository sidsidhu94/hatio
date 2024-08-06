from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from account.models import UserAccount,Project,Todo
from django.db import models
# Register your models here.
class AccountAdmin(UserAdmin):
    list_display = ('id','email','name','mobilenumber','is_admin','is_staff')
    search_fields = ('email','name')
    readonly_fields = ('id','is_staff')

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

    ordering = ('id',) 

admin.site.register(UserAccount,AccountAdmin)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'created_date')
    search_fields = ('project', 'user__username')


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ('task', 'project', 'sequential_number', 'status', 'created_date', 'updated_date')
    list_filter = ('status', 'created_date', 'updated_date')
    search_fields = ('task', 'project__project')

    def save_model(self, request, obj, form, change):
        if not change:  
            max_sequential_number = Todo.objects.filter(project=obj.project).aggregate(max_sequential=models.Max('sequential_number'))['max_sequential'] or 0
            obj.sequential_number = max_sequential_number + 1
        super().save_model(request, obj, form, change)