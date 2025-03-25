
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { usePromotion } from '@/contexts/PromotionContext';
import { sendOrderToTelegram } from '@/services/telegramService';
import { supabase } from '@/integrations/supabase/client';
import { getAllowedPaymentMethods } from '@/services/orderService';

// Define validation schema based on language
const getCheckoutSchema = (language: 'ru' | 'kz') => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  
  return z.object({
    name: z.string().min(2, {
      message: language === 'ru' 
        ? 'Имя должно содержать минимум 2 символа' 
        : 'Аты кемінде 2 таңбадан тұруы керек',
    }),
    phone: z.string().regex(phoneRegex, {
      message: language === 'ru'
        ? 'Введите корректный номер телефона'
        : 'Жарамды телефон нөмірін енгізіңіз',
    }),
    email: z.string().email({
      message: language === 'ru'
        ? 'Введите корректный email'
        : 'Жарамды email енгізіңіз',
    }).optional().or(z.literal('')),
    city: z.string().min(2, {
      message: language === 'ru'
        ? 'Город должен содержать минимум 2 символа'
        : 'Қала кемінде 2 таңбадан тұруы керек',
    }),
    address: z.string().min(5, {
      message: language === 'ru'
        ? 'Адрес должен содержать минимум 5 символов'
        : 'Мекенжай кемінде 5 таңбадан тұруы керек',
    }),
    postalCode: z.string().optional(),
    notes: z.string().optional(),
  });
};

// Form values type
type CheckoutFormValues = z.infer<ReturnType<typeof getCheckoutSchema>>;

