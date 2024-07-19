from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.views import AccountViewSet, TransferViewSet

router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'transfers', TransferViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app.urls')),
    path('api/', include(router.urls)),
]
