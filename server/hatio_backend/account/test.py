from django.urls import reverse
from django.core import mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.test import APITestCase
from rest_framework import status
from .models import UserAccount

class UserRegistrationTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.verify_url = reverse('verify-email', kwargs={'uidb64': 'testuid', 'token': 'testtoken'})

    def test_user_registration(self):
        data = {
            'name': 'Test User',
            'email': 'testuser@example.com',
            'mobilenumber': '1234567890',
            'password': 'testpassword'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Please click the link to verify your email', mail.outbox[0].body)

    def test_email_verification(self):
        user = UserAccount.objects.create_user(
            email='testuser@example.com',
            password='testpassword',
            name='Test User',
            mobilenumber='1234567890'
        )
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verify_url = reverse('verify-email', kwargs={'uidb64': uid, 'token': token})

        response = self.client.get(verify_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.is_active)


