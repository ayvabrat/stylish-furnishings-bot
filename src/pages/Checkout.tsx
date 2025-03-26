
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePromotion } from '@/contexts/PromotionContext';
import { createOrder } from '@/services/orderService';
import { fetchAdminSettings } from '@/services/adminService';
import PromoCodeInput from '@/components/PromoCodeInput';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { promoCode, discountPercentage } = usePromotion();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'transfer'>('transfer');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    postalCode: '',
    notes: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: '',
    accountNumber: '',
    recipientName: ''
  });
  
  // Calculate discount amount and final price
  const discountAmount = Math.round(totalPrice * (discountPercentage / 100));
  const finalPrice = totalPrice - discountAmount;
  
  useEffect(() => {
    // Load payment details from admin settings
    const loadPaymentDetails = async () => {
      try {
        const settings = await fetchAdminSettings();
        setPaymentDetails({
          bankName: settings.paymentDetails.bankName,
          accountNumber: settings.paymentDetails.accountNumber,
          recipientName: settings.paymentDetails.recipientName
        });
      } catch (error) {
        console.error('Failed to load payment details:', error);
      }
    };
    
    loadPaymentDetails();
    
    // Redirect to home if cart is empty
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems.length, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.city || !formData.address) {
      toast.error(language === 'ru' ? 'Пожалуйста, заполните все обязательные поля' : 'Барлық міндетті өрістерді толтырыңыз', {
        duration: 1000
      });
      return;
    }
    
    // Phone number validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error(language === 'ru' ? 'Пожалуйста, введите корректный номер телефона' : 'Дұрыс телефон нөмірін енгізіңіз', {
        duration: 1000
      });
      return;
    }
    
    // Email validation if provided
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error(language === 'ru' ? 'Пожалуйста, введите корректный email' : 'Дұрыс email енгізіңіз', {
          duration: 1000
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Create order with all details
      const orderData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || null,
        city: formData.city,
        deliveryAddress: formData.address,
        postalCode: formData.postalCode || null,
        additionalNotes: formData.notes || null,
        paymentMethod: paymentMethod,
        totalAmount: finalPrice,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: language === 'ru' ? item.name : (item.nameKz || item.name),
          price: item.price,
          quantity: item.quantity
        })),
        discountApplied: discountPercentage > 0,
        promoCode: promoCode || null,
        discountAmount: discountAmount || 0
      };
      
      await createOrder(orderData);
      
      // Clear cart and navigate to success page
      clearCart();
      navigate('/checkout/success', { 
        state: { 
          orderData: {
            ...orderData,
            paymentDetails: paymentMethod === 'transfer' ? paymentDetails : null
          }
        } 
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(
        language === 'ru' 
          ? 'Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.' 
          : 'Тапсырысты рәсімдеу кезінде қате пайда болды. Қайталап көріңіз.',
        { duration: 1000 }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {language === 'ru' ? 'Оформление заказа' : 'Тапсырысты рәсімдеу'}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Order Form */}
              <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold mb-4">
                      {language === 'ru' ? 'Контактная информация' : 'Байланыс ақпараты'}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          {language === 'ru' ? 'Имя и фамилия' : 'Аты-жөні'} *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                          {language === 'ru' ? 'Телефон' : 'Телефон'} *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+7 (XXX) XXX-XX-XX"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          {language === 'ru' ? 'Email' : 'Email'}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-4">
                      {language === 'ru' ? 'Адрес доставки' : 'Жеткізу мекенжайы'}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">
                          {language === 'ru' ? 'Город' : 'Қала'} *
                        </label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                          {language === 'ru' ? 'Почтовый индекс' : 'Пошта индексі'}
                        </label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium mb-1">
                          {language === 'ru' ? 'Адрес (улица, дом, квартира)' : 'Мекенжай (көше, үй, пәтер)'} *
                        </label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="notes" className="block text-sm font-medium mb-1">
                        {language === 'ru' ? 'Примечания к заказу' : 'Тапсырысқа қатысты ескертпелер'}
                      </label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-4">
                      {language === 'ru' ? 'Способ оплаты' : 'Төлем әдісі'}
                    </h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="transfer"
                          name="paymentMethod"
                          value="transfer"
                          checked={paymentMethod === 'transfer'}
                          onChange={() => setPaymentMethod('transfer')}
                          className="h-4 w-4 text-furniture-primary focus:ring-furniture-primary border-gray-300"
                        />
                        <label htmlFor="transfer" className="ml-2 block text-sm">
                          {language === 'ru' ? 'Банковский перевод' : 'Банк аударымы'}
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                            {language === 'ru' ? 'Оформление...' : 'Рәсімдеу...'}
                          </span>
                        ) : (
                          language === 'ru' ? 'Оформить заказ' : 'Тапсырысты рәсімдеу'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-20">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ru' ? 'Ваш заказ' : 'Сіздің тапсырысыңыз'}
                  </h2>
                  
                  <div className="divide-y">
                    {cart.map((item) => (
                      <div key={item.id} className="py-3 flex justify-between">
                        <div>
                          <p className="font-medium">
                            {language === 'ru' ? item.name : (item.nameKz || item.name)}
                          </p>
                          <p className="text-sm text-furniture-secondary">
                            {item.quantity} x {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸
                          </p>
                        </div>
                        <p className="font-medium">
                          {(item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="mb-4">
                      <PromoCodeInput />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p>{language === 'ru' ? 'Подытог' : 'Аралық сома'}</p>
                        <p>{totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸</p>
                      </div>
                      
                      {discountPercentage > 0 && (
                        <div className="flex justify-between text-green-600">
                          <p>{language === 'ru' ? `Скидка (${discountPercentage}%)` : `Жеңілдік (${discountPercentage}%)`}</p>
                          <p>-{discountAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <p>{language === 'ru' ? 'Итого' : 'Жалпы'}</p>
                        <p>{finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
