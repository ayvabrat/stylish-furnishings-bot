
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import CategoryCard from '@/components/CategoryCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, getPopularProducts } from '@/data/products';

const Index = () => {
  const { t } = useLanguage();
  const popularProducts = getPopularProducts();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-furniture-light min-h-[80vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/20 z-10"></div>
          <motion.img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000"
            alt="Modern Furniture"
            className="w-full h-full object-cover object-center"
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 z-20 relative">
          <div className="max-w-2xl">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {t('home.hero.title')}
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 text-furniture-secondary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {t('home.hero.subtitle')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="space-x-4"
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-furniture-primary text-white hover:bg-furniture-dark"
              >
                <Link to="/catalog">
                  {t('nav.catalog')}
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t('home.categories.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 bg-furniture-light">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t('home.popular.title')}
            </h2>
            <Link 
              to="/catalog" 
              className="text-furniture-primary hover:text-furniture-secondary flex items-center text-sm font-medium"
            >
              {t('nav.catalog')}
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <ProductGrid products={popularProducts} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t('home.benefits.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quality */}
            <motion.div 
              className="text-center p-6 rounded-lg bg-furniture-light"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-furniture-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-furniture-primary"><path d="M12 2l3 1.5v5.5l-3 1.5-3-1.5V3.5L12 2z"/><path d="M13.5 10v7.5L7 21l-1.5-1.5V15l4.5-3"/><path d="M13.5 10L19 15v4.5L17.5 21L11 17.5"/></svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {t('home.benefits.quality')}
              </h3>
              <p className="text-furniture-secondary text-sm">
                {t('home.benefits.quality.desc')}
              </p>
            </motion.div>
            
            {/* Delivery */}
            <motion.div 
              className="text-center p-6 rounded-lg bg-furniture-light"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-furniture-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-furniture-primary"><rect width="16" height="13" x="4" y="5" rx="2"/><path d="m22 8-4 4"/><path d="m2 8 4 4"/><path d="m10 5 4-2"/><path d="M9.1 15.96c-.31-.32-.84-.35-1.23-.12a1.07 1.07 0 0 0-.45 1.18c.08.3.32.56.62.7l1.8.86"/><path d="M13.73 15.96c.31-.32.84-.35 1.23-.12.37.2.6.58.45 1.18-.08.3-.32.56-.62.7l-1.28.61"/><path d="M12 16v2"/></svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {t('home.benefits.delivery')}
              </h3>
              <p className="text-furniture-secondary text-sm">
                {t('home.benefits.delivery.desc')}
              </p>
            </motion.div>
            
            {/* Warranty */}
            <motion.div 
              className="text-center p-6 rounded-lg bg-furniture-light"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-furniture-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-furniture-primary"><path d="M8 11V5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9"/><path d="M11 15h1"/><rect width="18" height="12" x="3" y="8" rx="2"/></svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {t('home.benefits.warranty')}
              </h3>
              <p className="text-furniture-secondary text-sm">
                {t('home.benefits.warranty.desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
