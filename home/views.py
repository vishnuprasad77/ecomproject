from django.shortcuts import render, get_object_or_404
from products.models import Product
from cart.models import CartItems

# Create your views here.

def home(request):
    products = Product.objects.all()
    user = request.user
    cart_items_count = CartItems.objects.filter(user=user).count()
    return render(request,'home/index.html',{'products':products,'count':cart_items_count})

def all_product(request):
    products = Product.objects.all()
    user = request.user
    cart_items_count = CartItems.objects.filter(user=user).count()
    return render(request,'product/all_products.html',{'products':products,'count':cart_items_count})

def product(request, product_id):
    # product = get_object_or_404(Product, pk=product_id)
    product = Product.objects.get(pk=product_id)
    user = request.user
    cart_items_count = CartItems.objects.filter(user=user).count()
    return render(request,'product/product.html',{'product':product,'count':cart_items_count})