const Checkout = () => {
  const { language, t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const { promoCode, discountPercentage, applyPromoCode, isValidatingPromo } = usePromotion();
  const navigate = useNavigate();
  
  const [promoInput, setPromoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    bankName: string;
    accountNumber: string;
    recipientName: string;
  } | null>(null);
  
  // Get allowed payment methods
  const allowedPaymentMethods = getAllowedPaymentMethods();
  
  // Create form with validation schema
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(getCheckoutSchema(language)),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      city: '',
      address: '',
      postalCode: '',
      notes: '',
    },
  });
  
  // Calculate final price with discount
  const discountAmount = Math.round(totalPrice * (discountPercentage / 100));
  const finalPrice = totalPrice - discountAmount;
  
  // Format prices with thousand separators
  const formattedTotalPrice = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const formattedDiscountAmount = discountAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const formattedFinalPrice = finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  // Handle promo code application
  const handleApplyPromoCode = async () => {
    if (!promoInput.trim()) {
      toast.error(language === 'ru' ? 'Введите промокод' : 'Промокод енгізіңіз');
      return;
    }
    
    await applyPromoCode(promoInput);
  };
  
  // Handle form submission
  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error(language === 'ru' ? 'Корзина пуста' : 'Себет бос');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data for Telegram and Supabase
      const orderItems = items.map(item => ({
        product_id: item.id,
        product_name: language === 'ru' ? item.name : (item.nameKz || item.name),
        price: item.price,
        quantity: item.quantity
      }));
      
      const orderData = {
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: data.email || null,
        city: data.city,
        delivery_address: data.address,
        postal_code: data.postalCode || null,
        payment_method: 'card', // Only card payment is allowed
        additional_notes: data.notes || null,
        total_amount: finalPrice,
        status: 'pending',
      };
      
      // Save order to Supabase
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single();
      
      if (orderError) {
        console.error('Failed to create order:', orderError);
        toast.error(language === 'ru' ? 'Ошибка при создании заказа' : 'Тапсырысты жасау қатесі');
        setIsSubmitting(false);
        return;
      }
      
      // Save order items to Supabase
      const orderItemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: orderResult.id
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithOrderId);
      
      if (itemsError) {
        console.error('Failed to save order items:', itemsError);
      }
      
      // Send order to Telegram
      const telegramResponse = await sendOrderToTelegram({
        orderId: orderResult.id,
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email || 'Не указан',
        deliveryAddress: `${data.city}, ${data.address}${data.postalCode ? `, ${data.postalCode}` : ''}`,
        paymentMethod: language === 'ru' ? 'Банковская карта' : 'Банк картасы',
        notes: data.notes || (language === 'ru' ? 'Нет примечаний' : 'Ескертулер жоқ'),
        items: items.map(item => ({
          name: language === 'ru' ? item.name : (item.nameKz || item.name),
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        subtotal: totalPrice,
        discount: {
          code: promoCode || null,
          percentage: discountPercentage,
          amount: discountAmount
        },
        total: finalPrice
      });
      
      if (!telegramResponse.success) {
        console.error('Failed to send order to Telegram:', telegramResponse.error);
        toast.error(language === 'ru' ? 'Ошибка при отправке заказа' : 'Тапсырысты жіберу қатесі');
        setIsSubmitting(false);
        return;
      }
      
      // Fetch payment details from Supabase
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'admin_settings')
        .single();
      
      if (settingsError || !settingsData) {
        console.error('Failed to fetch payment details:', settingsError);
        // Use default payment details if settings not found
        setPaymentDetails({
          bankName: 'Казкоммерцбанк',
          accountNumber: 'KZ123456789012345678',
          recipientName: 'ТОО "ProMebel"'
        });
      } else {
        try {
          const adminSettings = JSON.parse(settingsData.value);
          setPaymentDetails(adminSettings.paymentDetails);
        } catch (e) {
          console.error('Error parsing admin settings:', e);
          // Use default payment details if parsing fails
          setPaymentDetails({
            bankName: 'Казкоммерцбанк',
            accountNumber: 'KZ123456789012345678',
            recipientName: 'ТОО "ProMebel"'
          });
        }
      }
      
      setIsWaitingForPayment(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(language === 'ru' ? 'Произошла ошибка при оформлении заказа' : 'Тапсырысты рәсімдеу кезінде қате орын алды');
      setIsSubmitting(false);
    }
  };
  
  // If waiting for payment details from admin
  if (isWaitingForPayment) {
    return (
      <Layout>
        <div className="bg-furniture-light py-10 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-screen-lg mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h1 className="text-2xl font-bold text-center mb-6">
                  {language === 'ru' ? 'Оплата заказа' : 'Тапсырысты төлеу'}
                </h1>
                
                {paymentDetails ? (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <p className="text-furniture-secondary mb-2">
                        {language === 'ru' 
                          ? 'Пожалуйста, переведите следующую сумму на указанные реквизиты:' 
                          : 'Көрсетілген деректемелерге келесі соманы аударыңыз:'}
                      </p>
                      <p className="text-2xl font-bold text-furniture-primary">
                        {formattedFinalPrice} {t('product.currency')}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">
                        {language === 'ru' ? 'Банковские реквизиты:' : 'Банк деректемелері:'}
                      </h3>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium mr-2">{language === 'ru' ? 'Банк:' : 'Банк:'}</span>
                          {paymentDetails.bankName}
                        </p>
                        <p>
                          <span className="font-medium mr-2">{language === 'ru' ? 'Номер счета:' : 'Шот нөмірі:'}</span>
                          {paymentDetails.accountNumber}
                        </p>
                        <p>
                          <span className="font-medium mr-2">{language === 'ru' ? 'Получатель:' : 'Алушы:'}</span>
                          {paymentDetails.recipientName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center mt-6">
                      <p className="text-furniture-secondary mb-4">
                        {language === 'ru' 
                          ? 'После оплаты наш менеджер свяжется с вами для подтверждения заказа.' 
                          : 'Төлемнен кейін біздің менеджер тапсырысты растау үшін сізбен байланысады.'}
                      </p>
                      <Button onClick={() => {
                        clearCart();
                        navigate('/checkout/success');
                      }}>
                        {language === 'ru' ? 'Я оплатил заказ' : 'Мен тапсырысты төледім'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-furniture-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>
                      {language === 'ru' 
                        ? 'Получение реквизитов для оплаты...' 
                        : 'Төлем деректемелерін алу...'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-furniture-light py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">
                {t('checkout.title')}
              </h1>
            </div>
            
            {items.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="mb-6">
                  <ShoppingCart size={64} className="mx-auto text-furniture-secondary/30" />
                </div>
                <h2 className="text-xl font-medium mb-4">
                  {language === 'ru' ? 'Ваша корзина пуста' : 'Сіздің себетіңіз бос'}
                </h2>
                <Button asChild>
                  <a href="/catalog">
                    {language === 'ru' ? 'Перейти к покупкам' : 'Сатып алуға өту'}
                  </a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">
                      {language === 'ru' ? 'Информация для доставки' : 'Жеткізу туралы ақпарат'}
                    </h2>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-lg">
                            {language === 'ru' ? 'Контактная информация' : 'Байланыс ақпараты'}
                          </h3>
                          
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {language === 'ru' ? 'Имя и фамилия' : 'Аты-жөні'}*
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={language === 'ru' ? 'Иван Иванов' : 'Иван Иванов'} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {language === 'ru' ? 'Телефон' : 'Телефон'}*
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="+7 700 123 4567" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email"
                                    placeholder="example@mail.com" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* Delivery Information */}
                        <div className="space-y-4 pt-4">
                          <h3 className="font-medium text-lg">
                            {language === 'ru' ? 'Адрес доставки' : 'Жеткізу мекенжайы'}
                          </h3>
                          
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {language === 'ru' ? 'Город' : 'Қала'}*
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={language === 'ru' ? 'Алматы' : 'Алматы'} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {language === 'ru' ? 'Адрес' : 'Мекенжай'}*
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={language === 'ru' ? 'ул. Абая 123, кв. 45' : 'Абай к-сі 123, 45 пәтер'} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {language === 'ru' ? 'Почтовый индекс' : 'Пошта индексі'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="050000" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* Payment Method */}
                        <div className="space-y-4 pt-4">
                          <h3 className="font-medium text-lg">
                            {language === 'ru' ? 'Способ оплаты' : 'Төлем әдісі'}
                          </h3>
                          
                          <div className="bg-furniture-light/50 rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full border-2 border-furniture-primary flex items-center justify-center mr-3">
                                <div className="w-3 h-3 rounded-full bg-furniture-primary"></div>
                              </div>
                              <span className="font-medium">
                                {language === 'ru' ? 'Банковская карта' : 'Банк картасы'}
                              </span>
                            </div>
                            <p className="text-sm text-furniture-secondary mt-2 pl-9">
                              {language === 'ru' 
                                ? 'После оформления заказа вы получите реквизиты для оплаты' 
                                : 'Тапсырысты рәсімдегеннен кейін сіз төлем деректемелерін аласыз'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Additional Notes */}
                        <div className="space-y-4 pt-4">
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {language === 'ru' ? 'Примечания к заказу' : 'Тапсырысқа қатысты ескертпелер'}
                                </FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder={
                                      language === 'ru' 
                                        ? 'Особые пожелания или комментарии к заказу' 
                                        : 'Тапсырысқа қатысты арнайы тілектер немесе пікірлер'
                                    } 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                                {language === 'ru' ? 'Оформление заказа...' : 'Тапсырысты рәсімдеу...'}
                              </>
                            ) : (
                              language === 'ru' ? 'Оформить заказ' : 'Тапсырысты рәсімдеу'
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                    <h2 className="text-xl font-semibold mb-6">
                      {language === 'ru' ? 'Ваш заказ' : 'Сіздің тапсырысыңыз'}
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-furniture-secondary mr-2">{item.quantity}×</span>
                            <span className="text-furniture-primary">{language === 'ru' ? item.name : (item.nameKz || item.name)}</span>
                          </div>
                          <span className="font-medium">
                            {(item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} {t('product.currency')}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Promo Code */}
                    <div className="mb-6">
                      <h3 className="font-medium text-sm mb-2">
                        {language === 'ru' ? 'Промокод' : 'Промокод'}
                      </h3>
                      
                      {promoCode ? (
                        <div className="flex items-center justify-between bg-furniture-light/50 rounded-lg p-3">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-furniture-primary" />
                            <span className="font-medium text-furniture-primary">{promoCode}</span>
                          </div>
                          <span className="text-sm">{discountPercentage}% {language === 'ru' ? 'скидка' : 'жеңілдік'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder={language === 'ru' ? 'Введите промокод' : 'Промокод енгізіңіз'}
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                            className="flex-grow"
                          />
                          <Button 
                            variant="outline" 
                            onClick={handleApplyPromoCode}
                            disabled={isValidatingPromo}
                          >
                            {isValidatingPromo ? (
                              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : (
                              language === 'ru' ? 'Применить' : 'Қолдану'
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-furniture-secondary">
                          {language === 'ru' ? 'Сумма' : 'Сомасы'}
                        </span>
                        <span>
                          {formattedTotalPrice} {t('product.currency')}
                        </span>
                      </div>
                      
                      {discountPercentage > 0 && (
                        <div className="flex justify-between items-center text-furniture-primary">
                          <span>
                            {language === 'ru' ? 'Скидка' : 'Жеңілдік'} ({discountPercentage}%)
                          </span>
                          <span>
                            -{formattedDiscountAmount} {t('product.currency')}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center font-semibold text-lg pt-3 border-t border-gray-100">
                        <span>
                          {language === 'ru' ? 'Итого' : 'Жиынтығы'}
                        </span>
                        <span>
                          {formattedFinalPrice} {t('product.currency')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
