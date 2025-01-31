from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from django.conf import settings
import jwt
from datetime import datetime

class JWTAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Allow OPTIONS requests for CORS
        if request.method == 'OPTIONS':
            return None

        # Exclude paths that don't need authentication
        excluded_paths = [
            '/',  # Root path
            '/api/token/',
            '/api/token/refresh/',
            '/api/token/verify/',
            '/api/auth/',
            '/api/auth/login/',
            '/api/auth/registration/',
            '/administrator/',
            '/admin/',
            '/swagger/',
            '/redoc/',
            '/static/',
            '/media/',
            '/favicon.ico',
        ]
        
        # Allow public access to API GET requests
        if request.method == 'GET' and request.path.startswith('/api/'):
            return None
            
        if any(request.path.startswith(path) for path in excluded_paths):
            return None
            
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return JsonResponse({'error': 'No authentication token provided'}, status=401)
            
        try:
            # Remove 'Bearer ' prefix
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            
            # Check if token is expired
            exp = datetime.fromtimestamp(payload['exp'])
            if datetime.now() > exp:
                return JsonResponse({'error': 'Token has expired'}, status=401)
                
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid authentication token'}, status=401)
        except IndexError:
            return JsonResponse({'error': 'Invalid authorization header format'}, status=401)
            
        return None

class CORSMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        allowed_origins = settings.CORS_ORIGIN_WHITELIST
        origin = request.headers.get('Origin')
        
        if origin in allowed_origins:
            response["Access-Control-Allow-Origin"] = origin
        else:
            response["Access-Control-Allow-Origin"] = allowed_origins[0] if allowed_origins else '*'
            
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        response["Access-Control-Allow-Credentials"] = "true"
        return response
