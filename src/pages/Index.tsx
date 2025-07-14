
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Star, Heart, ShoppingBag, Truck, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section 
        className="relative gradient-pink py-20 md:py-32 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-kimmy-pink/20 to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div className="text-center md:text-left" variants={itemVariants}>
                <motion.h1 
                  className="text-4xl md:text-6xl font-black mb-6 text-kimmy-pink-dark leading-tight"
                  variants={itemVariants}
                >
                  {language === 'ru' 
                    ? 'Стильные сумки для особенных моментов' 
                    : 'Стильді сөмкелер ерекше сәттер үшін'}
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl mb-4 text-gray-700 font-medium"
                  variants={itemVariants}
                >
                  {language === 'ru'
                    ? 'Откройте для себя коллекцию изысканных сумок'
                    : 'Сәнді сөмкелердің жинақтарымен танысыңыз'}
                </motion.p>
                <motion.p 
                  className="text-2xl md:text-3xl mb-8 italic text-kimmy-pink font-bold flex items-center justify-center md:justify-start gap-2"
                  variants={itemVariants}
                >
                  <Heart className="w-6 h-6 animate-heartbeat" fill="currentColor" />
                  {language === 'ru'
                    ? 'Создай свой неповторимый стиль'
                    : 'Өзіңіздің ерекше стиліңізді жасаңыз'}
                  <Heart className="w-6 h-6 animate-heartbeat" fill="currentColor" />
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
                  variants={itemVariants}
                >
                  <Button asChild size="lg" className="bg-kimmy-pink hover:bg-kimmy-pink-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Link to="/catalog" className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      {language === 'ru' ? 'Смотреть коллекцию' : 'Жинақты қарау'}
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-kimmy-pink text-kimmy-pink hover:bg-kimmy-pink hover:text-white transition-all duration-300">
                    <Link to="/about">
                      {language === 'ru' ? 'О бренде' : 'Бренд туралы'}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div className="hidden md:block" variants={itemVariants}>
                <div className="relative">
                  <motion.div
                    className="absolute -top-4 -right-4 w-20 h-20 bg-kimmy-pink/20 rounded-full animate-float"
                    style={{ animationDelay: '0s' }}
                  ></motion.div>
                  <motion.div
                    className="absolute -bottom-6 -left-6 w-16 h-16 bg-kimmy-pink-dark/20 rounded-full animate-float"
                    style={{ animationDelay: '1s' }}
                  ></motion.div>
                  <img 
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop" 
                    alt={language === 'ru' ? 'Стильная сумка' : 'Стильді сөмке'} 
                    className="w-full h-auto rounded-2xl shadow-2xl object-cover hover-scale"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <Heart className="w-6 h-6 text-kimmy-pink animate-pulse-soft" fill="currentColor" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-black mb-12 text-center text-kimmy-pink-dark"
              variants={itemVariants}
            >
              {language === 'ru' ? 'Почему выбирают MY Kimmy?' : 'Неге MY Kimmy таңдайды?'}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="glass-card p-8 text-center group hover:-translate-y-2 transition-all duration-300"
                variants={itemVariants}
              >
                <div className="w-20 h-20 bg-kimmy-pink/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kimmy-pink/20 transition-all duration-300">
                  <Sparkles className="h-10 w-10 text-kimmy-pink group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-kimmy-pink-dark">
                  {language === 'ru' ? 'Премиум качество' : 'Премиум сапа'}
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {language === 'ru' 
                    ? 'Используем только качественные материалы и фурнитуру для создания долговечных сумок' 
                    : 'Ұзақ мерзімді сөмкелер жасау үшін тек сапалы материалдар мен фурнитураны қолданамыз'}
                </p>
              </motion.div>
              
              <motion.div 
                className="glass-card p-8 text-center group hover:-translate-y-2 transition-all duration-300"
                variants={itemVariants}
              >
                <div className="w-20 h-20 bg-kimmy-pink/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kimmy-pink/20 transition-all duration-300">
                  <Truck className="h-10 w-10 text-kimmy-pink group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-kimmy-pink-dark">
                  {language === 'ru' ? 'Быстрая доставка' : 'Жылдам жеткізу'}
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {language === 'ru' 
                    ? 'Доставляем по всей России в кратчайшие сроки с гарантией качества' 
                    : 'Сапа кепілдігімен бүкіл Ресей бойынша қысқа мерзімде жеткіземіз'}
                </p>
              </motion.div>
              
              <motion.div 
                className="glass-card p-8 text-center group hover:-translate-y-2 transition-all duration-300"
                variants={itemVariants}
              >
                <div className="w-20 h-20 bg-kimmy-pink/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kimmy-pink/20 transition-all duration-300">
                  <Shield className="h-10 w-10 text-kimmy-pink group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-kimmy-pink-dark">
                  {language === 'ru' ? 'Гарантия качества' : 'Сапа кепілдігі'}
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {language === 'ru' 
                    ? 'Предоставляем полную гарантию на все изделия и поддержку клиентов 24/7' 
                    : 'Барлық бұйымдарға толық кепілдік пен 24/7 клиенттерді қолдау көрсетеміз'}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Lifestyle Image Section */}
      <motion.section 
        className="py-16 gradient-pink-soft"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center">
              <motion.h2 
                className="text-3xl md:text-4xl font-black mb-8 text-center text-kimmy-pink-dark"
                variants={itemVariants}
              >
                {language === 'ru' ? 'Стиль на каждый день' : 'Күнделікті стиль'}
              </motion.h2>
              <motion.div 
                className="w-full max-w-4xl h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl mb-10 relative group"
                variants={itemVariants}
              >
                <img 
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop" 
                  alt={language === 'ru' ? 'Модная женщина с сумкой' : 'Сәнді әйел сөмкемен'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kimmy-pink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-black mb-12 text-center text-kimmy-pink-dark"
              variants={itemVariants}
            >
              {language === 'ru' ? 'Отзывы наших клиентов' : 'Клиенттердің пікірлері'}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="glass-card p-8 hover:-translate-y-1 transition-all duration-300"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-kimmy-pink/20 rounded-full flex items-center justify-center">
                      <span className="font-bold text-kimmy-pink-dark">А</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-kimmy-pink-dark">Анна Петрова</h3>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Москва</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Заказала розовую сумку через плечо из новой коллекции MY Kimmy. Качество превзошло все ожидания! 
                  Материал очень приятный на ощупь, фурнитура качественная. Сумка идеально дополнила мой гардероб. 
                  Доставка была быстрой, упаковка красивая. Обязательно закажу еще!"
                </p>
              </motion.div>
              
              <motion.div 
                className="glass-card p-8 hover:-translate-y-1 transition-all duration-300"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-kimmy-pink/20 rounded-full flex items-center justify-center">
                      <span className="font-bold text-kimmy-pink-dark">М</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-kimmy-pink-dark">Мария Соколова</h3>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">СПб</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Искала стильную сумку для работы и нашла именно то, что нужно в MY Kimmy. 
                  Сумка вместительная, но при этом элегантная. Очень удобные ручки и качественная подкладка. 
                  Получаю комплименты каждый день! Спасибо за отличный сервис и красивую упаковку."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}
