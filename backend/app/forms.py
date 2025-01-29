from django import forms
from django.contrib.auth import get_user_model
from .models import Product, ProductVariant, ProductImage, Order

User = get_user_model()

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('username', 'email', 'user_type', 'phone', 'address', 'profile_image')

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        if password != confirm_password:
            raise forms.ValidationError("Passwords do not match")
        return cleaned_data

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ('category', 'name', 'description', 'price', 'stock', 'is_active')

class ProductVariantForm(forms.ModelForm):
    class Meta:
        model = ProductVariant
        fields = ('name', 'value', 'price_adjustment', 'stock')

class ProductImageForm(forms.ModelForm):
    class Meta:
        model = ProductImage
        fields = ('image', 'is_primary', 'alt_text')

class OrderUpdateForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ('status',)
