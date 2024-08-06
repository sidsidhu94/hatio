from account import views
from django.urls import path,include

from .views import RegisterView, VerifyEmailView,LoginView,ProjectListAPIView,ProjectCreateAPIView,TodoCreateAPIView, TodoUpdateAPIView,ProjectDeleteAPIView,TodoDeleteAPIView,LogoutView


urlpatterns = [
    path('',views.getRoutes,name="getRoutes"),
    # path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify-email'),
    # path('logout/', LogoutView.as_view(), name='logout'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    path('projects/<int:user_id>/', ProjectListAPIView.as_view(), name='project-list'),
    path('project_add/<int:user_id>/', ProjectCreateAPIView.as_view(), name='project-create'),
    path('projects/<int:user_id>/<int:pk>/', ProjectDeleteAPIView.as_view(), name='project-delete'),

    path('todos/<int:project_id>/', TodoCreateAPIView.as_view(), name='todo-create'),
    path('todos_edit/<int:project_id>/<int:sequential_number>/',  TodoUpdateAPIView.as_view(), name='todo-update'),
    path('todo_delete/<int:project_id>/<int:sequential_number>/', TodoDeleteAPIView.as_view(), name='todo-delete'),
    
    
]
