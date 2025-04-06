
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, Copy, Upload, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { usePromotion } from '@/contexts/PromotionContext';
import { createOrder, uploadReceiptImage } from '@/services/orderService';
import { fetchAdminSettings } from '@/services/adminService';
import { formatPrice } from '@/lib/utils';
import PromoCodeInput from '@/components/PromoCodeInput';
import { AdminSettings } from '@/types/admin';

// Function to generate payment purpose with random characters and promo code digits
const generatePaymentPurpose = (promoCode: string | undefined) => {
  // Generate 5 random characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomChars = '';
  for (let i = 0; i < 5; i++) {
    randomChars += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Extract digits from promo code if it exists
  let digits = '';
  if (promoCode) {
    digits = promoCode.replace(/\D/g, ''); // Remove non-digits
  }
  
  return `${randomChars}${digits}`;
};

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
  const [paymentPurpose, setPaymentPurpose] = useState('');
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const subtotal = calculateSubtotal();
  const discountAmount = activePromotion ? calculateDiscountedAmount(subtotal) : 0;
  const total = subtotal - discountAmount;
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchAdminSettings();
        setAdminSettings(settings);
        setPaymentDetails({
          recipient: settings.paymentDetails.recipientName,
          bankAccount: settings.paymentDetails.accountNumber,
          bankName: settings.paymentDetails.bankName,
          amount: total
        });
      } catch (error) {
        console.error('Failed to load admin settings:', error);
      }
    };
    
    loadSettings();
  }, [total, name]);
  
  // Generate payment purpose when promo code changes
  useEffect(() => {
    setPaymentPurpose(generatePaymentPurpose(activePromotion?.code));
  }, [activePromotion]);
  
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);
  
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
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(language === 'ru' ? 'Скопировано!' : 'Көшірілді!', {
      duration: 1500
    });
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
    setShowPaymentInfo(false);
    setLoadingOrder(true);
    
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 80) {
          return 80;
        }
        return prev + 5;
      });
    }, 200);
    
    setProgressInterval(interval);
    
    try {
      const orderData = {
        customerName: name,
        customerPhone: phone,
        customerEmail: email || undefined,
        city,
        deliveryAddress: address,
        postalCode: postalCode || undefined,
        paymentMethod: paymentMethod,
        additionalNotes: additionalNotes || undefined,
        totalAmount: total,
        promotionCode: activePromotion?.code,
        discountAmount: discountAmount,
        items: items
      };
      
      console.log('Submitting order:', orderData);
      
      const response = await createOrder(orderData);
      
      console.log('Order created with ID:', response.orderId);
      
      setOrderId(response.orderId);
      setPaymentDetails({
        ...response.paymentDetails,
        purpose: paymentPurpose
      });
      setProgressValue(100);
      setShowPaymentInfo(true);
      setLoadingOrder(false);
      
      if (response.orderId !== 'error' && response.orderId !== 'temporary') {
        clearCart();
        
        toast.success(language === 'ru' ? 'Заказ успешно оформлен!' : 'Тапсырыс сәтті рәсімделді!', {
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      setProgressValue(100);
      setShowPaymentInfo(true);
      setLoadingOrder(false);
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setShowPaymentDialog(false);
    if (paymentComplete) {
      navigate('/');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };
  
  const handleUploadReceipt = async () => {
    if (!receiptFile || !orderId) return;
    
    setUploadingReceipt(true);
    try {
      const result = await uploadReceiptImage(orderId, receiptFile);
      
      if (result.success) {
        toast.success(
          language === 'ru' 
            ? 'Чек успешно загружен!' 
            : 'Түбіртек сәтті жүктелді!',
          { duration: 3000 }
        );
      } else {
        toast.error(
          language === 'ru' 
            ? `Ошибка при загрузке чека: ${result.error}` 
            : `Түбіртекті жүктеу кезінде қате: ${result.error}`,
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast.error(
        language === 'ru' 
          ? 'Не удалось загрузить чек' 
          : 'Түбіртекті жүктеу мүмкін болмады',
        { duration: 3000 }
      );
    } finally {
      setUploadingReceipt(false);
    }
  };
  
  const handlePaymentComplete = () => {
    setPaymentComplete(true);
    toast.success(
      language === 'ru' 
        ? 'Спасибо за оплату! Мы свяжемся с вами для подтверждения заказа.' 
        : 'Төлем жасағаныңыз үшін рахмет! Тапсырысты растау үшін сізбен байланысамыз.',
      { duration: 5000 }
    );
    
    setTimeout(() => {
      setShowPaymentDialog(false);
      navigate('/');
    }, 2000);
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

      <TooltipProvider>
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>
                {loadingOrder
                  ? language === 'ru' ? 'Обработка заказа' : 'Тапсырысты өңдеу'
                  : language === 'ru' ? 'Информация об оплате' : 'Төлем туралы ақпарат'
                }
              </DialogTitle>
              <DialogDescription>
                {loadingOrder
                  ? language === 'ru' 
                    ? 'Пожалуйста, подождите, пока мы обрабатываем ваш заказ...' 
                    : 'Тапсырысыңызды өңдеу барысында күте тұрыңыз...'
                  : language === 'ru'
                    ? 'Используйте следующие реквизиты для оплаты заказа'
                    : 'Тапсырысқа төлем жасау үшін келесі деректемелерді пайдаланыңыз'
                }
              </DialogDescription>
            </DialogHeader>
            
            {loadingOrder ? (
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
                      <div className="col-span-2 flex items-center">
                        <div className="font-medium mr-2">{paymentDetails.recipient}</div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-gray-200"
                              onClick={() => copyToClipboard(paymentDetails.recipient)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {language === 'ru' ? 'Копировать' : 'Көшіру'}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <div className="font-medium text-gray-500">{language === 'ru' ? 'Номер счета' : 'Шот нөмірі'}</div>
                      <div className="col-span-2 flex items-center">
                        <div className="font-medium mr-2">{paymentDetails.bankAccount}</div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-gray-200"
                              onClick={() => copyToClipboard(paymentDetails.bankAccount)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {language === 'ru' ? 'Копировать' : 'Көшіру'}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <div className="font-medium text-gray-500">{language === 'ru' ? 'Банк' : 'Банк'}</div>
                      <div className="col-span-2 flex items-center">
                        <div className="font-medium mr-2">{paymentDetails.bankName}</div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-gray-200"
                              onClick={() => copyToClipboard(paymentDetails.bankName)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {language === 'ru' ? 'Копировать' : 'Көшіру'}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <div className="font-medium text-gray-500">{language === 'ru' ? 'Сумма' : 'Сома'}</div>
                      <div className="col-span-2 flex items-center">
                        <div className="font-medium mr-2">{formatPrice(paymentDetails.amount)}</div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-gray-200"
                              onClick={() => copyToClipboard(formatPrice(paymentDetails.amount).toString())}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {language === 'ru' ? 'Копировать' : 'Көшіру'}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      {/* Payment Purpose field */}
                      <div className="font-medium text-gray-500">{language === 'ru' ? 'Назначение' : 'Мақсаты'}</div>
                      <div className="col-span-2 flex items-center">
                        <div className="font-medium mr-2">{paymentPurpose}</div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-gray-200"
                              onClick={() => copyToClipboard(paymentPurpose)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {language === 'ru' ? 'Копировать' : 'Көшіру'}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t">
                      <p className="text-sm text-gray-500 mb-4">
                        {language === 'ru' 
                          ? 'После совершения платежа, пожалуйста, прикрепите чек об оплате.' 
                          : 'Төлем жасағаннан кейін, төлем түбіртегін бекітіңіз.'}
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <input
                            type="file"
                            id="receipt"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*,.pdf"
                          />
                          <div className="flex flex-wrap gap-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingReceipt}
                              className="flex-1"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {language === 'ru' ? 'Прикрепить чек' : 'Түбіртекті тіркеу'}
                            </Button>
                            
                            {receiptFile && (
                              <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={handleUploadReceipt}
                                disabled={uploadingReceipt}
                                className="flex-1"
                              >
                                {uploadingReceipt ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                {language === 'ru' ? 'Загрузить' : 'Жүктеу'}
                              </Button>
                            )}
                          </div>
                          
                          {receiptFile && (
                            <p className="text-xs text-gray-500 mt-2">
                              {language === 'ru' ? 'Выбран файл:' : 'Таңдалған файл:'} {receiptFile.name}
                            </p>
                          )}
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={handlePaymentComplete}
                          disabled={paymentComplete}
                        >
                          {paymentComplete ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : null}
                          {language === 'ru' ? 'Я оплатил(а)' : 'Мен төледім'}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 pt-4 border-t">
                      <Button variant="outline" onClick={handleCloseDialog}>
                        {language === 'ru' ? 'Закрыть' : 'Жабу'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </TooltipProvider>
      
      <input
        type="file"
        id="receipt"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
      />
    </Layout>
  );
};

export default CheckoutPage;
