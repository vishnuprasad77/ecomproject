from django.urls import path
from .views import *

urlpatterns = [
    path('cart/', CartView.as_view()),
    path('create-payment/', create_payment, name='create_payment'),
    path('cartview/',cart,name='cartview'),
    path('delete-cart-items/', DeleteAllCartItems.as_view(), name='delete_cart_items'),
]
