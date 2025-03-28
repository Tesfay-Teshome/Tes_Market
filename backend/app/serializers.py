from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from .models import (
    Category, Product, ProductImage, ProductVariant,
    Cart, CartItem, Order, OrderItem, Transaction,
    Review, Wishlist, WishlistItem, VendorEarning,
    VendorAnalytics, AdministratorDashboardMetrics, Testimonial
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    full_name = serializers.CharField(write_only=False, required=True)
    phone_number = serializers.CharField(source='phone', required=False, allow_blank=True)
    user_type = serializers.CharField(required=True)
    store_name = serializers.CharField(required=False, allow_blank=True)
    store_description = serializers.CharField(required=False, allow_blank=True)
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'confirm_password',
            'phone_number', 'address', 'user_type', 'store_name', 'store_description',
            'profile_image', 'is_verified', 'date_joined', 'full_name'
        )
        
        read_only_fields = ('id', 'is_verified', 'date_joined')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'read_only': True}
        }

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("Passwords don't match")

        # Validate user_type
        user_type = data.get('user_type')
        if user_type not in ['buyer', 'vendor', 'administrator']:
            raise serializers.ValidationError("User type must be either 'buyer', 'vendor', or 'administrator'")

        # If user is vendor, validate required vendor fields
        if user_type == 'vendor' and not data.get('store_name'):
            raise serializers.ValidationError("Store name is required for vendors")

        return data

    def validate_user_type(self, value):
        if value not in ['buyer', 'vendor', 'administrator']:
            raise serializers.ValidationError("User type must be either 'buyer', 'vendor', or 'administrator'")
        return value

    def create(self, validated_data):
        # Hash the password
        validated_data['password'] = make_password(validated_data.get('password'))

        # Automatically create username from email
        validated_data['username'] = validated_data.get('email')

        # Handle the full name
        full_name = validated_data.pop('full_name', '')

        # Remove confirm_password
        validated_data.pop('confirm_password')

        try:
            # Explicitly set user_type
            user = User.objects.create(
                user_type=validated_data['user_type'],
                profile_image=validated_data.get('profile_image'),
                **validated_data
            )
            # Set full name
            user.full_name = full_name
            user.save()
            return user

        except IntegrityError as e:
            raise serializers.ValidationError({"username": "This email is already registered."})

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.user_type = validated_data.get('user_type', instance.user_type)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.store_name = validated_data.get('store_name', instance.store_name)
        instance.store_description = validated_data.get('store_description', instance.store_description)
        
        if validated_data.get('password'):
            instance.set_password(validated_data['password'])
        
        instance.save()
        return instance
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required")

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("Account disabled")

        if not hasattr(user, 'user_type') or not hasattr(user, 'is_verified'):
            raise serializers.ValidationError("System configuration error")

        data['user'] = user
        return data
    
class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'parent', 'description', 'image', 'children')

    def get_children(self, obj):
        return CategorySerializer(obj.get_children(), many=True).data

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'is_primary')

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ('id', 'name', 'value', 'price_adjustment', 'stock')

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.username', read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'price',
            'stock', 'category', 'category_name', 'vendor',
            'vendor_name', 'images', 'variants', 'is_active',
            'approval_status', 'approval_note', 'featured',
            'average_rating', 'created_at'
        )
        read_only_fields = ('slug', 'vendor', 'approval_status', 'approval_note')

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return None
        return sum(review.rating for review in reviews) / len(reviews)

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    variant_name = serializers.SerializerMethodField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = (
            'id', 'product', 'product_name', 'variant',
            'variant_name', 'quantity', 'subtotal'
        )

    def get_variant_name(self, obj):
        if obj.variant:
            return f"{obj.variant.name}: {obj.variant.value}"
        return None

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'total_amount', 'created_at')
        read_only_fields = ('user',)

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    variant_name = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = (
            'id', 'product', 'product_name', 'variant',
            'variant_name', 'quantity', 'price',
            'vendor_earning', 'platform_fee'
        )
        read_only_fields = ('vendor_earning', 'platform_fee')

    def get_variant_name(self, obj):
        if obj.variant:
            return f"{obj.variant.name}: {obj.variant.value}"
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'user_name', 'status', 'total_amount',
            'shipping_address', 'tracking_number', 'notes',
            'items', 'created_at'
        )
        read_only_fields = ('user',)

class TransactionSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.id', read_only=True)
    user_name = serializers.CharField(source='order.user.username', read_only=True)

    class Meta:
        model = Transaction
        fields = (
            'id', 'order', 'order_number', 'user_name',
            'transaction_id', 'amount', 'status',
            'payment_method', 'payment_details',
            'admin_approved', 'admin_note', 'created_at'
        )
        read_only_fields = ('admin_approved', 'admin_note')

class VendorEarningSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order_item.order.id', read_only=True)
    product_name = serializers.CharField(source='order_item.product.name', read_only=True)

    class Meta:
        model = VendorEarning
        fields = (
            'id', 'vendor', 'order_item', 'order_number',
            'product_name', 'amount', 'status', 'payout_date',
            'payout_reference', 'admin_note', 'created_at'
        )
        read_only_fields = ('vendor', 'admin_note')

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Review
        fields = (
            'id', 'user', 'user_name', 'product',
            'product_name', 'rating', 'comment', 'created_at'
        )
        read_only_fields = ('user',)

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

class WishlistItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = WishlistItem
        fields = ('id', 'product', 'product_name', 'product_price', 'created_at')

class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'user', 'items', 'created_at')
        read_only_fields = ('user',)

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'role', 'image', 'content', 'rating', 'created_at']

class VendorAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorAnalytics
        fields = (
            'id', 'vendor', 'date', 'total_sales',
            'total_orders', 'total_products_sold',
            'total_earnings', 'platform_fees'
        )
        read_only_fields = ('vendor',)

class AdministratorDashboardMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdministratorDashboardMetrics
        fields = (
            'id', 'date', 'total_sales', 'total_orders',
            'total_users', 'total_vendors', 'total_products',
            'total_commission', 'pending_approvals',
            'pending_payouts'
        )
