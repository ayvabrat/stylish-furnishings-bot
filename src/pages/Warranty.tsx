
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Warranty = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-furniture-primary">
            {language === 'ru' ? 'Условия гарантии' : 'Кепілдік шарттары'}
          </h1>

          <div className="prose prose-lg max-w-none">
            <p>
              В нашем интернет-магазине pro-mebel.shop вы покупаете корпусную и мягкую мебель от проверенных фабрик. 
              Клиентам предоставляется гарантия, которая распространяется на все представленные товары. 
              Конкретные гарантийные условия зависят от выбранного вами изделия.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">
              1. Какие документы нужно сохранить, чтобы действовала гарантия?
            </h2>
            <p>
              Чтобы воспользоваться гарантией, не выбрасывайте бумаги, подтверждающие факт приобретения. 
              Это договор купли-продажи и кассовый чек об оплате покупки.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">
              2. Что нужно сделать, если в течение гарантийного срока в изделии замечен брак?
            </h2>
            <p>
              Сделайте фото, подтверждающее наличие недостатка. При этом вам потребуется заснять изделие в целом и его дефектную деталь.
              Вышлите сделанные фотографии на электронный адрес pro-mebel.shop В письме приведите ваши персональные и контактные данные (ФИО, телефон), а также номер договора.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Warranty;
