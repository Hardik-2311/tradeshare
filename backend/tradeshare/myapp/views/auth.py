from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from myapp.models import Client, Trader
from myapp.serializers import ClientSerializer, TraderSerializer


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from myapp.serializers import Userserializers


class ClientLoginAPIView(APIView):

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        # Authenticate client
        client = authenticate(email=email, password=password)
        if client is None:
            return Response(
                data={"status": "error", "message": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Return client data upon successful authentication
        serializer = ClientSerializer(client)
        return Response(
            data={
                "status": "success",
                "user": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class ClientRegisterAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        age = request.data.get("age")
        pan_card = request.data.get("pan_card")
        if not username or not password or not email or not age:
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the username already exists
        if Client.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create a serializer instance with the request data
        serializer = ClientSerializer(data=request.data)

        # Check if the serializer is valid
        if serializer.is_valid():
            # Save the serializer data to create a new client
            client = serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "User registered successfully",
                    "user": ClientSerializer(client).data,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TraderLoginAPIView(APIView):

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        # Authenticate trader
        trader = authenticate(email=email, password=password)
        if trader is None:
            return Response(
                data={"status": "error", "message": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Return trader data upon successful authentication
        serializer = TraderSerializer(trader)
        return Response(
            data={
                "status": "success",
                "user": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class TraderRegisterAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        age = request.data.get("age")
        pan_card = request.data.get("pan_card")
        if not username or not password or not email or not age or not pan_card:
            return Response(
                {"error": "Username, password, and email are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the username already exists
        if Trader.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create a new trader
        trader = Trader.objects.create_user(
            username=username,
            password=password,
            email=email,
            age=age,
            pan_card=pan_card,
        )
        serializer = TraderSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            serialized_user = TraderSerializer(user).data
            return Response(
                {
                    "success": True,
                    "message": "User registered successfully",
                    "user": serialized_user,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
