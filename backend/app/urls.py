from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Administrator routes
router.register(r'administrator-dashboard', views.AdministratorDashboardViewSet, basename='administrator-dashboard')

# User management
router.register(r'users', views.UserViewSet, basename='user')

# Product management
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'testimonials', views.TestimonialViewSet, basename='testimonial')

# Shopping
router.register(r'cart', views.CartViewSet, basename='cart')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')

# User features
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'wishlist', views.WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
    
    # Custom authentication endpoints
    path('auth/vendor-register/', views.UserViewSet.as_view({'post': 'create'}), {'user_type': 'vendor'}, name='vendor-register'),
    path('auth/buyer-register/', views.UserViewSet.as_view({'post': 'create'}), {'user_type': 'buyer'}, name='buyer-register'),
]
