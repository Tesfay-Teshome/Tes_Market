from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()

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

# Vendor routes
router.register(r'vendor/dashboard', views.VendorDashboardViewSet, basename='vendor-dashboard')
router.register(r'vendor/products', views.VendorProductViewSet, basename='vendor-products')
router.register(r'vendor/orders', views.VendorOrderViewSet, basename='vendor-orders')
router.register(r'vendor/earnings', views.VendorEarningViewSet, basename='vendor-earnings')

#Administrator Routes
router.register(r'administrator/dashboard', views.AdministratorDashboardViewSet, basename='administrator-dashboard')

# Buyer routes
router.register(r'buyer/orders', views.BuyerOrderViewSet, basename='buyer-orders')
router.register(r'buyer/wishlist', views.BuyerWishlistViewSet, basename='buyer-wishlist')
router.register(r'buyer/cart', views.BuyerCartViewSet, basename='buyer-cart')

urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/user/', views.UserViewSet.as_view({'get': 'me', 'patch': 'update_profile'}), name='user-profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),# New url that calls refresh
]

# Add media URL patterns for development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
