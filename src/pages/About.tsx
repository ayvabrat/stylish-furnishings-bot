
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { language } = useLanguage();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                {language === 'ru' ? 'О нас' : 'Біз туралы'}
              </h1>
              
              <div className="prose prose-lg max-w-none">
                {language === 'ru' ? (
                  <>
                    <p>
                      <strong>ProMebel</strong> – ведущий производитель и поставщик качественной мебели в Казахстане с многолетним опытом работы на рынке. Мы предлагаем широкий ассортимент мебели для дома и офиса, созданной с учетом современных тенденций дизайна и высоких стандартов качества.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Наша миссия</h2>
                    <p>
                      Мы стремимся создавать комфортные и функциональные интерьеры, которые делают повседневную жизнь наших клиентов более удобной и приятной. Наша цель – обеспечить казахстанцев доступной и качественной мебелью, которая соответствует их потребностям и ожиданиям.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Наши преимущества</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Широкий ассортимент мебели для всех помещений</li>
                      <li>Использование только качественных материалов</li>
                      <li>Современное производственное оборудование</li>
                      <li>Опытные мастера и дизайнеры</li>
                      <li>Доставка по всему Казахстану</li>
                      <li>Гарантия на всю продукцию</li>
                    </ul>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Наша история</h2>
                    <p>
                      Компания ProMebel была основана в 2010 году группой энтузиастов, объединенных идеей создания качественной и доступной мебели для казахстанских потребителей. Начав с небольшого производства, мы постепенно расширили ассортимент и географию доставки, став одним из ведущих игроков на мебельном рынке Казахстана.
                    </p>
                    <p>
                      За время работы мы реализовали тысячи проектов по обустройству домов, квартир и офисов. Наши клиенты ценят нас за индивидуальный подход, внимание к деталям и неизменно высокое качество.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Наши партнеры</h2>
                    <p>
                      Мы сотрудничаем с ведущими поставщиками материалов и комплектующих из Казахстана, России, Европы и Азии. Это позволяет нам предлагать клиентам разнообразные решения, отвечающие самым высоким требованиям к качеству и дизайну.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>ProMebel</strong> – нарықтағы көпжылдық тәжірибесі бар Қазақстандағы сапалы жиһаздың жетекші өндірушісі және жеткізушісі. Біз заманауи дизайн тенденциялары мен жоғары сапа стандарттарын ескере отырып жасалған үй және кеңсе жиһаздарының кең ассортиментін ұсынамыз.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Біздің миссиямыз</h2>
                    <p>
                      Біз клиенттеріміздің күнделікті өмірін ыңғайлы және жағымды ететін жайлы және функционалды интерьерлер жасауға тырысамыз. Біздің мақсатымыз - қазақстандықтарды олардың қажеттіліктері мен үміттеріне сәйкес келетін қолжетімді және сапалы жиһазбен қамтамасыз ету.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Біздің артықшылықтарымыз</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Барлық бөлмелерге арналған жиһаздың кең ассортименті</li>
                      <li>Тек сапалы материалдарды қолдану</li>
                      <li>Заманауи өндірістік жабдық</li>
                      <li>Тәжірибелі шеберлер мен дизайнерлер</li>
                      <li>Бүкіл Қазақстан бойынша жеткізу</li>
                      <li>Барлық өнімдерге кепілдік</li>
                    </ul>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Біздің тарихымыз</h2>
                    <p>
                      ProMebel компаниясы 2010 жылы қазақстандық тұтынушылар үшін сапалы және қолжетімді жиһаз жасау идеясын біріктірген энтузиастар тобы құрды. Шағын өндірістен бастап, біз ассортимент пен жеткізу географиясын біртіндеп кеңейтіп, Қазақстанның жиһаз нарығындағы жетекші ойыншылардың біріне айналдық.
                    </p>
                    <p>
                      Жұмыс істеген уақытта біз үйлерді, пәтерлерді және кеңселерді жайластыру бойынша мыңдаған жобаларды жүзеге асырдық. Клиенттеріміз бізді жеке тәсіліміз, детальдарға назар аударуымыз және ұдайы жоғары сапамыз үшін бағалайды.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Біздің әріптестеріміз</h2>
                    <p>
                      Біз Қазақстан, Ресей, Еуропа және Азияның материалдары мен компоненттерінің жетекші жеткізушілерімен ынтымақтасамыз. Бұл бізге клиенттерге сапа мен дизайнға қойылатын ең жоғары талаптарға жауап беретін әртүрлі шешімдерді ұсынуға мүмкіндік береді.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
