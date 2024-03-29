from rest_framework import serializers
from myapp.models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'client', 'trader', 'start_date', 'end_date', 'price']
