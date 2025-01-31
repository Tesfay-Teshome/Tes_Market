from django.shortcuts import render
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from .models import (
    User, Category, Product, ProductImage, ProductVariant,
    Cart, CartItem, Order, OrderItem, Transaction, Review,
    Wishlist, WishlistItem, VendorEarning, VendorAnalytics,
    AdministratorDashboardMetrics
)
from .serializers import (
    UserSerializer, CategorySerializer, ProductSerializer,
    CartSerializer, OrderSerializer, TransactionSerializer,
    ReviewSerializer, WishlistSerializer, AdministratorDashboardMetricsSerializer
)

User = get_user_model()

class IsVendorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_vendor

class IsVendorOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.vendor == request.user

class IsAdministrator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_administrator

class AdministratorDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create', 'update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [permission() for permission in self.permission_classes]

    @action(detail=False, methods=['get'])
    def metrics(self, request):
        """Get administrator dashboard metrics"""
        today = timezone.now().date()
        metrics, _ = AdministratorDashboardMetrics.objects.get_or_create(date=today)
        
        # Update metrics
        metrics.total_users = User.objects.count()
        metrics.total_vendors = User.objects.filter(user_type='vendor').count()
        metrics.total_products = Product.objects.count()
        metrics.pending_approvals = Product.objects.filter(approval_status='pending').count()
        metrics.pending_payouts = VendorEarning.objects.filter(status='pending').count()
        
        # Calculate sales and commission for today
        today_transactions = Transaction.objects.filter(
            created_at__date=today,
            status='completed'
        )
        metrics.total_sales = today_transactions.aggregate(Sum('amount'))['amount__sum'] or 0
        metrics.total_commission = OrderItem.objects.filter(
            order__transaction__in=today_transactions
        ).aggregate(Sum('platform_fee'))['platform_fee__sum'] or 0
        
        metrics.save()
        
        serializer = AdministratorDashboardMetricsSerializer(metrics)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending_vendors(self, request):
        """Get list of pending vendor approvals"""
        pending_vendors = User.objects.filter(
            user_type='vendor',
            is_verified=False
        )
        return Response(UserSerializer(pending_vendors, many=True).data)

    @action(detail=True, methods=['post'])
    def approve_vendor(self, request, pk=None):
        """Approve a vendor"""
        try:
            vendor = User.objects.get(pk=pk, user_type='vendor')
            vendor.is_verified = True
            vendor.save()
            return Response({'message': 'Vendor approved successfully'})
        except User.DoesNotExist:
            return Response(
                {'error': 'Vendor not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def reject_vendor(self, request, pk=None):
        """Reject a vendor"""
        try:
            vendor = User.objects.get(pk=pk, user_type='vendor')
            vendor.is_active = False
            vendor.save()
            return Response({'message': 'Vendor rejected'})
        except User.DoesNotExist:
            return Response(
                {'error': 'Vendor not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def pending_products(self, request):
        """Get list of pending product approvals"""
        pending_products = Product.objects.filter(approval_status='pending')
        return Response(ProductSerializer(pending_products, many=True).data)

    @action(detail=True, methods=['post'])
    def approve_product(self, request, pk=None):
        """Approve a product"""
        try:
            product = Product.objects.get(pk=pk)
            product.approval_status = 'approved'
            product.save()
            return Response({'message': 'Product approved successfully'})
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def reject_product(self, request, pk=None):
        """Reject a product"""
        try:
            product = Product.objects.get(pk=pk)
            product.approval_status = 'rejected'
            product.approval_note = request.data.get('note', '')
            product.save()
            return Response({'message': 'Product rejected'})
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class VendorDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsVendorOrReadOnly]

    @action(detail=False, methods=['get'])
    def metrics(self, request):
        today = timezone.now().date()
        analytics, _ = VendorAnalytics.objects.get_or_create(
            vendor=request.user,
            date=today
        )
        
        # Update analytics
        today_orders = OrderItem.objects.filter(
            product__vendor=request.user,
            order__created_at__date=today
        )
        
        analytics.total_orders = today_orders.count()
        analytics.total_products_sold = today_orders.aggregate(
            Sum('quantity')
        )['quantity__sum'] or 0
        analytics.total_sales = today_orders.aggregate(
            Sum('price')
        )['price__sum'] or 0
        analytics.total_earnings = today_orders.aggregate(
            Sum('vendor_earning')
        )['vendor_earning__sum'] or 0
        analytics.platform_fees = today_orders.aggregate(
            Sum('platform_fee')
        )['platform_fee__sum'] or 0
        
        analytics.save()
        
        return Response({
            'total_orders': analytics.total_orders,
            'total_products_sold': analytics.total_products_sold,
            'total_sales': analytics.total_sales,
            'total_earnings': analytics.total_earnings,
            'platform_fees': analytics.platform_fees
        })

    @action(detail=False, methods=['get'])
    def products(self, request):
        products = Product.objects.filter(vendor=request.user)
        return Response(ProductSerializer(products, many=True).data)

    @action(detail=False, methods=['get'])
    def orders(self, request):
        orders = Order.objects.filter(
            items__product__vendor=request.user
        ).distinct()
        return Response(OrderSerializer(orders, many=True).data)

    @action(detail=False, methods=['get'])
    def earnings(self, request):
        earnings = VendorEarning.objects.filter(vendor=request.user)
        return Response({
            'total_earnings': earnings.filter(status='paid').aggregate(
                Sum('amount')
            )['amount__sum'] or 0,
            'pending_earnings': earnings.filter(status='pending').aggregate(
                Sum('amount')
            )['amount__sum'] or 0
        })

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Allow public read access
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsVendorOrReadOnly()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if not request.user.is_administrator:
            return Response(
                {'error': 'Only administrators can approve products'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        product = self.get_object()
        product.approval_status = 'approved'
        product.save()
        return Response({'message': 'Product approved successfully'})

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_administrator:
            return Order.objects.all()
        elif user.is_vendor:
            return Order.objects.filter(items__product__vendor=user).distinct()
        return Order.objects.filter(user=user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Only vendors can update to 'shipped'
        if new_status == 'shipped' and not request.user.is_vendor:
            return Response(
                {'error': 'Only vendors can mark orders as shipped'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order.status = new_status
        order.save()
        return Response({'message': f'Order status updated to {new_status}'})

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_administrator:
            return Transaction.objects.all()
        elif user.is_vendor:
            return Transaction.objects.filter(
                order__items__product__vendor=user
            ).distinct()
        return Transaction.objects.filter(order__user=user)

    @action(detail=True, methods=['post'])
    def approve_payment(self, request, pk=None):
        if not request.user.is_administrator:
            return Response(
                {'error': 'Only administrators can approve payments'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        transaction = self.get_object()
        transaction.admin_approved = True
        transaction.admin_note = request.data.get('note', '')
        transaction.save()
        
        # Create vendor earnings
        for item in transaction.order.items.all():
            VendorEarning.objects.create(
                vendor=item.product.vendor,
                order_item=item,
                amount=item.vendor_earning
            )
        
        return Response({'message': 'Payment approved and vendor earnings created'})

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        cart = self.get_object()
        product_id = request.data.get('product')
        quantity = request.data.get('quantity', 1)
        variant_id = request.data.get('variant')
        
        try:
            product = Product.objects.get(pk=product_id)
            if variant_id:
                variant = ProductVariant.objects.get(pk=variant_id)
            else:
                variant = None
            
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                variant=variant,
                defaults={'quantity': quantity}
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            
            return Response({'message': 'Item added to cart'})
        except (Product.DoesNotExist, ProductVariant.DoesNotExist):
            return Response(
                {'error': 'Product or variant not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        wishlist = self.get_object()
        product_id = request.data.get('product')
        
        try:
            product = Product.objects.get(pk=product_id)
            WishlistItem.objects.get_or_create(
                wishlist=wishlist,
                product=product
            )
            return Response({'message': 'Item added to wishlist'})
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Allow public read access
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [permissions.AllowAny()]

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user
