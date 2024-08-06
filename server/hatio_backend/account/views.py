
from django.http import JsonResponse
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserCreateSerializer
from .models import UserAccount
from django.utils.encoding import force_str
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.http import urlsafe_base64_decode
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.exceptions import TokenError
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate,logout
from .serializers import TodoSerializer
from rest_framework.response import Response
from .models import Project, Todo
from .serializers import ProjectSerializer, TodoSerializer



from rest_framework import generics
# Create your views here.


def getRoutes(request):
    return JsonResponse("hello ", safe=False)




class RegisterView(APIView):
    def post(self, request):
        data = request.data
        

        serializer = UserCreateSerializer(data=data)
        if serializer.is_valid():
        
            user = serializer.save()

            user.is_active = True
            user.save()

            

            return Response( {"message":"succes"})
        else:
            return Response(serializer.errors, {"message":"failed"},status=status.HTTP_400_BAD_REQUEST)




class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = UserAccount.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserAccount.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response(
                {"message": "Email verified successfully."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid verification link."},
                status=status.HTTP_400_BAD_REQUEST,
            )
class LoginView(APIView):
    

    def post(self,request):
        
        if request.method =="POST":
            email =request.data['email']
            
            password = request.data['password']

            print(email,password)

            user = UserAccount.objects.filter(email = email).first()
            print(user)

            if user is None or user.delete == True or user.is_active == False:
                return Response({"message":"Not a registered user"})
            
            if not user.check_password(password):
                return Response({"message":"Incorrect Password"})
            

        refresh = RefreshToken.for_user(user)

        response_data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': "User login successful",
            "name": user.name,  
            "user_id": user.id
        }

        return Response(response_data, status=status.HTTP_200_OK)

    
    


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data['token']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except TokenError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"detail": str(e)})
        



class ProjectListAPIView(generics.ListAPIView):
    serializer_class = ProjectSerializer
  
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if user_id:
            return Project.objects.filter(user_id=user_id)
        return Project.objects.none()
    


class ProjectCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer


    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Project.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        serializer.save(user_id=user_id)

class ProjectDeleteAPIView(generics.DestroyAPIView):
    serializer_class = ProjectSerializer


    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if user_id:
            return Project.objects.filter(user_id=user_id)
        return Project.objects.none()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Project deleted"}, status=status.HTTP_200_OK)




class TodoCreateAPIView(generics.CreateAPIView):
    serializer_class = TodoSerializer

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project does not exist'}, status=status.HTTP_404_NOT_FOUND)

        serializer.save(project=project)

class TodoDeleteAPIView(generics.GenericAPIView):
    def delete(self, request, project_id, sequential_number, *args, **kwargs):
        try:
    
            todo = Todo.objects.get(project_id=project_id, sequential_number=sequential_number)
            todo.delete()
            return Response({"message": "Todo deleted"}, status=status.HTTP_200_OK)
        except Todo.DoesNotExist:
            return Response({"error": "Todo not found"}, status=status.HTTP_404_NOT_FOUND)

class TodoUpdateAPIView(generics.UpdateAPIView):
    serializer_class = TodoSerializer

    def get_object(self):
        
        sequential_number = self.kwargs.get('sequential_number')
        project_id = self.kwargs.get('project_id')
        

        try:
            todo = Todo.objects.get(sequential_number=sequential_number, project_id=project_id)
        except Todo.DoesNotExist:
            raise Http404("Todo with the given sequential number does not exist")
        
        return todo

  

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({
            "todo": serializer.data,
            "message": "Todo updated successfully"
        }, status=status.HTTP_200_OK)
    
    


    class LogoutView(APIView):
        

        def post(self, request):
           
            print(request.data,"just testibng dshrhewjv")
            logout(request)
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)

