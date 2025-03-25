
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const CheckoutSuccess = () => {
  const { language } = useLanguage();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
