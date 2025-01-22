from rest_framework import serializers
from .models import User, Category, Product, ProductImage, Transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'role', 'profile_image', 'created_at')
        read_only_fields = ('id', 'created_at')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'is_primary')

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    vendor_name = serializers.CharField(source='vendor.get_full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ('id', 'vendor', 'vendor_name', 'category', 'category_name', 'title', 
                 'description', 'price', 'stock', 'is_active', 'images', 'created_at')
        read_only_fields = ('id', 'created_at')

class TransactionSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.get_full_name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.get_full_name', read_only=True)
    product_title = serializers.CharField(source='product.title', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ('id', 'buyer', 'buyer_name', 'vendor', 'vendor_name', 'product', 
                 'product_title', 'quantity', 'amount', 'commission', 'status', 'created_at')
        read_only_fields = ('id', 'commission', 'created_at')