
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, UploadCloud, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { sendOrderNotification, generatePaymentInfo, sendReceiptToAdmin, generateOrderId } from '@/services/telegramService';

const Checkout = () => {
  const { language, t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generate order ID once
  const [orderId] = useState(generateOrderId());
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    street: '',
    house: '',
    apartment: '',
    comment: ''
  });
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'processing' | 'payment'>('form');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  
  // Format price with thousand separators
  const formattedTotalPrice = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.firstName || !formData.phone || !formData.city) {
      toast.error(language === 'ru' ? 'Пожалуйста, заполните обязательные поля' : 'Міндетті өрістерді толтырыңыз');
      return;
    }
    
    // Start processing order
    setIsProcessing(true);
    setCurrentStep('processing');
    
    try {
      // Create order data
      const orderData = {
        customerName: formData.firstName,
        customerSurname: formData.lastName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        customerCity: formData.city,
        customerStreet: formData.street,
        customerHouse: formData.house,
        customerApartment: formData.apartment,
        customerComment: formData.comment,
        orderItems: items.map(item => ({
          id: item.id,
          name: language === 'ru' ? item.name : (item.nameKz || item.name),
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice
      };
      
      // Send order notification to admin via Telegram
      const success = await sendOrderNotification(orderData);
      
      if (success) {
        // Generate mock payment info (in a real scenario, this would come from the admin)
        // Here we simulate the admin sending payment details
        setTimeout(() => {
          const paymentDetails = generatePaymentInfo(totalPrice);
          setPaymentInfo(paymentDetails);
          setCurrentStep('payment');
        }, 3000);
      } else {
        throw new Error('Failed to send order notification');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(language === 'ru' ? 'Произошла ошибка при обработке заказа' : 'Тапсырысты өңдеу кезінде қате пайда болды');
      setIsProcessing(false);
      setCurrentStep('form');
    }
  };
  
  // Handle receipt file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };
  
  // Handle receipt upload
  const handleUploadReceipt = async () => {
    if (!receiptFile) {
      toast.error(language === 'ru' ? 'Пожалуйста, выберите файл' : 'Файлды таңдаңыз');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Send receipt to admin via Telegram
      const success = await sendReceiptToAdmin(
        orderId,
        receiptFile,
        formData.phone
      );
      
      if (success) {
        setReceiptUploaded(true);
        toast.success(language === 'ru' ? 'Чек успешно загружен' : 'Чек сәтті жүктелді');
        
        // Clear cart and redirect to success page after a delay
        setTimeout(() => {
          clearCart();
          navigate('/checkout/success');
        }, 2000);
      } else {
        throw new Error('Failed to upload receipt');
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast.error(language === 'ru' ? 'Ошибка при загрузке чека' : 'Чекті жүктеу кезінде қате пайда болды');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Redirect to home if cart is empty
  if (items.length === 0 && currentStep === 'form') {
    navigate('/');
    return null;
  }
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Page title */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold">{t('checkout.title')}</h1>
            </div>
            
            {/* Checkout steps */}
            {currentStep === 'form' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal information */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4">{t('checkout.personalInfo')}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-furniture-primary mb-1">
                          {t('checkout.name')} *
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-furniture-primary mb-1">
                          {t('checkout.surname')}
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-furniture-primary mb-1">
                          {t('checkout.phone')} *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-furniture-primary mb-1">
                          {t('checkout.email')}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Delivery address */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4">{t('checkout.address')}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-furniture-primary mb-1">
                          {t('checkout.city')} *
                        </label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="street" className="block text-sm font-medium text-furniture-primary mb-1">
                          {t('checkout.street')}
                        </label>
                        <Input
                          id="street"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="house" className="block text-sm font-medium text-furniture-primary mb-1">
                          {t('checkout.house')}
                        </label>
                        <Input
                          id="house"
                          name="house"
                          value={formData.house}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="apartment" className="block text-sm font-medium text-furniture-primary mb-1">
                          {t('checkout.apartment')}
                        </label>
                        <Input
                          id="apartment"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-furniture-primary mb-1">
                      {t('checkout.comment')}
                    </label>
                    <Textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  
                  {/* Order summary */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      {language === 'ru' ? 'Ваш заказ' : 'Сіздің тапсырысыңыз'}
                    </h2>
                    
                    <ul className="divide-y divide-gray-100">
                      {items.map(item => {
                        const formattedItemPrice = (item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                        
                        return (
                          <li key={item.id} className="py-2 flex justify-between">
                            <span>
                              {language === 'ru' ? item.name : (item.nameKz || item.name)}{' '}
                              <span className="text-furniture-secondary">x{item.quantity}</span>
                            </span>
                            <span>{formattedItemPrice} {t('product.currency')}</span>
                          </li>
                        );
                      })}
                    </ul>
                    
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex justify-between font-semibold">
                        <span>{t('cart.total')}</span>
                        <span>{formattedTotalPrice} {t('product.currency')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-start">
                      <AlertCircle size={18} className="text-furniture-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-furniture-secondary text-sm">
                        {language === 'ru' 
                          ? 'Нажимая кнопку "Отправить заказ", вы соглашаетесь с условиями оплаты и доставки.'
                          : 'Тапсырысты жіберу түймесін басу арқылы сіз төлем және жеткізу шарттарымен келісесіз.'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-furniture-primary text-white hover:bg-furniture-dark"
                    disabled={isProcessing}
                  >
                    {t('checkout.submit')}
                  </Button>
                </form>
              </motion.div>
            )}
            
            {/* Processing order state */}
            {currentStep === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 border-4 border-furniture-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-medium">{t('checkout.wait')}</h2>
              </motion.div>
            )}
            
            {/* Payment information state */}
            {currentStep === 'payment' && paymentInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                  <h2 className="text-lg font-semibold mb-4">{t('checkout.paymentInfo')}</h2>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-furniture-secondary">
                          {language === 'ru' ? 'Номер счета:' : 'Шот нөмірі:'}
                        </span>
                        <span className="font-medium">{paymentInfo.bankAccount}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-furniture-secondary">
                          {language === 'ru' ? 'Банк:' : 'Банк:'}
                        </span>
                        <span className="font-medium">{paymentInfo.bankName}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-furniture-secondary">
                          {language === 'ru' ? 'Получатель:' : 'Алушы:'}
                        </span>
                        <span className="font-medium">{paymentInfo.recipientName}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-furniture-secondary">
                          {language === 'ru' ? 'Сумма:' : 'Сома:'}
                        </span>
                        <span className="font-medium">{formattedTotalPrice} {t('product.currency')}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-furniture-secondary">
                          {language === 'ru' ? 'Назначение платежа:' : 'Төлем мақсаты:'}
                        </span>
                        <span className="font-medium">{paymentInfo.reference}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 py-4 border-t border-b border-gray-100">
                    <p className="text-furniture-secondary text-sm mb-4">
                      {language === 'ru'
                        ? 'После оплаты, пожалуйста, загрузите чек или скриншот подтверждения оплаты:'
                        : 'Төлемнен кейін, төлем растамасының чегін немесе скриншотын жүктеңіз:'}
                    </p>
                    
                    <div className="flex flex-col items-center">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      
                      {!receiptFile ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mb-2"
                        >
                          <UploadCloud size={18} className="mr-2" />
                          {t('checkout.uploadReceipt')}
                        </Button>
                      ) : (
                        <div className="text-sm text-furniture-primary mb-2">
                          {language === 'ru' ? 'Выбран файл:' : 'Таңдалған файл:'} {receiptFile.name}
                        </div>
                      )}
                      
                      {receiptFile && (
                        <Button
                          onClick={handleUploadReceipt}
                          disabled={isProcessing || receiptUploaded}
                          className={receiptUploaded ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          {receiptUploaded ? (
                            <>
                              <Check size={18} className="mr-2" />
                              {language === 'ru' ? 'Чек загружен' : 'Чек жүктелді'}
                            </>
                          ) : (
                            language === 'ru' ? 'Отправить чек' : 'Чекті жіберу'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-furniture-secondary text-sm">
                      {language === 'ru'
                        ? 'Ваш заказ будет обработан после подтверждения оплаты. Спасибо за покупку!'
                        : 'Сіздің тапсырысыңыз төлем расталғаннан кейін өңделеді. Сатып алғаныңыз үшін рахмет!'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
