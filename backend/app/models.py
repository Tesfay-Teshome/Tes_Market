from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from mptt.models import MPTTModel, TreeForeignKey
from decimal import Decimal

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('vendor', 'Vendor'),
        ('buyer', 'Buyer'),
    )
    
    user_type = models.CharField(max_length=15, choices=USER_TYPE_CHOICES, default='buyer')
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    store_name = models.CharField(max_length=100, blank=True, null=True)  # For vendors
    store_description = models.TextField(blank=True, null=True)  # For vendors
    bank_account = models.CharField(max_length=50, blank=True, null=True)  # For vendors
    is_verified = models.BooleanField(default=False)  # For vendor verification
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)  # Platform commission rate

    def __str__(self):
        return self.username

    @property
    def is_vendor(self):
        return self.user_type == 'vendor'

    @property
    def is_buyer(self):
        return self.user_type == 'buyer'

    @property
    def is_admin(self):
        return self.user_type == 'administrator'

class Category(MPTTModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Product(models.Model):
    APPROVAL_STATUS = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'vendor'})
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS, default='pending')
    approval_note = models.TextField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100)  # e.g., "Size", "Color"
    value = models.CharField(max_length=100)  # e.g., "XL", "Red"
    price_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.IntegerField(default=0)

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_amount(self):
        return sum(item.subtotal for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def subtotal(self):
        base_price = self.product.price
        if self.variant:
            base_price += self.variant.price_adjustment
        return base_price * self.quantity

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of purchase
    vendor_earning = models.DecimalField(max_digits=10, decimal_places=2)  # Amount after commission
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2)  # Commission amount

    def save(self, *args, **kwargs):
        if not self.pk:  # Only calculate on creation
            self.platform_fee = self.price * Decimal(self.product.vendor.commission_rate / 100)
            self.vendor_earning = self.price - self.platform_fee
        super().save(*args, **kwargs)

class Transaction(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    PAYMENT_METHOD_CHOICES = (
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='transaction')
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_details = models.JSONField(default=dict)  # Store payment gateway response
    admin_approved = models.BooleanField(default=False)  # For admin payment approval
    admin_note = models.TextField(blank=True, null=True)  # Admin notes on payment
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class VendorEarning(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    )
    
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'vendor'})
    order_item = models.OneToOneField(OrderItem, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payout_date = models.DateTimeField(null=True, blank=True)
    payout_reference = models.CharField(max_length=100, blank=True, null=True)
    admin_note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class VendorAnalytics(models.Model):
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'vendor'})
    date = models.DateField()
    total_sales = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    total_products_sold = models.IntegerField(default=0)
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    platform_fees = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ('vendor', 'date')

class AdministratorDashboardMetrics(models.Model):
    date = models.DateField(unique=True)
    total_sales = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    total_users = models.IntegerField(default=0)
    total_vendors = models.IntegerField(default=0)
    total_products = models.IntegerField(default=0)
    total_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pending_approvals = models.IntegerField(default=0)
    pending_payouts = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Administrator Dashboard Metric'
        verbose_name_plural = 'Administrator Dashboard Metrics'
