
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import HomePromoArea from '@/components/HomePromoArea';

export default function Home() {
  const { language } = useLanguage();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-furniture-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-furniture-secondary">
                  {language === 'ru' 
                    ? 'Современная мебель для вашего комфорта' 
                    : 'Сіздің жайлылығыңыз үшін заманауи жиһаз'}
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-600">
                  {language === 'ru'
                    ? 'Создайте дом своей мечты с нашей элегантной и функциональной мебелью'
                    : 'Біздің талғампаз және функционалды жиһазымызбен өз арманыңыздағы үйді жасаңыз'}
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Button asChild size="lg" className="bg-furniture-primary hover:bg-furniture-primary/90">
                    <Link to="/catalog">
                      {language === 'ru' ? 'Смотреть каталог' : 'Каталогты қарау'}
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/about">
                      {language === 'ru' ? 'О нас' : 'Біз туралы'}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/public/lovable-uploads/92935515-9b18-4cba-8af2-aebe0e7fb2bc.png" 
                  alt={language === 'ru' ? 'Современная мебель' : 'Заманауи жиһаз'} 
                  className="w-full h-auto rounded-lg shadow-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Code Banner Section */}
      <HomePromoArea />
    </Layout>
  );
}
