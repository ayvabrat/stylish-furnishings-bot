
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CheckoutSuccess = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const { state } = location;
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If we returned from YooMoney with ?orderId=..., confirm payment and notify
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('orderId');
    if (!orderId) return;

    console.log('Confirming YooMoney payment for orderId:', orderId);
    supabase.functions.invoke('yoomoney-confirm', { body: { orderId } })
      .then(({ data, error }) => {
        if (error) {
          console.error('yoomoney-confirm error:', error);
          toast.error(language === 'ru' ? 'Не удалось подтвердить оплату' : 'Төлемді растау мүмкін болмады');
          return;
        }
        console.log('yoomoney-confirm result:', data);
        if (data?.status === 'succeeded' || data?.status === 'success') {
          toast.success(language === 'ru' ? 'Оплата подтверждена' : 'Төлем расталды');
        } else {
          toast(messageForStatus(data?.status));
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error(language === 'ru' ? 'Ошибка при подтверждении оплаты' : 'Төлемді растауда қате');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, language]);

  const messageForStatus = (status?: string) => {
    if (!status) return language === 'ru' ? 'Статус платежа неизвестен' : 'Төлем күйі белгісіз';
    if (status === 'pending') return language === 'ru' ? 'Платёж ожидает подтверждения' : 'Төлем расталуда';
    return language === 'ru' ? `Статус платежа: ${status}` : `Төлем күйі: ${status}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(language === 'ru' ? 'Скопировано!' : 'Көшірілді!');
  };
  
  return (
    <Layout>
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="mb-6 text-green-500">
                <CheckCircle size={64} className="mx-auto" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                {language === 'ru' ? 'Заказ успешно оформлен!' : 'Тапсырыс сәтті рәсімделді!'}
              </h1>
              
              <p className="text-furniture-secondary mb-8">
                {language === 'ru'
                  ? 'Спасибо за ваш заказ! Наш менеджер свяжется с вами в ближайшее время для подтверждения деталей.'
                  : 'Тапсырысыңыз үшін рахмет! Біздің менеджер жақын арада сізбен байланысып, мәліметтерді растайды.'}
              </p>
            </div>

            {/* Show payment details for bank transfer */}
            {state?.paymentMethod === 'bank_transfer' && state?.paymentDetails && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ru' ? 'Реквизиты для оплаты' : 'Төлем деректемелері'}
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm text-gray-600">
                          {language === 'ru' ? 'Банк:' : 'Банк:'}
                        </span>
                        <p className="font-medium">{state.paymentDetails.bankName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(state.paymentDetails.bankName)}
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm text-gray-600">
                          {language === 'ru' ? 'Номер карты:' : 'Карта нөмірі:'}
                        </span>
                        <p className="font-medium">{state.paymentDetails.bankAccount}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(state.paymentDetails.bankAccount)}
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm text-gray-600">
                          {language === 'ru' ? 'Получатель:' : 'Алушы:'}
                        </span>
                        <p className="font-medium">{state.paymentDetails.recipient}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(state.paymentDetails.recipient)}
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                      <div>
                        <span className="text-sm text-green-700">
                          {language === 'ru' ? 'Сумма к оплате:' : 'Төленетін сома:'}
                        </span>
                        <p className="font-bold text-green-800 text-lg">{state.paymentDetails.amount} ₽</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(state.paymentDetails.amount.toString())}
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {state?.reference && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <span className="text-sm text-blue-700">
                        {language === 'ru' ? 'Номер заказа:' : 'Тапсырыс нөмірі:'}
                      </span>
                      <p className="font-bold text-blue-800">{state.reference}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        {language === 'ru' 
                          ? 'Укажите этот номер при переводе' 
                          : 'Аударым кезінде осы нөмірді көрсетіңіз'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <div className="text-center">
              <Button asChild>
                <Link to="/">
                  {language === 'ru' ? 'Вернуться на главную' : 'Басты бетке оралу'}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
