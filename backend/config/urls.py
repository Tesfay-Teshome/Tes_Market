from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from django.views.generic import TemplateView

# API Documentation Schema
schema_view = get_schema_view(
    openapi.Info(
        title="Tes Market API",
        default_version='v1',
        description="API documentation for Tes Market e-commerce platform",
        terms_of_service="https://www.tesmarket.com/terms/",
        contact=openapi.Contact(email="contact@tesmarket.com"),
        license=openapi.License(name="Tesfay Teshome License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # Home page (no authentication required)
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    
    # API URLs
    path('api/', include('app.urls')),
    
    # REST Framework authentication
    path('api-auth/', include('rest_framework.urls')),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serve media files in development
if settings.DEBUG:
    pass

# Add catch-all pattern for frontend routes
urlpatterns += [
    # This should be the last pattern in your urlpatterns
    path('<path:path>', TemplateView.as_view(template_name='index.html')),
    # Also handle the case when no path is given
    path('', TemplateView.as_view(template_name='index.html')),
]
