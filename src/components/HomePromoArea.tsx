
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PromoCodeBanner from './PromoCodeBanner';

const HomePromoArea: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 md:px-6 pt-8">
      <div className="max-w-screen-xl mx-auto">
        <PromoCodeBanner />
        
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          {language === 'ru' ? 'Почему выбирают нас?' : 'Неге бізді таңдайды?'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-furniture-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-furniture-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Высокое качество' : 'Жоғары сапа'}
            </h3>
            <p className="text-gray-600">
              {language === 'ru' 
                ? 'Мы используем только высококачественные материалы для нашей мебели' 
                : 'Біз жиһаз үшін тек жоғары сапалы материалдарды қолданамыз'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-furniture-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-furniture-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Быстрая доставка' : 'Жылдам жеткізу'}
            </h3>
            <p className="text-gray-600">
              {language === 'ru' 
                ? 'Доставляем по Алматы и области в кратчайшие сроки' 
                : 'Алматы және облыс бойынша қысқа мерзімде жеткіземіз'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-furniture-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-furniture-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Удобная оплата' : 'Ыңғайлы төлем'}
            </h3>
            <p className="text-gray-600">
              {language === 'ru' 
                ? 'Принимаем различные способы оплаты для вашего удобства' 
                : 'Сіздің ыңғайлылығыңыз үшін әртүрлі төлем тәсілдерін қабылдаймыз'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePromoArea;
