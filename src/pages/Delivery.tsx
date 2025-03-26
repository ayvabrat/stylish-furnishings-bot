
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, CalendarClock, CreditCard } from 'lucide-react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Delivery = () => {
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
                {language === 'ru' ? 'Доставка и оплата' : 'Жеткізу және төлем'}
              </h1>
              
              <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Delivery icon card */}
                  <div className="bg-furniture-light p-6 rounded-lg">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-furniture-primary/10 rounded-full flex items-center justify-center">
                          <Truck className="text-furniture-primary" size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {language === 'ru' ? 'Доставка по всему Казахстану' : 'Бүкіл Қазақстан бойынша жеткізу'}
                        </h3>
                        <p className="text-furniture-secondary text-sm">
                          {language === 'ru'
                            ? 'Мы осуществляем доставку мебели в любой город Казахстана. Стоимость доставки рассчитывается индивидуально в зависимости от вашего местоположения и габаритов товара.'
                            : 'Біз жиһазды Қазақстанның кез келген қаласына жеткіземіз. Жеткізу құны сіздің орналасқан жеріңіз бен тауардың өлшемдеріне байланысты жеке есептеледі.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time icon card */}
                  <div className="bg-furniture-light p-6 rounded-lg">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-furniture-primary/10 rounded-full flex items-center justify-center">
                          <Clock className="text-furniture-primary" size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {language === 'ru' ? 'Сроки доставки' : 'Жеткізу мерзімдері'}
                        </h3>
                        <p className="text-furniture-secondary text-sm">
                          {language === 'ru'
                            ? 'Сроки доставки зависят от наличия товара на складе и вашего местоположения. В среднем доставка занимает от 1 до 7 рабочих дней.'
                            : 'Жеткізу мерзімдері қоймадағы тауардың болуына және сіздің орналасқан жеріңізге байланысты. Орташа есеппен жеткізу 1-7 жұмыс күнін алады.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Assembly icon card */}
                  <div className="bg-furniture-light p-6 rounded-lg">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-furniture-primary/10 rounded-full flex items-center justify-center">
                          <CalendarClock className="text-furniture-primary" size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {language === 'ru' ? 'Сборка мебели' : 'Жиһаз құрастыру'}
                        </h3>
                        <p className="text-furniture-secondary text-sm">
                          {language === 'ru'
                            ? 'Мы предлагаем услуги профессиональной сборки мебели. Стоимость сборки составляет от 10% от стоимости мебели и зависит от сложности конструкции.'
                            : 'Біз кәсіби жиһаз құрастыру қызметтерін ұсынамыз. Құрастыру құны жиһаз құнының 10%-ынан басталады және құрылымның күрделілігіне байланысты.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment icon card */}
                  <div className="bg-furniture-light p-6 rounded-lg">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-furniture-primary/10 rounded-full flex items-center justify-center">
                          <CreditCard className="text-furniture-primary" size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {language === 'ru' ? 'Способы оплаты' : 'Төлем тәсілдері'}
                        </h3>
                        <p className="text-furniture-secondary text-sm">
                          {language === 'ru'
                            ? 'Мы принимаем оплату банковским переводом. После оформления заказа вам будут предоставлены реквизиты для оплаты.'
                            : 'Біз банк аударымымен төлемді қабылдаймыз. Тапсырыс рәсімделгеннен кейін сізге төлем реквизиттері ұсынылады.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                {language === 'ru' ? (
                  <>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Доставка</h2>
                    <p>
                      Доставка мебели осуществляется нашей собственной службой доставки или транспортными компаниями-партнерами. Перед доставкой наш менеджер свяжется с вами для уточнения деталей и согласования удобного времени.
                    </p>
                    <p>
                      При получении товара обязательно проверьте его комплектацию и внешний вид. В случае обнаружения дефектов или некомплектности, сообщите об этом нашему представителю и сделайте соответствующую пометку в накладной.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Оплата</h2>
                    <p>
                      Для юридических лиц доступна оплата по безналичному расчету. Для физических лиц возможна оплата банковским переводом. После оформления заказа вам будут предоставлены реквизиты для оплаты.
                    </p>
                    <p>
                      Предоплата за заказанный товар составляет 100%. После получения оплаты заказ поступает в обработку.
                    </p>
                    <p>
                      Рассматриваем заявки для оплаты способов KASPI RED, KASPI 0012, HALYK 0012-0024
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Возврат и обмен</h2>
                    <p>
                      Возврат и обмен товара осуществляются в соответствии с Законом РК "О защите прав потребителей". Для оформления возврата или обмена обратитесь к нашим менеджерам по телефону или электронной почте.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Жеткізу</h2>
                    <p>
                      Жиһазды жеткізу біздің жеткізу қызметімізбен немесе серіктес көлік компанияларымен жүзеге асырылады. Жеткізу алдында біздің менеджер сізбен байланысып, мәліметтерді нақтылайды және ыңғайлы уақытты келіседі.
                    </p>
                    <p>
                      Тауарды алған кезде міндетті түрде оның жинақталуын және сыртқы түрін тексеріңіз. Ақаулар немесе жинақтаулар табылған жағдайда, бұл туралы біздің өкілімізге хабарлаңыз және жүкқұжатта тиісті белгі жасаңыз.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Төлем</h2>
                    <p>
                      Заңды тұлғалар үшін қолма-қол ақшасыз есеп айырысу арқылы төлем қолжетімді. Жеке тұлғалар үшін банк аударымы арқылы төлем мүмкін. Тапсырыс рәсімделгеннен кейін сізге төлем реквизиттері ұсынылады.
                    </p>
                    <p>
                      Тапсырыс берілген тауар үшін алдын ала төлем 100% құрайды. Төлем алынғаннан кейін тапсырыс өңдеуге жіберіледі.
                    </p>
                    <p>
                      KASPI RED, KASPI 0012, HALYK 0012-0024 төлем әдістері үшін өтінімдерді қарастырамыз
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Қайтару және айырбастау</h2>
                    <p>
                      Тауарды қайтару және айырбастау "Тұтынушылардың құқықтарын қорғау туралы" ҚР Заңына сәйкес жүзеге асырылады. Қайтару немесе айырбастауды рәсімдеу үшін біздің менеджерлерге телефон немесе электрондық пошта арқылы хабарласыңыз.
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

export default Delivery;
