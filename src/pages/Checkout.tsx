
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePromotion } from '@/contexts/PromotionContext';
import PromoCodeInput from '@/components/PromoCodeInput';
import { createOrder } from '@/services/orderService';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const { items: cartItems, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { language } = useLanguage();
  const { activePromotion, calculateDiscountedAmount } = usePromotion();
  const navigate = useNavigate();

  // Calculate discount amount
  const discountAmount = calculateDiscountedAmount(totalPrice);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                {language === 'ru' ? 'Корзина пуста' : 'Себет бос'}
              </h1>
              <p className="text-furniture-secondary mb-8">
                {language === 'ru' 
                  ? 'Добавьте товары в корзину, чтобы оформить заказ'
                  : 'Тапсырыс беру үшін себетке тауарлар қосыңыз'}
              </p>
              <Button onClick={() => navigate('/catalog')}>
                {language === 'ru' ? 'Перейти в каталог' : 'Каталогқа өту'}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const finalPrice = totalPrice - discountAmount;

  const validateForm = () => {
    if (!customerName.trim()) {
      toast.error(language === 'ru' ? 'Введите имя' : 'Атыңызды енгізіңіз');
      return false;
    }
    if (!customerPhone.trim()) {
      toast.error(language === 'ru' ? 'Введите телефон' : 'Телефонды енгізіңіз');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { orderId, reference } = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddress: deliveryAddress.trim() || undefined,
        city: city.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        items: cartItems,
        totalAmount: finalPrice,
        paymentMethod: 'arsenalpay',
        promotionCode: activePromotion?.code,
        discountAmount,
        additionalNotes: additionalNotes.trim() || undefined,
      });

      console.log('Order created:', { orderId, reference });

      // Use ArsenalPay
      const { data, error } = await supabase.functions.invoke('arsenalpay-create', {
        body: { 
          orderId, 
          amount: finalPrice, 
          description: `Оплата заказа ${reference || orderId}`,
          customerEmail: customerEmail.trim() || 'guest@example.com'
        },
      });

      if (error) {
        console.error('ArsenalPay error:', error);
        toast.error(language === 'ru' ? 'Ошибка создания платежа' : 'Төлем жасауда қате');
        setIsSubmitting(false);
        return;
      }

      const paymentUrl = data?.payment_url;
      if (!paymentUrl) {
        console.error('No payment URL received:', data);
        toast.error(language === 'ru' ? 'Не получили ссылку на оплату' : 'Төлем сілтемесі алынбады');
        setIsSubmitting(false);
        return;
      }

      // Clear cart and redirect to payment
      clearCart();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(language === 'ru' ? 'Ошибка при оформлении заказа' : 'Тапсырыс беруде қате');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {language === 'ru' ? 'Оформление заказа' : 'Тапсырысты рәсімдеу'}
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ru' ? 'Ваш заказ' : 'Сіздің тапсырысыңыз'}
                </h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {language === 'ru' ? item.name : item.nameKz || item.name}
                        </h3>
                        <p className="text-furniture-secondary text-sm">
                          {item.price} ₽ × {item.quantity}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <PromoCodeInput />

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Подытог:' : 'Аралық сома:'}</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{language === 'ru' ? 'Скидка:' : 'Жеңілдік:'}</span>
                      <span>-{discountAmount} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>{language === 'ru' ? 'Итого:' : 'Барлығы:'}</span>
                    <span>{finalPrice} ₽</span>
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ru' ? 'Контактная информация' : 'Байланыс ақпараты'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">
                        {language === 'ru' ? 'Имя и фамилия *' : 'Аты-жөні *'}
                      </Label>
                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={language === 'ru' ? 'Иван Иванов' : 'Иван Иванов'}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customerPhone">
                        {language === 'ru' ? 'Телефон *' : 'Телефон *'}
                      </Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+7 777 123 45 67"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customerEmail">
                        {language === 'ru' ? 'Email' : 'Email'}
                      </Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="ivan@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ru' ? 'Адрес доставки' : 'Жеткізу мекенжайы'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="city">
                        {language === 'ru' ? 'Город' : 'Қала'}
                      </Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={language === 'ru' ? 'Алматы' : 'Алматы'}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryAddress">
                        {language === 'ru' ? 'Адрес' : 'Мекенжай'}
                      </Label>
                      <Input
                        id="deliveryAddress"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder={language === 'ru' ? 'ул. Абая, д. 123, кв. 45' : 'Абай көш., 123 үй, 45 пәт.'}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="postalCode">
                        {language === 'ru' ? 'Почтовый индекс' : 'Пошта индексі'}
                      </Label>
                      <Input
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="050000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalNotes">
                    {language === 'ru' ? 'Дополнительные комментарии' : 'Қосымша ескертпелер'}
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder={language === 'ru' 
                      ? 'Особые пожелания по доставке или заказу...' 
                      : 'Жеткізу немесе тапсырыс бойынша ерекше тілектер...'}
                    rows={3}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ru' ? 'Способ оплаты' : 'Төлем әдісі'}
                  </h2>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg bg-blue-50">
                    <CreditCard size={20} className="text-blue-600" />
                    <span className="font-medium">ArsenalPay</span>
                  </div>

                  {/* Payment Security Information */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">
                      {language === 'ru' ? 'Безопасность платежей' : 'Төлем қауіпсіздігі'}
                    </h3>
                    <div className="text-sm space-y-2">
                      <p>
                        {language === 'ru' 
                          ? 'Все платежи обрабатываются через защищенное соединение с использованием технологии шифрования SSL. Данные вашей карты передаются в зашифрованном виде и не сохраняются на нашем сервере.'
                          : 'Барлық төлемдер SSL шифрлау технологиясын пайдалана отырып қорғалған байланыс арқылы өңделеді. Сіздің карта деректеріңіз шифрланған түрде беріледі және біздің серверде сақталмайды.'
                        }
                      </p>
                      <p>
                        {language === 'ru' 
                          ? 'Мы принимаем к оплате банковские карты международных платежных систем Visa, MasterCard и МИР.'
                          : 'Біз Visa, MasterCard және МИР халықаралық төлем жүйелерінің банк карталарын қабылдаймыз.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (language === 'ru' ? 'Оформление...' : 'Рәсімдеу...') 
                    : (language === 'ru' ? 'Оплатить через ArsenalPay' : 'ArsenalPay арқылы төлеу')
                  }
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
