from django.urls import path
from home.views import *

urlpatterns = [
    path('home/', home,name="home"),
    path('all_product/', all_product,name='all_product'),
    path('product_detail/<int:product_id>/', product,name='product_detail'),
]
