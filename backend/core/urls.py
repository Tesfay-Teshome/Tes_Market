from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, CategoryViewSet, ProductViewSet, TransactionViewSet,
    create_payment_intent, process_payment, vendor_analytics, admin_analytics
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Payment endpoints
    path('payments/create-intent/', create_payment_intent, name='create-payment-intent'),
    path('payments/process/', process_payment, name='process-payment'),
    # Analytics endpoints
    path('vendor/analytics/', vendor_analytics, name='vendor-analytics'),
    path('admin/analytics/', admin_analytics, name='admin-analytics'),
]