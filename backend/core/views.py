from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from .models import User, Category, Product, Transaction, Order, Payment, Commission
from .serializers import (
    UserSerializer, CategorySerializer, ProductSerializer, TransactionSerializer
)
import stripe
from decimal import Decimal

class IsVendorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'vendor'

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return super().get_permissions()

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsVendorOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        vendor = self.request.query_params.get('vendor', None)

        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(title__icontains=search)
        if vendor:
            queryset = queryset.filter(vendor_id=vendor)

        return queryset

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    @action(detail=False, methods=['get'])
    def vendor_stats(self, request):
        if not request.user.is_authenticated or request.user.role != 'vendor':
            return Response(status=status.HTTP_403_FORBIDDEN)

        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        products = Product.objects.filter(vendor=request.user)
        transactions = Transaction.objects.filter(
            vendor=request.user,
            created_at__gte=thirty_days_ago
        )

        stats = {
            'total_products': products.count(),
            'active_products': products.filter(is_active=True).count(),
            'total_sales': transactions.filter(status='completed').aggregate(
                total=Sum('amount'))['total'] or 0,
            'pending_orders': transactions.filter(status='pending').count(),
            'monthly_transactions': transactions.count(),
        }

        return Response(stats)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Transaction.objects.all()
        elif user.role == 'vendor':
            return Transaction.objects.filter(vendor=user)
        return Transaction.objects.filter(buyer=user)

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        amount = product.price * quantity

        serializer.save(
            buyer=self.request.user,
            vendor=product.vendor,
            amount=amount,
            commission=amount * 0.1
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response(status=status.HTTP_403_FORBIDDEN)

        transaction = self.get_object()
        transaction.status = 'approved'
        transaction.save()
        
        return Response({'status': 'approved'})

    @action(detail=False, methods=['get'])
    def admin_stats(self, request):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response(status=status.HTTP_403_FORBIDDEN)

        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        stats = {
            'total_vendors': User.objects.filter(role='vendor').count(),
            'active_users': User.objects.filter(last_login__gte=thirty_days_ago).count(),
            'total_revenue': Transaction.objects.filter(
                status='completed'
            ).aggregate(total=Sum('commission'))['total'] or 0,
            'pending_approvals': Transaction.objects.filter(status='pending').count(),
        }

        return Response(stats)

# Payment views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    try:
        order = Order.objects.get(id=request.data.get('order_id'))
        
        # Create Stripe PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=int(order.total * 100),  # Convert to cents
            currency='usd',
            metadata={'order_id': order.id}
        )
        
        return Response({
            'clientSecret': intent.client_secret
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_payment(request):
    payment_intent_id = request.data.get('payment_intent_id')
    order_id = request.data.get('order_id')
    
    try:
        order = Order.objects.get(id=order_id)
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if payment_intent.status == 'succeeded':
            # Create payment record
            payment = Payment.objects.create(
                order=order,
                amount=order.total,
                status='completed',
                transaction_id=payment_intent_id,
                provider_response=payment_intent
            )
            
            # Update order status
            order.status = 'processing'
            order.save()
            
            # Create commission record
            commission_amount = order.total * Decimal('0.10')  # 10% commission
            Commission.objects.create(
                transaction=order.transactions.first(),
                amount=commission_amount,
                rate=Decimal('10.00')
            )
            
            return Response({'status': 'success'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# Analytics views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_analytics(request):
    if request.user.role != 'vendor':
        return Response({'error': 'Not authorized'}, status=403)
    
    date_range = request.GET.get('range', 'month')
    now = timezone.now()
    
    if date_range == 'week':
        start_date = now - timedelta(days=7)
    elif date_range == 'month':
        start_date = now - timedelta(days=30)
    else:  # year
        start_date = now - timedelta(days=365)
    
    # Get vendor's transactions
    transactions = Transaction.objects.filter(
        vendor=request.user,
        created_at__gte=start_date
    )
    
    # Calculate analytics
    total_sales = transactions.aggregate(total=Sum('amount'))['total'] or 0
    total_orders = transactions.count()
    average_order = total_sales / total_orders if total_orders > 0 else 0
    commission_paid = transactions.aggregate(total=Sum('commission__amount'))['total'] or 0
    
    # Get top products
    top_products = Product.objects.filter(
        transactions__vendor=request.user,
        transactions__created_at__gte=start_date
    ).annotate(
        sales=Count('transactions'),
        revenue=Sum('transactions__amount')
    ).order_by('-sales')[:5]
    
    # Get monthly sales
    monthly_sales = transactions.extra(
        select={'month': "to_char(created_at, 'Month YYYY')"}
    ).values('month').annotate(
        sales=Sum('amount')
    ).order_by('month')
    
    return Response({
        'totalSales': total_sales,
        'totalOrders': total_orders,
        'averageOrderValue': average_order,
        'commissionPaid': commission_paid,
        'topProducts': [{
            'id': p.id,
            'title': p.title,
            'sales': p.sales,
            'revenue': p.revenue
        } for p in top_products],
        'monthlySales': list(monthly_sales)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_analytics(request):
    if request.user.role != 'admin':
        return Response({'error': 'Not authorized'}, status=403)
    
    # Get platform-wide analytics
    total_sales = Transaction.objects.aggregate(total=Sum('amount'))['total'] or 0
    total_commission = Commission.objects.aggregate(total=Sum('amount'))['total'] or 0
    total_vendors = User.objects.filter(role='vendor').count()
    total_buyers = User.objects.filter(role='buyer').count()
    
    # Get top vendors
    top_vendors = User.objects.filter(role='vendor').annotate(
        sales=Count('vendor_transactions'),
        revenue=Sum('vendor_transactions__amount')
    ).order_by('-sales')[:10]
    
    return Response({
        'totalSales': total_sales,
        'totalCommission': total_commission,
        'totalVendors': total_vendors,
        'totalBuyers': total_buyers,
        'topVendors': [{
            'id': v.id,
            'username': v.username,
            'sales': v.sales,
            'revenue': v.revenue
        } for v in top_vendors]
    })