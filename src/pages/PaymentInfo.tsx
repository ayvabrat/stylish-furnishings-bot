
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, CreditCard, RotateCcw, FileText } from 'lucide-react';

const PaymentInfo: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              {language === 'ru' ? 'Информация об оплате' : 'Төлем туралы ақпарат'}
            </h1>

            {/* Payment Methods */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-kimmy-pink" />
                <h2 className="text-2xl font-semibold">
                  {language === 'ru' ? 'Способы оплаты' : 'Төлем әдістері'}
                </h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700 mb-4">
                  {language === 'ru' 
                    ? 'Мы принимаем к оплате банковские карты следующих платежных систем:'
                    : 'Біз келесі төлем жүйелерінің банк карталарын қабылдаймыз:'
                  }
                </p>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <img src="/lovable-uploads/3be3ab67-ee71-42c6-8be7-dad505f9a50b.png" alt="Visa" className="h-8" />
                  <img src="/lovable-uploads/d07598d9-8192-41b3-b48e-b2843ed07623.png" alt="Mastercard" className="h-8" />
                  <img src="/lovable-uploads/160594c8-be4d-4e97-b8a8-82ed881ddef9.png" alt="МИР" className="h-8" />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-kimmy-pink" />
                <h2 className="text-2xl font-semibold">
                  {language === 'ru' ? 'Безопасность платежей' : 'Төлем қауіпсіздігі'}
                </h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Все платежи на нашем сайте обрабатываются через защищенное соединение с использованием технологии шифрования SSL. Это гарантирует, что ваши персональные данные и данные банковской карты передаются в зашифрованном виде и недоступны третьим лицам.'
                    : 'Біздің сайттағы барлық төлемдер SSL шифрлау технологиясын пайдалана отырып қорғалған байланыс арқылы өңделеді. Бұл сіздің жеке деректеріңіз бен банк картасының деректерінің шифрланған түрде беріліп, үшінші тұлғаларға қол жетімді еместігіне кепілдік береді.'
                  }
                </p>
                
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Данные вашей карты не сохраняются на нашем сервере и передаются напрямую в процессинговый центр банка для обработки платежа.'
                    : 'Сіздің карта деректеріңіз біздің серверде сақталмайды және төлемді өңдеу үшін тікелей банктің процессинг орталығына беріледі.'
                  }
                </p>

                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Платежи обрабатываются в соответствии с требованиями международного стандарта безопасности PCI DSS.'
                    : 'Төлемдер PCI DSS халықаралық қауіпсіздік стандартының талаптарына сәйкес өңделеді.'
                  }
                </p>
              </div>
            </div>

            {/* Refunds */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <RotateCcw className="w-6 h-6 text-kimmy-pink" />
                <h2 className="text-2xl font-semibold">
                  {language === 'ru' ? 'Возврат денежных средств' : 'Ақшаны қайтару'}
                </h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Возврат денежных средств при оплате банковской картой осуществляется на ту же карту, с которой была произведена оплата.'
                    : 'Банк картасымен төлеген кезде ақшаны қайтару төлем жасалған сол картаға жүргізіледі.'
                  }
                </p>
                
                <p className="text-gray-700">
                  {language === 'ru' 
                    ? 'Срок возврата денежных средств составляет от 1 до 30 банковских дней в зависимости от банка-эмитента карты.'
                    : 'Ақшаны қайтару мерзімі карта шығарған банкке байланысты 1-ден 30 банк күніне дейін құрайды.'
                  }
                </p>

                <p className="text-gray-700 font-semibold">
                  {language === 'ru' 
                    ? 'ВАЖНО: Возврат осуществляется строго на ту карту, с которой была произведена оплата. Возврат на другую карту невозможен.'
                    : 'МАҢЫЗДЫ: Қайтару тек төлем жасалған картаға ғана жүргізіледі. Басқа картаға қайтару мүмкін емес.'
                  }
                </p>
              </div>
            </div>

            {/* Company Details */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-kimmy-pink" />
                <h2 className="text-2xl font-semibold">
                  {language === 'ru' ? 'Реквизиты компании' : 'Компания деректемелері'}
                </h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg space-y-2">
                <p><strong>{language === 'ru' ? 'Наименование:' : 'Атауы:'}</strong> Самозанятая Юнева Полина Сергеевна</p>
                <p><strong>{language === 'ru' ? 'ИНН:' : 'ИНН:'}</strong> 644308330314</p>
                <p><strong>{language === 'ru' ? 'Адрес:' : 'Мекенжайы:'}</strong> г. Саратов</p>
                <p><strong>{language === 'ru' ? 'Телефон:' : 'Телефон:'}</strong> <a href="https://t.me/qswpr" className="text-kimmy-pink hover:underline">Telegram</a></p>
                <p><strong>E-mail:</strong> support@mykimmy.ru</p>
              </div>
            </div>

            {/* Offer */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {language === 'ru' 
                  ? 'Совершая покупку, вы соглашаетесь с условиями:'
                  : 'Сатып алу арқылы сіз келесі шарттармен келісесіз:'
                }
              </p>
              <a 
                href="/offer" 
                className="text-kimmy-pink hover:underline font-semibold"
              >
                {language === 'ru' ? 'Публичная оферта' : 'Публикалық ұсыныс'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentInfo;
