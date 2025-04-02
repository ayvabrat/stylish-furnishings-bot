
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePromotion } from '@/contexts/PromotionContext';
import { Tag } from 'lucide-react';

const PromoCodeBanner: React.FC = () => {
  const { language } = useLanguage();
  const { applyPromoCode } = usePromotion();

  const handleApplyPromo = async () => {
    await applyPromoCode('ALMATY2025');
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-orange-50 to-amber-100 p-4 rounded-lg shadow-md mb-8 relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="absolute -right-12 -top-12 w-40 h-40 bg-amber-200 rounded-full opacity-40"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
        }}
      />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
        <div className="flex items-start mb-4 md:mb-0">
          <Tag className="h-5 w-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-amber-800">
              {language === 'ru' ? 'СКИДКА 5% по промокоду' : 'Промокод бойынша 5% ЖЕҢІЛДІК'}
            </h3>
            <p className="text-amber-700 mt-1">
              {language === 'ru' 
                ? 'Используйте промокод ALMATY2025 при оформлении заказа для получения скидки 5%' 
                : 'Тапсырысты рәсімдеу кезінде 5% жеңілдік алу үшін ALMATY2025 промокодын қолданыңыз'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleApplyPromo}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors text-sm font-medium"
        >
          {language === 'ru' ? 'Применить промокод' : 'Промокодты қолдану'}
        </button>
      </div>
    </motion.div>
  );
};

export default PromoCodeBanner;
