import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Upload, Check } from 'lucide-react';
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
import { createOrder, uploadReceiptImage } from '@/services/orderService';
import { fetchAdminSettings } from '@/services/adminService';
import { AdminSettings } from '@/types/admin';
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
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderReference, setOrderReference] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  // Load admin settings for bank transfer info
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchAdminSettings();
        setAdminSettings(settings);
      } catch (error) {
        console.error('Error loading admin settings:', error);
      }
    };
    loadSettings();
  }, []);

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
      const { orderId: newOrderId, reference } = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddress: deliveryAddress.trim() || undefined,
        city: city.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        items: cartItems,
        totalAmount: finalPrice,
        paymentMethod: 'bank_transfer',
        promotionCode: activePromotion?.code,
        discountAmount,
        additionalNotes: additionalNotes.trim() || undefined,
      });

      console.log('Order created:', { orderId: newOrderId, reference });
      
      setOrderId(newOrderId);
      setOrderReference(reference);
      
      toast.success(language === 'ru' 
        ? 'Заказ создан! Загрузите чек об оплате и нажмите "Я оплатил"' 
        : 'Тапсырыс жасалды! Төлем чегін жүктеп, "Мен төледім" дегенді басыңыз');
        
      // Clear cart after successful order creation
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(language === 'ru' ? 'Ошибка при оформлении заказа' : 'Тапсырыс беруде қате');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const url = URL.createObjectURL(file);
      setReceiptUrl(url);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!receiptFile || !orderId) {
      toast.error(language === 'ru' ? 'Загрузите чек об оплате' : 'Төлем чегін жүктеңіз');
      return;
    }

    setIsPaid(true);
    
    try {
      // Upload receipt
      const { success, error } = await uploadReceiptImage(orderId, receiptFile);
      
      if (!success) {
        console.error('Receipt upload error:', error);
        toast.error(language === 'ru' ? 'Ошибка загрузки чека' : 'Чек жүктеуде қате');
        setIsPaid(false);
        return;
      }

      // Send notification to Telegram
      const { error: telegramError } = await supabase.functions.invoke('send-order-notification', {
        body: { orderId }
      });

      if (telegramError) {
        console.error('Telegram notification error:', telegramError);
        // Don't fail the entire process if Telegram fails
      }

      toast.success(language === 'ru' 
        ? 'Спасибо! Ваш заказ отправлен на обработку' 
        : 'Рахмет! Сіздің тапсырысыңыз өңдеуге жіберілді');
        
      // Navigate to success page
      navigate('/checkout-success', { 
        state: { 
          orderId, 
          reference: orderReference, 
          paymentMethod: 'bank_transfer' 
        } 
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error(language === 'ru' ? 'Ошибка подтверждения оплаты' : 'Төлемді растауда қате');
      setIsPaid(false);
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
                  
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Check className="text-green-600" size={20} />
                      <Label className="font-medium">
                        {language === 'ru' ? 'Банковский перевод' : 'Банктік аударым'}
                      </Label>
                    </div>
                    
                    {adminSettings && (
                      <div className="text-sm space-y-2">
                        <h3 className="font-semibold mb-2">
                          {language === 'ru' ? 'Реквизиты для перевода:' : 'Аударым деректемелері:'}
                        </h3>
                        <p><strong>{language === 'ru' ? 'Банк:' : 'Банк:'}</strong> {adminSettings.paymentDetails.bankName}</p>
                        <p><strong>{language === 'ru' ? 'Номер карты:' : 'Карта нөмірі:'}</strong> {adminSettings.paymentDetails.accountNumber}</p>
                        <p><strong>{language === 'ru' ? 'Получатель:' : 'Алушы:'}</strong> {adminSettings.paymentDetails.recipientName}</p>
                        <p><strong>{language === 'ru' ? 'Сумма к оплате:' : 'Төлем сомасы:'}</strong> {finalPrice} ₽</p>
                      </div>
                    )}
                  </div>
                </div>

                {!orderId ? (
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (language === 'ru' ? 'Оформление...' : 'Рәсімдеу...') 
                      : (language === 'ru' ? 'Оформить заказ' : 'Тапсырыс беру')
                    }
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold mb-2 text-green-800">
                        {language === 'ru' 
                          ? `Заказ №${orderReference} создан!` 
                          : `Тапсырыс №${orderReference} жасалды!`
                        }
                      </h3>
                      <p className="text-sm text-green-700">
                        {language === 'ru' 
                          ? 'Переведите указанную сумму на реквизиты выше, загрузите скриншот чека и нажмите "Я оплатил"' 
                          : 'Жоғарыда көрсетілген деректемелерге сомасын аударып, чек скриншотын жүктеп, "Мен төледім" дегенді басыңыз'
                        }
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="receipt-upload" className="block mb-2">
                        {language === 'ru' ? 'Загрузить чек об оплате *' : 'Төлем чегін жүктеу *'}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          id="receipt-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptUpload}
                          className="hidden"
                        />
                        {receiptUrl ? (
                          <div className="space-y-3">
                            <img 
                              src={receiptUrl} 
                              alt="Receipt" 
                              className="max-h-32 mx-auto rounded border"
                            />
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => document.getElementById('receipt-upload')?.click()}
                            >
                              {language === 'ru' ? 'Изменить файл' : 'Файлды өзгерту'}
                            </Button>
                          </div>
                        ) : (
                          <div 
                            className="cursor-pointer"
                            onClick={() => document.getElementById('receipt-upload')?.click()}
                          >
                            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">
                              {language === 'ru' 
                                ? 'Нажмите для загрузки скриншота чека' 
                                : 'Чек скриншотын жүктеу үшін басыңыз'
                              }
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {language === 'ru' ? 'Поддерживаются: JPG, PNG' : 'Қолдау көрсетіледі: JPG, PNG'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button 
                      type="button"
                      onClick={handlePaymentConfirm}
                      className="w-full"
                      disabled={!receiptFile || isPaid}
                    >
                      {isPaid 
                        ? (language === 'ru' ? 'Обработка...' : 'Өңдеу...') 
                        : (language === 'ru' ? 'Я оплатил' : 'Мен төледім')
                      }
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
