from django.db import models,transaction
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser,PermissionsMixin
# Create your models here.


class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, mobilenumber, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, mobilenumber=mobilenumber, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email,name, mobilenumber, password=None, **extra_fields):
        user = self.model(email=email, name=name, mobilenumber=mobilenumber, **extra_fields)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.is_admin = True
        user.save(using=self._db)
        return user

class UserAccount(AbstractBaseUser,PermissionsMixin):
    name = models.CharField(max_length=50,null=False)
    email = models.EmailField(unique=True,max_length=255)
    mobilenumber = models.CharField(max_length=20,null=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
   
    objects = UserAccountManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['name','mobilenumber']

    def __str__(self):
         return self.email
    
    def has_perm(self, perm, obj=None):
        return self.is_admin
    
    def has_module_perms(self, app_label):
        return True
    

class Project(models.Model):
    user = models.ForeignKey(UserAccount, related_name='projects', on_delete=models.CASCADE)  
    project = models.CharField(max_length=255, unique= True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.project




class Todo(models.Model):
    project = models.ForeignKey(Project, related_name='todos', on_delete=models.CASCADE)  
    task = models.CharField(max_length=255)
    description = models.TextField()
    status = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
 
    sequential_number = models.PositiveIntegerField(editable=False, null=True, blank=True)


    class Meta:
        unique_together = ('project', 'task')

    def save(self, *args, **kwargs):
        if self.pk is None:  
            with transaction.atomic():
              
                max_number = Todo.objects.filter(project=self.project).aggregate(models.Max('sequential_number'))['sequential_number__max']
                self.sequential_number = (max_number or 0) + 1
        super().save(*args, **kwargs)

    
    

