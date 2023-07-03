from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import razorpay
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

class CartView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        cart = Cart.objects.filter(user=user, ordered=False).first()
        queryset = CartItems.objects.filter(cart=cart)
        serializer = CartItemSerializer(queryset, many=True)
        return Response(serializer.data)
    def post(self, request):
        data = request.data
        user = request.user
        cart,_ = Cart.objects.get_or_create(user=user, ordered=False)
        product = Product.objects.get(id=data.get('product'))
        price = Product.price
        quantity = data.get('quantity')
        cart_items = CartItems(cart=cart, user=user, product=product, price=price, quantity=quantity)
        cart_items.save()
        return Response({'success':'items added ot you cart'})

    def put(self, request):
        data = request.data
        cart_item = CartItems.objects.get(id=data.get('id'))
        quantity = data.get('quantity')
        # cart_item.quantity += quantity
        cart_item.quantity = quantity
        cart_item.save()
        
         # Fetch all cart items for the user
        cart_items = CartItems.objects.filter(user=cart_item.user)
    
        # Calculate the total price
        total_price = sum(item.price for item in cart_items)
        
        return Response({'success':'items updated in your cart','price': cart_item.price,'total_price': total_price})
        
    def delete(self, request):
        user = request.user
        data = request.data
        cart_item = CartItems.objects.get(id=data.get('id'))
        cart_item.delete()
        cart = Cart.objects.filter(user=user, ordered=False).first()
        queryset = CartItems.objects.filter(cart=cart)
        serializer = CartItemSerializer(queryset, many=True)
        
        # Fetch all cart items for the user
        cart_items = CartItems.objects.filter(user=cart_item.user)
        # Calculate the total price
        total_price = sum(item.price for item in cart_items)
        cart.total_price = total_price
        cart.save()
        
        return Response({'success':'items deleted from your cart','total_price': total_price})
    
class DeleteAllCartItems(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        cart = Cart.objects.filter(user=user, ordered=False).first()
        if cart:
            CartItems.objects.filter(cart=cart).delete()
            cart.total_price = 0
            cart.save()
            return Response({'success': 'All cart items deleted'})
        else:
            return Response({'error': 'No cart found'})
    
class OrderAPI(APIView):
    
    def get(self, request):
        queryset = Orders.objects.filter(user=request.user)
        serializer = OrderSerializer(request, many=True)
        return Response(serializer.data)
def cart(request):
    user = request.user
    cart_items_count = CartItems.objects.filter(user=user).count()
    return render(request,'cart/cart.html',{'count':cart_items_count})

@csrf_exempt
def create_payment(request):
    data = json.loads(request.body.decode('utf-8'))
    amount = int(data.get('amount')) * 100  # Amount in paise
    client = razorpay.Client(auth=('rzp_test_fwcZCClgFt08G2','aDPt9SeLAV6gnPCk2cYPoZtR'))
    data = {
        'amount': amount,
        'currency': 'INR',
        #'receipt': 'order_receipt',
        # Add any additional parameters as needed
    }
    order = client.order.create(data=data)
    return JsonResponse(order)
    
    