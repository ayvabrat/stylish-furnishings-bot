
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const { language } = useLanguage();
  
  return (
    <Layout>
      <div className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="max-w-md mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-9xl font-bold text-furniture-primary opacity-20 mb-6">
              404
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {language === 'ru' ? 'Страница не найдена' : 'Бет табылмады'}
            </h1>
            
            <p className="text-furniture-secondary mb-8">
              {language === 'ru'
                ? 'Извините, страница, которую вы ищете, не существует или была перемещена.'
                : 'Кешіріңіз, сіз іздеген бет жоқ немесе жылжытылды.'}
            </p>
            
            <Button asChild>
              <Link to="/" className="inline-flex items-center">
                <ArrowLeft size={16} className="mr-2" />
                {language === 'ru' ? 'Вернуться на главную' : 'Басты бетке оралу'}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
