
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PromoCodeBanner from './PromoCodeBanner';

const HomePromoArea: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 md:px-6 pt-8">
      <div className="max-w-screen-xl mx-auto">
        <PromoCodeBanner />
        
        <h2 className="text-2xl md:text-3xl font-black mb-6 text-center">
          {language === 'ru' ? 'Почему выбирают My Kimmy?' : 'Неге My Kimmy таңдайды?'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-furniture-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-furniture-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">
              {language === 'ru' ? 'Качественные материалы' : 'Сапалы материалдар'}
            </h3>
            <p className="text-gray-600 font-medium">
              {language === 'ru' 
                ? 'Используем только премиальную кожу и прочные ткани для наших сумок' 
                : 'Сөмкелеріміз үшін тек премиум тері мен берік маталарды қолданамыз'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-furniture-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-furniture-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">
              {language === 'ru' ? 'Быстрая доставка' : 'Жылдам жеткізу'}
            </h3>
            <p className="text-gray-600 font-medium">
              {language === 'ru' 
                ? 'Доставляем по Алматы и области в кратчайшие сроки' 
                : 'Алматы және облыс бойынша қысқа мерзімде жеткіземіз'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-furniture-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-furniture-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">
              {language === 'ru' ? 'Стильный дизайн' : 'Стильді дизайн'}
            </h3>
            <p className="text-gray-600 font-medium">
              {language === 'ru' 
                ? 'Каждая сумка создана с любовью к деталям и современным трендам' 
                : 'Әр сөмке бөлшектерге деген махаббатпен және заманауи трендтермен жасалған'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePromoArea;
