
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

const About = () => {
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
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-kimmy-pink-light to-white py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-16"
              variants={itemVariants}
            >
              <h1 className="text-4xl md:text-6xl font-black text-kimmy-pink-dark mb-6 flex items-center justify-center gap-4">
                <Heart className="w-10 h-10 text-kimmy-pink animate-heartbeat" fill="currentColor" />
                {language === 'ru' ? 'О нас' : 'Біз туралы'}
                <Heart className="w-10 h-10 text-kimmy-pink animate-heartbeat" fill="currentColor" />
              </h1>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              className="glass-card p-8 md:p-12 mb-12"
              variants={itemVariants}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-kimmy-pink-dark mb-8 flex items-center justify-center gap-3">
                  <Sparkles className="w-8 h-8 text-kimmy-pink" />
                  MY Kimmy
                  <Sparkles className="w-8 h-8 text-kimmy-pink" />
                </h2>
                
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                  {language === 'ru' 
                    ? 'MY Kimmy — это больше, чем просто сумки. Это стиль, энергия и настроение, которые ты выбираешь каждый день.'
                    : 'MY Kimmy — бұл жай ғана сөмкелерден де көп. Бұл сіз күн сайын таңдайтын стиль, энергия және көңіл-күй.'}
                </p>

                <div className="w-24 h-1 bg-kimmy-pink mx-auto mb-12"></div>
              </div>

              <motion.div 
                className="mb-12"
                variants={itemVariants}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-kimmy-pink-dark mb-6 text-center flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 text-kimmy-pink" />
                  {language === 'ru' ? 'Наша миссия' : 'Біздің миссиямыз'}
                  <Star className="w-6 h-6 text-kimmy-pink" />
                </h3>
                
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p className="text-center font-medium">
                    {language === 'ru' 
                      ? 'Мы верим, что аксессуар может изменить всё: настроение, уверенность, образ.'
                      : 'Біз аксессуар бәрін өзгерте алатынына сенеміз: көңіл-күйді, сенімділікті, бейнені.'}
                  </p>
                  
                  <p className="text-center font-medium">
                    {language === 'ru' 
                      ? 'Наша миссия — делать стиль доступным, качественным и вдохновляющим.'
                      : 'Біздің миссиямыз — стильді қолжетімді, сапалы және шабыттандыратын ету.'}
                  </p>
                  
                  <p className="text-center font-medium">
                    {language === 'ru' 
                      ? 'Мы создаём сумки, которые не просто дополняют твой образ — они подчёркивают твою индивидуальность.'
                      : 'Біз сіздің бейненізді толықтырып қана қоймай, сіздің жеке ерекшелігіңізді айқындайтын сөмкелер жасаймыз.'}
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <div className="inline-flex items-center gap-3 text-2xl md:text-3xl font-bold text-kimmy-pink bg-kimmy-pink/10 px-6 py-4 rounded-full">
                  <Heart className="w-8 h-8 animate-heartbeat" fill="currentColor" />
                  {language === 'ru' ? 'Ты — вдохновение для нашего бренда.' : 'Сіз — біздің брендіміз үшін шабыт.'}
                  <Heart className="w-8 h-8 animate-heartbeat" fill="currentColor" />
                </div>
              </motion.div>
            </motion.div>

            {/* Image Section */}
            <motion.div 
              className="relative mb-12"
              variants={itemVariants}
            >
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://s3.iimg.su/s/08/gQVxhBCxCHs9PsMnfn9X3dXyz166SSZip2dbdze2.jpg" 
                  alt={language === 'ru' ? 'MY Kimmy коллекция' : 'MY Kimmy жинақ'}
                  className="w-full h-full object-cover hover-scale transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kimmy-pink/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <p className="text-white text-xl font-bold shadow-text">
                    {language === 'ru' ? 'Каждая сумка создана с любовью' : 'Әр сөмке сүйіспеншілікпен жасалған'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default About;
