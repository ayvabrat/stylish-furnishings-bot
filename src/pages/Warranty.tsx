import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Shield, FileText, Camera, Mail, Phone, AlertCircle, RotateCcw, CreditCard, UserX } from 'lucide-react';

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

            {/* Return Policy */}
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <RotateCcw className="w-8 h-8 text-kimmy-pink" />
                <h2 className="text-2xl font-bold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Возврат сумки в течение 14 дней' : 'Сөмкені 14 күн ішінде қайтару'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  {language === 'ru' 
                    ? 'Мы стремимся, чтобы вы были полностью довольны своей покупкой. Если по какой-то причине вы решили вернуть сумку, у нас есть простая и удобная процедура возврата.'
                    : 'Біз сіздің сатып алуыңыздан толық қанағаттануыңызды қалаймыз. Егер қандай да болса себеппен сөмкені қайтаруға шешім қабылдасаңыз, бізде қарапайым және ыңғайлы қайтару рәсімі бар.'}
                </p>
                
                <h3 className="text-lg font-semibold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Условия возврата:' : 'Қайтару шарттары:'}
                </h3>
                
                <ul className="space-y-2 ml-6 list-disc">
                  <li>
                    <strong>{language === 'ru' ? 'Срок возврата:' : 'Қайтару мерзімі:'}</strong> 
                    {language === 'ru' 
                      ? ' Вы можете вернуть свою сумку в течение 14 дней с момента получения.'
                      : ' Сіз сөмкеңізді алғаннан кейін 14 күн ішінде қайтара аласыз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Состояние товара:' : 'Тауар жағдайы:'}</strong> 
                    {language === 'ru' 
                      ? ' Сумка должна быть в оригинальном состоянии. Она не должна иметь следов использования, повреждений или загрязнений. Также должен быть сохранен оригинальный упаковочный материал и ярлыки.'
                      : ' Сөмке бастапқы жағдайда болуы керек. Онда пайдалану, зақымдалу немесе ластану іздері болмауы тиіс. Сондай-ақ бастапқы орауыш материалы мен белгілері сақталуы керек.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Документы:' : 'Құжаттар:'}</strong> 
                    {language === 'ru' 
                      ? ' Пожалуйста, приложите чек или документ, подтверждающий покупку.'
                      : ' Сатып алуды растайтын чек немесе құжатты тіркеңіз.'}
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Как совершить возврат:' : 'Қайтаруды қалай жасау керек:'}
                </h3>
                
                <ol className="space-y-2 ml-6 list-decimal">
                  <li>
                    <strong>{language === 'ru' ? 'Свяжитесь с нами:' : 'Бізбен байланысыңыз:'}</strong> 
                    {language === 'ru' 
                      ? ' Напишите нам на электронную почту. Опишите причину возврата и предоставьте информацию о заказе.'
                      : ' Бізге электрондық поштаға жазыңыз. Қайтару себебін сипаттаңыз және тапсырыс туралы ақпарат беріңіз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Упаковка:' : 'Орау:'}</strong> 
                    {language === 'ru' 
                      ? ' Убедитесь, что сумка правильно упакована, чтобы избежать повреждений при транспортировке. Мы рекомендуем использовать оригинальную упаковку.'
                      : ' Тасымалдау кезінде зақымданудан сақтану үшін сөмкенің дұрыс оралғанына көз жеткізіңіз. Біз бастапқы орауышты пайдалануды ұсынамыз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Отправка товара:' : 'Тауарды жіберу:'}</strong> 
                    {language === 'ru' 
                      ? ' После получения вашего запроса, мы предоставим инструкции по возврату и адрес для отправки. Вы можете использовать любой удобный для вас способ доставки.'
                      : ' Сіздің сұрауыңызды алғаннан кейін, біз қайтару нұсқаулығын және жіберу мекенжайын береміз. Сіз өзіңізге ыңғайлы кез келген жеткізу әдісін пайдалана аласыз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Возврат средств:' : 'Ақшаны қайтару:'}</strong> 
                    {language === 'ru' 
                      ? ' После того, как мы получим возврат и проверим состояние товара, вы получите полный возврат средств на ту же платежную карту или счет, с которого была произведена покупка. Обычно возврат занимает до 5 рабочих дней.'
                      : ' Біз қайтарымды алып, тауар жағдайын тексергеннен кейін, сіз сатып алу жасалған сол төлем картасына немесе шотқа толық ақша қайтарымын аласыз. Әдетте қайтарым 5 жұмыс күніне дейін уақыт алады.'}
                  </li>
                </ol>
              </div>
            </motion.div>

            {/* Order Rules */}
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <CreditCard className="w-8 h-8 text-kimmy-pink" />
                <h2 className="text-2xl font-bold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Правила оформления заказа сумки' : 'Сөмке тапсырысын рәсімдеу ережелері'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  {language === 'ru' 
                    ? 'Чтобы сделать процесс покупки максимально простым и удобным, мы создали следующие правила оформления заказа:'
                    : 'Сатып алу процесін мүмкіндігінше қарапайым және ыңғайлы ету үшін біз келесі тапсырыс рәсімдеу ережелерін құрдық:'}
                </p>
                
                <ol className="space-y-3 ml-6 list-decimal">
                  <li>
                    <strong>{language === 'ru' ? 'Выбор товара' : 'Тауар таңдау'}</strong><br/>
                    {language === 'ru' 
                      ? 'Просмотрите наш ассортимент сумок и выберите понравившуюся модель. Обратите внимание на описание, размеры и доступные цвета.'
                      : 'Біздің сөмке ассортиментімізді қарап, ұнаған үлгіні таңдаңыз. Сипаттама, өлшемдері мен қолжетімді түстерге назар аударыңыз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Добавление в корзину' : 'Себетке қосу'}</strong><br/>
                    {language === 'ru' 
                      ? 'Нажмите кнопку «В корзину», чтобы выбрать сумку. Вы можете продолжить покупки или перейти к оформлению заказа.'
                      : '«Себетке» түймесін басып, сөмкені таңдаңыз. Сіз сатып алуды жалғастыра аласыз немесе тапсырысты рәсімдеуге өте аласыз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Оформление заказа' : 'Тапсырыс рәсімдеу'}</strong><br/>
                    {language === 'ru' 
                      ? 'Перейдите в корзину и проверьте выбранные товары. Убедитесь, что все указано верно. Нажмите кнопку «Оформить заказ».'
                      : 'Себетке өтіп, таңдалған тауарларды тексеріңіз. Барлығы дұрыс көрсетілгеніне көз жеткізіңіз. «Тапсырысты рәсімдеу» түймесін басыңыз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Ввод данных' : 'Деректерді енгізу'}</strong><br/>
                    {language === 'ru' 
                      ? 'Заполните необходимые поля с информацией (имя, адрес доставки, контактный номер). Убедитесь, что введенные данные корректны, чтобы избежать задержек.'
                      : 'Ақпаратпен қажетті өрістерді толтырыңыз (аты, жеткізу мекенжайы, байланыс нөмірі). Кідірістерден аулақ болу үшін енгізілген деректердің дұрыс екеніне көз жеткізіңіз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Выбор способа оплаты' : 'Төлем әдісін таңдау'}</strong><br/>
                    {language === 'ru' 
                      ? 'Выберите способ оплаты «Оплата картой». Введите данные вашей банковской карты (номер карты, срок действия, CVV). Для оплаты используется система Robokassa.'
                      : '«Картамен төлеу» төлем әдісін таңдаңыз. Банк картаңыздың деректерін енгізіңіз (карта нөмірі, жарамдылық мерзімі, CVV). Төлем үшін Robokassa жүйесі пайдаланылады.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Подтверждение заказа' : 'Тапсырысты растау'}</strong><br/>
                    {language === 'ru' 
                      ? 'Проверьте еще раз все введенные данные и нажмите на кнопку «Подтвердить заказ».'
                      : 'Барлық енгізілген деректерді тағы бір рет тексеріп, «Тапсырысты растау» түймесін басыңыз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Получение заказа' : 'Тапсырысты алу'}</strong><br/>
                    {language === 'ru' 
                      ? 'В зависимости от выбранного способа доставки, вы получите сумку по указанному адресу в указанные сроки.'
                      : 'Таңдалған жеткізу әдісіне байланысты сіз көрсетілген мекенжай бойынша белгіленген мерзімде сөмкені аласыз.'}
                  </li>
                </ol>
              </div>
            </motion.div>

            {/* Purchase Refusal */}
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <UserX className="w-8 h-8 text-kimmy-pink" />
                <h2 className="text-2xl font-bold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Как отказаться от покупки сумок' : 'Сөмке сатып алудан қалай бас тарту керек'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  {language === 'ru' 
                    ? 'Мы понимаем, что иногда обстоятельства могут измениться, и вы можете захотеть отказаться от покупки. Мы сделали процесс отказа простым и понятным.'
                    : 'Біз кейде жағдайлар өзгеруі мүмкін екенін және сіз сатып алудан бас тартқыңыз келуі мүмкін екенін түсінеміз. Біз бас тарту процесін қарапайым және түсінікті етіп жасадық.'}
                </p>
                
                <h3 className="text-lg font-semibold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Условия отказа от покупки:' : 'Сатып алудан бас тарту шарттары:'}
                </h3>
                
                <ul className="space-y-2 ml-6 list-disc">
                  <li>
                    <strong>{language === 'ru' ? 'Срок для отказа:' : 'Бас тарту мерзімі:'}</strong> 
                    {language === 'ru' 
                      ? ' Вы можете отказаться от покупки в течение 14 дней с момента получения товара.'
                      : ' Сіз тауарды алғаннан кейін 14 күн ішінде сатып алудан бас тарта аласыз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Состояние товара:' : 'Тауар жағдайы:'}</strong> 
                    {language === 'ru' 
                      ? ' Сумка должна быть в оригинальном состоянии, без следов использования и с сохраненными ярлыками и упаковкой.'
                      : ' Сөмке бастапқы жағдайда, пайдалану іздерісіз және сақталған белгілер мен орауышпен болуы керек.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Документы:' : 'Құжаттар:'}</strong> 
                    {language === 'ru' 
                      ? ' Для успешного отказа укажите номер заказа и приложите документ, подтверждающий покупку.'
                      : ' Сәтті бас тарту үшін тапсырыс нөмірін көрсетіңіз және сатып алуды растайтын құжатты тіркеңіз.'}
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-kimmy-pink-dark">
                  {language === 'ru' ? 'Как осуществить отказ:' : 'Бас тартуды қалай жүзеге асыру керек:'}
                </h3>
                
                <ol className="space-y-2 ml-6 list-decimal">
                  <li>
                    <strong>{language === 'ru' ? 'Связь с нами:' : 'Бізбен байланыс:'}</strong> 
                    {language === 'ru' 
                      ? ' Напишите нам на электронную почту или позвоните по номеру +7 917 988 9863, чтобы сообщить о вашем желании отказаться от покупки. Укажите причину отказа и номер вашего заказа.'
                      : ' Сатып алудан бас тартқыңыз келетінін хабарлау үшін бізге электрондық поштаға жазыңыз немесе +7 917 988 9863 нөміріне қоңырау шалыңыз. Бас тарту себебін және тапсырыс нөміріңізді көрсетіңіз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Упаковка товара:' : 'Тауарды орау:'}</strong> 
                    {language === 'ru' 
                      ? ' Убедитесь, что сумка упакована в оригинальную упаковку, чтобы избежать повреждений при возврате.'
                      : ' Қайтарым кезінде зақымданудан аулақ болу үшін сөмкенің бастапқы орауышқа оралғанына көз жеткізіңіз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Отправка товара:' : 'Тауарды жіберу:'}</strong> 
                    {language === 'ru' 
                      ? ' Мы предоставим вам инструкцию по возврату и адрес для отправки. Вы можете воспользоваться любым удобным для вас способом доставки.'
                      : ' Біз сізге қайтару нұсқаулығын және жіберу мекенжайын береміз. Сіз өзіңізге ыңғайлы кез келген жеткізу әдісін пайдалана аласыз.'}
                  </li>
                  <li>
                    <strong>{language === 'ru' ? 'Возврат средств:' : 'Ақшаны қайтару:'}</strong> 
                    {language === 'ru' 
                      ? ' После получения сумки и проверки её состояния, мы осуществим возврат средств на тот же платежный метод, с которого была произведена покупка. Обычно возврат занимает до 5 рабочих дней.'
                      : ' Сөмкені алып, оның жағдайын тексергеннен кейін, біз сатып алу жасалған сол төлем әдісіне ақша қайтарамыз. Әдетте қайтарым 5 жұмыс күніне дейін уақыт алады.'}
                  </li>
                </ol>
              </div>
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

            {/* Contact Info with updated phone */}
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
                <p className="text-gray-700 mb-3">
                  {language === 'ru' 
                    ? 'Для срочных вопросов вы можете связаться с нами по телефону:'
                    : 'Шұғыл сұрақтар үшін сіз бізбен телефон арқылы байланыса аласыз:'}
                </p>
                <div className="text-lg font-semibold text-kimmy-pink-dark">
                  +7 917 988 9863
                </div>
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
