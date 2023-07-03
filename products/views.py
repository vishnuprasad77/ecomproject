from django.shortcuts import render
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from cart.models import CartItems

# Create your views here.

class DemoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'success':"you are authenticated"})
    
class ProductView(APIView):
    def get(self,request):
        category = self.request.query_params.get('category')
        if category:
            queryset = Product.objects.filter(category__category_name = category)
        else:
            queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        return Response({'count':len(serializer.data), 'data':serializer.data})
def search_view(request):
    query = request.GET.get('query')
    if query:
        products = Product.objects.filter(product_name__icontains=query)
        user = request.user
        cart_items_count = CartItems.objects.filter(user=user).count()
    else:
        products = Product.objects.all()
        cart_items_count = None
    context = {'products': products, 'query': query, 'count':cart_items_count}
    return render(request, 'product/search_results.html', context)
