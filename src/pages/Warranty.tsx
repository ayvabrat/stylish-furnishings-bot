
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Shield, FileText, Camera, Mail, Phone, AlertCircle } from 'lucide-react';

const Warranty = () => {
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
            
            {/* Header */}
            <motion.div 
              className="text-center mb-12"
              variants={itemVariants}
            >
              <h1 className="text-4xl md:text-6xl font-black text-kimmy-pink-dark mb-6 flex items-center justify-center gap-4">
                <Shield className="w-10 h-10 text-kimmy-pink" />
                {language === 'ru' ? 'Гарантия' : 'Кепілдік'}
              </h1>
              <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
                {language === 'ru' 
                  ? 'Мы гарантируем качество каждой сумки MY Kimmy и обеспечиваем полную поддержку наших клиентов'
                  : 'Біз әр MY Kimmy сөмкесінің сапасын кепілдендіреміз және клиенттерімізге толық қолдау көрсетеміз'}
              </p>
            </motion.div>

            {/* Main Info */}
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <Shield className="w-8 h-8 text-kimmy-pink" />
                <h2 className="text-2xl font-bold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Гарантийные условия' : 'Кепілдік шарттары'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  {language === 'ru' 
                    ? 'В нашем интернет-магазине MY Kimmy вы покупаете сумки. Клиентам предоставляется гарантия, которая распространяется на все представленные товары. Конкретные гарантийные условия зависят от выбранного вами товара.'
                    : 'Біздің MY Kimmy интернет-дүкенінде сіз сөмкелер сатып аласыз. Клиенттерге барлық ұсынылған тауарларға қолданылатын кепілдік беріледі. Нақты кепілдік шарттары сіз таңдаған тауарға байланысты.'}
                </p>
              </div>
            </motion.div>

            {/* Documentation Requirements */}
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <FileText className="w-8 h-8 text-kimmy-pink" />
                <h2 className="text-2xl font-bold text-kimmy-pink-dark">
                  {language === 'ru' ? '1. Необходимые документы' : '1. Қажетті құжаттар'}
                </h2>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-kimmy-pink-dark">
                  {language === 'ru' 
                    ? 'Какие документы нужно сохранить, чтобы действовала гарантия?'
                    : 'Кепілдік әрекет етуі үшін қандай құжаттарды сақтау керек?'}
                </h3>
                
                <div className="bg-kimmy-pink/10 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'ru' 
                      ? 'Чтобы воспользоваться гарантией, не выбрасывайте бумаги, подтверждающие факт приобретения. Это договор купли-продажи и кассовый чек об оплате покупки.'
                      : 'Кепілдікті пайдалану үшін сатып алу фактісін растайтын қағаздарды тастамаңыз. Бұл сату-сатып алу шарты және сатып алуды төлеу туралы кассалық чек.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Defect Reporting Process */}
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <AlertCircle className="w-8 h-8 text-kimmy-pink" />
                <h2 className="text-2xl font-bold text-kimmy-pink-dark">
                  {language === 'ru' ? '2. Обнаружение брака' : '2. Ақауды анықтау'}
                </h2>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-kimmy-pink-dark">
                  {language === 'ru' 
                    ? 'Что нужно сделать, если в течение гарантийного срока в изделии замечен брак?'
                    : 'Кепілдік мерзімінде бұйымда ақау байқалса не істеу керек?'}
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Camera className="w-6 h-6 text-kimmy-pink mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-kimmy-pink-dark mb-2">
                        {language === 'ru' ? 'Сделайте фотографии' : 'Суреттер түсіріңіз'}
                      </h4>
                      <p className="text-gray-700">
                        {language === 'ru' 
                          ? 'Сделайте фото, подтверждающее наличие недостатка. При этом вам потребуется заснять товар в целом и его дефектную деталь.'
                          : 'Кемшілікті растайтын суретті түсіріңіз. Бұл үшін сізге тауарды толығымен және оның ақаулы бөлігін түсіру қажет болады.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-kimmy-pink mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-kimmy-pink-dark mb-2">
                        {language === 'ru' ? 'Отправьте письмо' : 'Хат жіберіңіз'}
                      </h4>
                      <p className="text-gray-700 mb-2">
                        {language === 'ru' 
                          ? 'Вышлите сделанные фотографии на наш электронный адрес. В письме приведите ваши персональные и контактные данные (ФИО, телефон), а также номер договора.'
                          : 'Түсірілген суреттерді біздің электрондық мекенжайға жіберіңіз. Хатта сіздің жеке және байланыс деректеріңізді (ТАӘ, телефон), сондай-ақ шарт нөмірін көрсетіңіз.'}
                      </p>
                      <div className="bg-kimmy-pink/10 p-3 rounded-lg">
                        <p className="text-sm font-medium text-kimmy-pink-dark">
                          {language === 'ru' ? 'Email для гарантийных вопросов будет предоставлен при покупке'
                            : 'Кепілдік сұрақтары үшін Email сатып алу кезінде берілетін болады'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              <motion.div 
                className="glass-card p-6"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-kimmy-pink" />
                  <h3 className="text-xl font-semibold text-kimmy-pink-dark">
                    {language === 'ru' ? 'Быстрая связь' : 'Жылдам байланыс'}
                  </h3>
                </div>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Для срочных вопросов вы можете связаться с нами по телефону, указанному в договоре купли-продажи.'
                    : 'Шұғыл сұрақтар үшін сату-сатып алу шартында көрсетілген телефон бойынша бізбен байланысасыз.'}
                </p>
              </motion.div>

              <motion.div 
                className="glass-card p-6"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-kimmy-pink" />
                  <h3 className="text-xl font-semibold text-kimmy-pink-dark">
                    {language === 'ru' ? 'Наша гарантия' : 'Біздің кепілдігіміз'}
                  </h3>
                </div>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Мы стремимся решить любые вопросы максимально быстро и в пользу клиента.'
                    : 'Біз кез келген сұрақтарды мүмкіндігінше тез және клиенттің пайдасына шешуге тырысамыз.'}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Warranty;
