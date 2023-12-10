from rest_framework import serializers

class NotDeletedModelSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        if not instance.is_deleted:
            return super().to_representation(instance)
        return None