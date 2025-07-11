
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Truck, MapPin, CreditCard, CheckCircle, Clock, Shield } from 'lucide-react';

const Delivery = () => {
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
                <Truck className="w-10 h-10 text-kimmy-pink" />
                {language === 'ru' ? 'Доставка' : 'Жеткізу'}
              </h1>
              <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
                {language === 'ru' 
                  ? 'Доставляем ваши любимые сумки MY Kimmy по всей России быстро и надежно'
                  : 'Сіздің сүйікті MY Kimmy сөмкелеріңізді бүкіл Ресей бойынша жылдам және сенімді жеткіземіз'}
              </p>
            </motion.div>

            {/* Coverage Section */}
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <MapPin className="w-8 h-8 text-kimmy-pink" />
                <h2 className="text-2xl font-bold text-kimmy-pink-dark">
                  {language === 'ru' ? 'География доставки' : 'Жеткізу географиясы'}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-kimmy-pink-dark mb-3">
                    {language === 'ru' ? 'Доставка по всей России' : 'Бүкіл Ресей бойынша жеткізу'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'ru' 
                      ? 'Мы доставляем в любой город России через почтовую службу.'
                      : 'Біз пошта қызметі арқылы Ресейдің кез келген қаласына жеткіземіз.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-kimmy-pink-dark mb-3">
                    {language === 'ru' ? 'В любой город России' : 'Ресейдің кез келген қаласына'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'ru' 
                      ? 'От Калининграда до Владивостока — мы доставим ваш заказ в любую точку страны.'
                      : 'Калининградтан Владивостокқа дейін — біз тапсырысыңызды елдің кез келген нүктесіне жеткіземіз.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Delivery Process */}
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <CheckCircle className="w-8 h-8 text-kimmy-pink" />
                <h2 className="text-2xl font-bold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Как происходит доставка' : 'Жеткізу қалай жүзеге асады'}
                </h2>
              </div>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="font-medium">
                  {language === 'ru' 
                    ? 'Доставка сумок осуществляется по почте России. Перед доставкой наш менеджер свяжется с вами для уточнения деталей и согласования удобного времени.'
                    : 'Сөмкелерді жеткізу Ресей поштасы арқылы жүзеге асырылады. Жеткізуден бұрын біздің менеджер мәліметтерді нақтылау және ыңғайлы уақытты келісу үшін сізбен байланысады.'}
                </p>
                
                <p>
                  {language === 'ru' 
                    ? 'При получении товара обязательно проверьте его комплектацию и внешний вид. В случае обнаружения дефектов или некомплектности, сообщите об этом нашему представителю и сделайте соответствующую пометку в накладной.'
                    : 'Тауарды алу кезінде оның жинақталуын және сыртқы түрін міндетті түрде тексеріңіз. Ақаулар немесе толық емес жағдайлар анықталған жағдайда, бұл туралы біздің өкілге хабарлаңыз және тиісті белгіні жол жүргізу құжатына жасаңыз.'}
                </p>
              </div>
            </motion.div>

            {/* Payment Section */}
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <CreditCard className="w-8 h-8 text-kimmy-pink" />
                <h2 className="text-2xl font-bold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Оплата' : 'Төлем'}
                </h2>
              </div>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  {language === 'ru' 
                    ? 'Оплата возможна банковским переводом. После оформления заказа вам будут предоставлены реквизиты для оплаты.'
                    : 'Банктік аударым арқылы төлеу мүмкін. Тапсырысты рәсімдегеннен кейін сізге төлем үшін реквизиттер берілетін болады.'}
                </p>
                
                <div className="bg-kimmy-pink/10 p-4 rounded-lg">
                  <p className="font-semibold text-kimmy-pink-dark">
                    {language === 'ru' 
                      ? 'Предоплата за заказанный товар составляет 100%. После получения оплаты заказ поступает в обработку.'
                      : 'Тапсырыс берілген тауар үшін алдын ала төлем 100% құрайды. Төлемді алғаннан кейін тапсырыс өңдеуге түседі.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              <motion.div 
                className="glass-card p-6"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-kimmy-pink" />
                  <h3 className="text-xl font-semibold text-kimmy-pink-dark">
                    {language === 'ru' ? 'Сроки доставки' : 'Жеткізу мерзімдері'}
                  </h3>
                </div>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Доставка по России занимает от 3 до 14 рабочих дней в зависимости от региона.'
                    : 'Ресей бойынша жеткізу аймаққа байланысты 3-тен 14 жұмыс күніне дейін уақыт алады.'}
                </p>
              </motion.div>

              <motion.div 
                className="glass-card p-6"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-kimmy-pink" />
                  <h3 className="text-xl font-semibold text-kimmy-pink-dark">
                    {language === 'ru' ? 'Гарантии' : 'Кепілдіктер'}
                  </h3>
                </div>
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Мы гарантируем качество упаковки и сохранность товара при транспортировке.'
                    : 'Біз орау сапасын және тасымалдау кезінде тауардың сақталуын кепілдендіреміз.'}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Delivery;
