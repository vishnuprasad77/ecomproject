from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from django.dispatch import receiver
from django.db.models.signals import pre_save,post_save

# Create your models here.

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    total_price = models.FloatField(default=0)
    
    def __str__(self):
        return str(self.user.username) + " " +str(self.total_price)
    
class CartItems(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.FloatField(default=0)
    quantity = models.IntegerField(default=1)
    
    def __str__(self):
        return str(self.user.username) + " " +str(self.product.product_name)
    
# @receiver(pre_save, sender=CartItems)
# def correct_price(sender, **kwargs):
#     cart_items = kwargs['instance']
#     price_of_product = Product.objects.get(id=cart_items.product.id)
#     cart_items.price = cart_items.quantity * float(price_of_product.price)
#     total_cart_items = CartItems.objects.filter(user=cart_items.user)
#     cart = Cart.objects.get(id=cart_items.cart.id)
#     # cart.total_price = cart_items.price.all()
#     total_price = sum(item.price for item in total_cart_items)
    
#     cart.total_price = total_price
#     cart.save()
    
@receiver(pre_save, sender=CartItems)
def correct_price(sender, **kwargs):
    cart_items = kwargs['instance']
    price_of_product = Product.objects.get(id=cart_items.product.id)
    quantity = float(cart_items.quantity)
    cart_items.price = quantity * float(price_of_product.price)
    
@receiver(post_save, sender=CartItems)
def update_cart_total_price(sender, **kwargs):
    cart_items = kwargs['instance']
    total_cart_items = CartItems.objects.filter(user=cart_items.user)
    cart = Cart.objects.get(id=cart_items.cart.id)
    total_price = sum(item.price for item in total_cart_items)
    cart.total_price = total_price
    cart.save()

class Orders(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    amount = models.FloatField(default=0)
    is_paid = models.BooleanField(default=False)
    order_id = models.CharField(max_length=100, blank=True)
    payement_id = models.CharField(max_length=100, blank=True)
    payment_signature = models.CharField(max_length=100, blank=True)
    

class OrderedItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.ForeignKey(Orders, on_delete=models.CASCADE)
    