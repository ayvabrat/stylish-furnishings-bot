
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Gift, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePromoArea: React.FC = () => {
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
    <motion.div 
      className="container mx-auto px-4 md:px-6 pt-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="max-w-screen-xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-black mb-8 text-center text-kimmy-pink-dark flex items-center justify-center gap-3"
          variants={itemVariants}
        >
          <Heart className="w-8 h-8 text-kimmy-pink animate-heartbeat" fill="currentColor" />
          {language === 'ru' ? 'Почему выбирают MY Kimmy?' : 'Неге MY Kimmy таңдайды?'}
          <Heart className="w-8 h-8 text-kimmy-pink animate-heartbeat" fill="currentColor" />
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
        >
          <motion.div 
            className="glass-card p-8 text-center group hover:-translate-y-2 transition-all duration-300"
            variants={itemVariants}
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8)), url('https://s3.iimg.su/s/14/Cjj6DJKqDK9j4ubDVJhofAcAalWhIJPFJAdyiLEo.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="w-20 h-20 bg-kimmy-pink/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kimmy-pink/20 transition-all duration-300">
              <Sparkles className="h-10 w-10 text-kimmy-pink group-hover:animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-kimmy-pink-dark">
              {language === 'ru' ? 'Эксклюзивный дизайн' : 'Эксклюзивті дизайн'}
            </h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              {language === 'ru' 
                ? 'Каждая сумка создается с особым вниманием к деталям и современным трендам моды' 
                : 'Әр сөмке бөлшектерге ерекше назар аударып және заманауи сән трендтерімен жасалады'}
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-8 text-center group hover:-translate-y-2 transition-all duration-300"
            variants={itemVariants}
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8)), url('https://s3.iimg.su/s/14/Cjj6DJKqDK9j4ubDVJhofAcAalWhIJPFJAdyiLEo.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="w-20 h-20 bg-kimmy-pink/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kimmy-pink/20 transition-all duration-300">
              <Gift className="h-10 w-10 text-kimmy-pink group-hover:animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-kimmy-pink-dark">
              {language === 'ru' ? 'Premium упаковка' : 'Premium орау'}
            </h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              {language === 'ru' 
                ? 'Каждый заказ упаковывается в стильную подарочную упаковку с фирменными элементами' 
                : 'Әр тапсырыс фирмалық элементтері бар стильді сыйлық орауышында оралады'}
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-8 text-center group hover:-translate-y-2 transition-all duration-300"
            variants={itemVariants}
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8)), url('https://s3.iimg.su/s/14/Cjj6DJKqDK9j4ubDVJhofAcAalWhIJPFJAdyiLEo.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="w-20 h-20 bg-kimmy-pink/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kimmy-pink/20 transition-all duration-300">
              <Heart className="h-10 w-10 text-kimmy-pink group-hover:animate-heartbeat" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-kimmy-pink-dark">
              {language === 'ru' ? 'Забота о клиентах' : 'Клиенттерге қамқорлық'}
            </h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              {language === 'ru' 
                ? 'Персональный подход к каждому клиенту и поддержка на всех этапах покупки' 
                : 'Әр клиентке жеке көзқарас және сатып алудың барлық кезеңдерінде қолдау'}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePromoArea;
