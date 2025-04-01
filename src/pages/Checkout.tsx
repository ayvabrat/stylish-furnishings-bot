import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { usePromotion } from '@/contexts/PromotionContext';
import { createOrder } from '@/services/orderService';
import { fetchAdminSettings } from '@/services/adminService';
import { formatPrice } from '@/lib/utils';
import PromoCodeInput from '@/components/PromoCodeInput';
import { AdminSettings } from '@/types/admin';

const CheckoutPage = () => {
  const { language } = useLanguage();
  const { items, clearCart, calculateSubtotal } = useCart();
  const { activePromotion, calculateDiscountedAmount } = usePromotion();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer'>('bank_transfer');
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    city?: string;
    address?: string;
  }>({});
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchAdminSettings();
        setAdminSettings(settings);
        setPaymentDetails({
          recipient: settings.paymentDetails.recipientName,
          bankAccount: settings.paymentDetails.accountNumber,
          bankName: settings.paymentDetails.bankName,
          bic: '',
          amount: total,
          reference: `Order from ${name}`
        });
      } catch (error) {
        console.error('Failed to load admin settings:', error);
      }
    };
    
    loadSettings();
  }, [total, name]);
  
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);
  
  const subtotal = calculateSubtotal();
  const discountAmount = activePromotion ? calculateDiscountedAmount(subtotal) : 0;
  const total = subtotal - discountAmount;
  
  const validateForm = () => {
    const newErrors: {
      name?: string;
      phone?: string;
      city?: string;
      address?: string;
    } = {};
    let isValid = true;
    
    if (!name.trim()) {
      newErrors.name = language === 'ru' ? 'Введите ваше имя' : 'Атыңызды енгізіңіз';
      isValid = false;
    }
    
    if (!phone.trim()) {
      newErrors.phone = language === 'ru' ? 'Введите ваш телефон' : 'Телефоныңызды енгізіңіз';
      isValid = false;
    }
    
    if (!city.trim()) {
      newErrors.city = language === 'ru' ? 'Введите ваш город' : 'Қалаңызды енгізіңіз';
      isValid = false;
    }
    
    if (!address.trim()) {
      newErrors.address = language === 'ru' ? 'Введите ваш адрес' : 'Мекенжайыңызды енгізіңіз';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (items.length === 0) {
      toast.error(language === 'ru' ? 'Ваша корзина пуста' : 'Сіздің себетіңіз бос', {
        duration: 3000
      });
      return;
    }
    
    setIsSubmitting(true);
    setShowPaymentDialog(true);
    setProgressValue(0);
    
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 99) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / 150);
      });
    }, 100);
    
    setProgressInterval(interval);
    
    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        productName: language === 'ru' ? item.name : item.nameKz,
        quantity: item.quantity,
        price: item.price
      }));
      
      const orderData = {
        customerName: name,
        customerPhone: phone,
        customerEmail: email || null,
        city,
        deliveryAddress: address,
        postalCode: postalCode || null,
        paymentMethod: paymentMethod,
        additionalNotes: additionalNotes || null,
        totalAmount: total,
        items: orderItems,
        promoCode: activePromotion?.code || null,
        discountAmount: discountAmount || 0
      };
      
      console.log('Submitting order:', orderData);
      
      const response = await createOrder(orderData);
      
      console.log('Order created with ID:', response.orderId);
      
      setPaymentDetails(response.paymentDetails);
      
      setProgressValue(100);
      
      clearCart();
      
      toast.success(language === 'ru' ? 'Заказ успешно оформлен!' : 'Тапсырыс сәтті рәсімделді!', {
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error(language === 'ru' ? 'Ошибка при оформлении заказа' : 'Тапсырысты рәсімдеу кезінде қате', {
        duration: 3000
      });
      setShowPaymentDialog(false);
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setShowPaymentDialog(false);
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            {language === 'ru' ? 'Оформление заказа' : 'Тапсырысты рәсімдеу'}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ru' ? 'Контактная информация' : 'Байланыс ақпараты'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">
                        {language === 'ru' ? 'Имя' : 'Аты'} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">
                        {language === 'ru' ? 'Телефон' : 'Телефон'} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 (XXX) XXX-XX-XX"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">
                        {language === 'ru' ? 'Email (необязательно)' : 'Email (міндетті емес)'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ru' ? 'Адрес доставки' : 'Жеткізу мекенжайы'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="city">
                        {language === 'ru' ? 'Город' : 'Қала'} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="address">
                        {language === 'ru' ? 'Адрес' : 'Мекенжай'} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="postalCode">
                        {language === 'ru' ? 'Почтовый индекс (необязательно)' : 'Пошта индексі (міндетті емес)'}
                      </Label>
                      <Input
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="additionalNotes">
                        {language === 'ru' ? 'Дополнительная информация (необязательно)' : 'Қосымша ақпарат (міндетті емес)'}
                      </Label>
                      <Textarea
                        id="additionalNotes"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder={language === 'ru' ? 'Комментарии к заказу или доставке' : 'Тапсырыс немесе жеткізу туралы пікірлер'}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ru' ? 'Способ оплаты' : 'Төлем әдісі'}
                  </h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod as any}>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer">
                        <CreditCard className="h-4 w-4 mr-2 text-furniture-secondary" />
                        <div>
                          <div>{language === 'ru' ? 'Банковский перевод' : 'Банк аударымы'}</div>
                          <p className="text-sm text-gray-500">
                            {language === 'ru' ? 'Реквизиты для оплаты будут отправлены после оформления заказа' : 'Төлем реквизиттері тапсырыс рәсімделгеннен кейін жіберіледі'}
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              
                <div className="mt-8">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting || items.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {language === 'ru' ? 'Оформление...' : 'Рәсімделуде...'}
                      </>
                    ) : (
                      language === 'ru' ? 'Оформить заказ' : 'Тапсырысты рәсімдеу'
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ru' ? 'Ваш заказ' : 'Сіздің тапсырысыңыз'}
                </h2>
                
                <div className="space-y-4">
                  {items.length > 0 ? (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <span className="font-medium">
                              {language === 'ru' ? item.name : item.nameKz}
                            </span>
                            <span className="text-gray-600"> × {item.quantity}</span>
                          </div>
                          <div className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {language === 'ru' ? 'Корзина пуста' : 'Себет бос'}
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <PromoCodeInput />
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'ru' ? 'Подытог' : 'Аралық жиынтық'}
                      </span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    {activePromotion && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          {language === 'ru' ? 'Скидка' : 'Жеңілдік'} ({activePromotion.discountPercentage}%)
                        </span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>{language === 'ru' ? 'Итого' : 'Барлығы'}</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {progressValue < 100 
                ? language === 'ru' ? 'Обработка заказа' : 'Тапсырысты өңдеу'
                : language === 'ru' ? 'Информация об оплате' : 'Төлем туралы ақпарат'
              }
            </DialogTitle>
            <DialogDescription>
              {progressValue < 100 
                ? language === 'ru' 
                  ? 'Пожалуйста, подождите, пока мы обрабатываем ваш заказ...' 
                  : 'Тапсырысыңызды өңдеу барысында күте тұрыңыз...'
                : language === 'ru'
                  ? 'Используйте следующие реквизиты для оплаты заказа'
                  : 'Тапсырысқа төлем жасау үшін келесі деректемелерді пайдаланыңыз'
              }
            </DialogDescription>
          </DialogHeader>
          
          {progressValue < 100 ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Progress value={progressValue} className="h-2" />
                <p className="text-sm text-center text-gray-500">{Math.round(progressValue)}%</p>
              </div>
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-furniture-primary" />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {paymentDetails && (
                <>
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <div className="font-medium text-gray-500">{language === 'ru' ? 'Получатель' : 'Алушы'}</div>
                    <div className="col-span-2 font-medium cursor-pointer hover:bg-gray-100 p-1 rounded" 
                         onClick={() => {navigator.clipboard.writeText(paymentDetails.recipient); 
                                         toast.success(language === 'ru' ? 'Скопировано!' : 'Көшірілді!');}}>
                      {paymentDetails.recipient}
                    </div>
                    
                    <div className="font-medium text-gray-500">{language === 'ru' ? 'Номер счета' : 'Шот нөмірі'}</div>
                    <div className="col-span-2 font-medium cursor-pointer hover:bg-gray-100 p-1 rounded" 
                         onClick={() => {navigator.clipboard.writeText(paymentDetails.bankAccount); 
                                         toast.success(language === 'ru' ? 'Скопировано!' : 'Көшірілді!');}}>
                      {paymentDetails.bankAccount}
                    </div>
                    
                    <div className="font-medium text-gray-500">{language === 'ru' ? 'Банк' : 'Банк'}</div>
                    <div className="col-span-2 font-medium cursor-pointer hover:bg-gray-100 p-1 rounded" 
                         onClick={() => {navigator.clipboard.writeText(paymentDetails.bankName); 
                                         toast.success(language === 'ru' ? 'Скопировано!' : 'Көшірілді!');}}>
                      {paymentDetails.bankName}
                    </div>
                    
                    <div className="font-medium text-gray-500">{language === 'ru' ? 'Сумма' : 'Сома'}</div>
                    <div className="col-span-2 font-medium cursor-pointer hover:bg-gray-100 p-1 rounded" 
                         onClick={() => {navigator.clipboard.writeText(formatPrice(paymentDetails.amount).toString()); 
                                         toast.success(language === 'ru' ? 'Скопировано!' : 'Көшірілді!');}}>
                      {formatPrice(paymentDetails.amount)}
                    </div>
                    
                    <div className="font-medium text-gray-500">{language === 'ru' ? 'Назначение' : 'Тағайындау'}</div>
                    <div className="col-span-2 font-medium cursor-pointer hover:bg-gray-100 p-1 rounded" 
                         onClick={() => {navigator.clipboard.writeText(paymentDetails.reference); 
                                         toast.success(language === 'ru' ? 'Скопировано!' : 'Көшірілді!');}}>
                      {paymentDetails.reference}
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t">
                    <p className="text-sm text-gray-500">
                      {language === 'ru' 
                        ? 'После совершения платежа, пожалуйста, сохраните квитанцию. Мы свяжемся с вами для подтверждения заказа.'
                        : 'Төлем жасағаннан кейін түбіртекті сақтап қойыңыз. Тапсырысты растау үшін сізбен байланысамыз.'
                      }
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleCloseDialog}>
                      {language === 'ru' ? 'Закрыть' : 'Жабу'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CheckoutPage;
