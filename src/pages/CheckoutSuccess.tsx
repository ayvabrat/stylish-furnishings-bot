
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CheckoutSuccess = () => {
  const { language } = useLanguage();
  const location = useLocation();
  
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
  
  return (
    <Layout>
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="max-w-md mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
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
            
            <Button asChild>
              <Link to="/">
                {language === 'ru' ? 'Вернуться на главную' : 'Басты бетке оралу'}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
