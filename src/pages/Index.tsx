
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import CategoryCard from '@/components/CategoryCard';
import { fetchPopularProducts, fetchNewProducts } from '@/services/productService';
import { ProductType } from '@/types/product';
import HomePromoArea from '@/components/HomePromoArea';

export default function Home() {
  const { language } = useLanguage();
  const [popularProducts, setPopularProducts] = useState<ProductType[]>([]);
  const [newProducts, setNewProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const popular = await fetchPopularProducts(4);
        const newItems = await fetchNewProducts(4);
        
        setPopularProducts(popular);
        setNewProducts(newItems);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

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
                  src="/images/hero-furniture.jpg" 
                  alt={language === 'ru' ? 'Современная мебель' : 'Заманауи жиһаз'} 
                  className="w-full h-auto rounded-lg shadow-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Code Banner Section */}
      <HomePromoArea />

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {language === 'ru' ? 'Категории' : 'Санаттар'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CategoryCard 
                slug="livingroom"
                title={language === 'ru' ? 'Гостиная' : 'Қонақ бөлмесі'}
                index={0}
              />
              <CategoryCard 
                slug="bedroom"
                title={language === 'ru' ? 'Спальня' : 'Жатын бөлме'}
                index={1}
              />
              <CategoryCard 
                slug="kitchen"
                title={language === 'ru' ? 'Кухня' : 'Ас үй'}
                index={2}
              />
              <CategoryCard 
                slug="office"
                title={language === 'ru' ? 'Офис' : 'Кеңсе'}
                index={3}
              />
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link to="/catalog">
                  {language === 'ru' ? 'Все категории' : 'Барлық санаттар'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 bg-furniture-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {language === 'ru' ? 'Популярные товары' : 'Танымал тауарлар'}
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-furniture-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <ProductGrid products={popularProducts} />
            )}
            
            <div className="mt-10 text-center">
              <Button asChild>
                <Link to="/catalog">
                  {language === 'ru' ? 'Все товары' : 'Барлық тауарлар'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {language === 'ru' ? 'Новинки' : 'Жаңа тауарлар'}
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-furniture-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <ProductGrid products={newProducts} />
            )}
            
            <div className="mt-10 text-center">
              <Button asChild>
                <Link to="/catalog">
                  {language === 'ru' ? 'Все новинки' : 'Барлық жаңа тауарлар'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
