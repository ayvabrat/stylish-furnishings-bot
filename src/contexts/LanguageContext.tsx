
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
type Language = 'ru' | 'kz';

// Translation data structure
interface Translations {
  [key: string]: {
    ru: string;
    kz: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

// Create translations
const translations: Translations = {
  // Navigation
  'nav.home': {
    ru: 'Главная',
    kz: 'Басты бет',
  },
  'nav.catalog': {
    ru: 'Каталог',
    kz: 'Каталог',
  },
  'nav.about': {
    ru: 'О нас',
    kz: 'Біз туралы',
  },
  'nav.delivery': {
    ru: 'Доставка',
    kz: 'Жеткізу',
  },
  'nav.contacts': {
    ru: 'Контакты',
    kz: 'Байланыс',
  },
  'nav.cart': {
    ru: 'Корзина',
    kz: 'Себет',
  },
  // Home page
  'home.hero.title': {
    ru: 'Современная мебель для вашего дома',
    kz: 'Үйіңіз үшін заманауи жиһаз',
  },
  'home.hero.subtitle': {
    ru: 'Качественная мебель с доставкой по всему Казахстану',
    kz: 'Бүкіл Қазақстан бойынша жеткізілетін сапалы жиһаз',
  },
  'home.categories.title': {
    ru: 'Категории',
    kz: 'Санаттар',
  },
  'home.popular.title': {
    ru: 'Популярные товары',
    kz: 'Танымал тауарлар',
  },
  'home.benefits.title': {
    ru: 'Почему выбирают нас',
    kz: 'Неге бізді таңдайды',
  },
  'home.benefits.quality': {
    ru: 'Высокое качество',
    kz: 'Жоғары сапа',
  },
  'home.benefits.quality.desc': {
    ru: 'Мы используем только качественные материалы',
    kz: 'Біз тек сапалы материалдарды қолданамыз',
  },
  'home.benefits.delivery': {
    ru: 'Быстрая доставка',
    kz: 'Жылдам жеткізу',
  },
  'home.benefits.delivery.desc': {
    ru: 'Доставка по всему Казахстану',
    kz: 'Бүкіл Қазақстан бойынша жеткізу',
  },
  'home.benefits.warranty': {
    ru: 'Гарантия',
    kz: 'Кепілдік',
  },
  'home.benefits.warranty.desc': {
    ru: 'Гарантия на всю продукцию',
    kz: 'Барлық өнімдерге кепілдік',
  },
  // Product related
  'product.price': {
    ru: 'Цена:',
    kz: 'Бағасы:',
  },
  'product.currency': {
    ru: 'тг',
    kz: 'тг',
  },
  'product.addToCart': {
    ru: 'Добавить в корзину',
    kz: 'Себетке қосу',
  },
  'product.buyNow': {
    ru: 'Купить сейчас',
    kz: 'Қазір сатып алу',
  },
  'product.description': {
    ru: 'Описание',
    kz: 'Сипаттама',
  },
  'product.characteristics': {
    ru: 'Характеристики',
    kz: 'Сипаттамалары',
  },
  'product.color': {
    ru: 'Цвет',
    kz: 'Түсі',
  },
  'product.material': {
    ru: 'Материал',
    kz: 'Материал',
  },
  'product.dimensions': {
    ru: 'Размеры',
    kz: 'Өлшемдері',
  },
  // Cart
  'cart.title': {
    ru: 'Корзина',
    kz: 'Себет',
  },
  'cart.empty': {
    ru: 'Ваша корзина пуста',
    kz: 'Сіздің себетіңіз бос',
  },
  'cart.total': {
    ru: 'Итого:',
    kz: 'Барлығы:',
  },
  'cart.checkout': {
    ru: 'Оформить заказ',
    kz: 'Тапсырысты рәсімдеу',
  },
  'cart.continue': {
    ru: 'Продолжить покупки',
    kz: 'Сатып алуды жалғастыру',
  },
  'cart.remove': {
    ru: 'Удалить',
    kz: 'Жою',
  },
  // Checkout
  'checkout.title': {
    ru: 'Оформление заказа',
    kz: 'Тапсырысты рәсімдеу',
  },
  'checkout.personalInfo': {
    ru: 'Личная информация',
    kz: 'Жеке ақпарат',
  },
  'checkout.name': {
    ru: 'Имя',
    kz: 'Аты',
  },
  'checkout.surname': {
    ru: 'Фамилия',
    kz: 'Тегі',
  },
  'checkout.phone': {
    ru: 'Телефон',
    kz: 'Телефон',
  },
  'checkout.email': {
    ru: 'Email',
    kz: 'Email',
  },
  'checkout.address': {
    ru: 'Адрес доставки',
    kz: 'Жеткізу мекенжайы',
  },
  'checkout.city': {
    ru: 'Город',
    kz: 'Қала',
  },
  'checkout.street': {
    ru: 'Улица',
    kz: 'Көше',
  },
  'checkout.house': {
    ru: 'Дом',
    kz: 'Үй',
  },
  'checkout.apartment': {
    ru: 'Квартира',
    kz: 'Пәтер',
  },
  'checkout.comment': {
    ru: 'Комментарий к заказу',
    kz: 'Тапсырысқа түсініктеме',
  },
  'checkout.submit': {
    ru: 'Отправить заказ',
    kz: 'Тапсырысты жіберу',
  },
  'checkout.wait': {
    ru: 'Подождите, мы обрабатываем ваш заказ...',
    kz: 'Күте тұрыңыз, біз сіздің тапсырысыңызды өңдеудеміз...',
  },
  'checkout.paymentInfo': {
    ru: 'Информация для оплаты',
    kz: 'Төлем туралы ақпарат',
  },
  'checkout.uploadReceipt': {
    ru: 'Загрузить чек',
    kz: 'Чекті жүктеу',
  },
  'checkout.success': {
    ru: 'Заказ успешно оформлен!',
    kz: 'Тапсырыс сәтті рәсімделді!',
  },
  // Categories
  'category.livingRoom': {
    ru: 'Гостиная',
    kz: 'Қонақ бөлмесі',
  },
  'category.bedroom': {
    ru: 'Спальня',
    kz: 'Жатын бөлмесі',
  },
  'category.kitchen': {
    ru: 'Кухня',
    kz: 'Ас үй',
  },
  'category.office': {
    ru: 'Офис',
    kz: 'Кеңсе',
  },
  'category.children': {
    ru: 'Детская',
    kz: 'Балалар',
  },
  // Footer
  'footer.companyName': {
    ru: 'ProMebel',
    kz: 'ProMebel',
  },
  'footer.rights': {
    ru: 'Все права защищены',
    kz: 'Барлық құқықтар қорғалған',
  },
  'footer.address': {
    ru: 'Адрес: г. Алматы, ул. Абая, 52',
    kz: 'Мекенжайы: Алматы қ., Абай к-сі, 52',
  },
  'footer.phone': {
    ru: 'Телефон: +7 (727) 123-45-67',
    kz: 'Телефон: +7 (727) 123-45-67',
  },
  'footer.email': {
    ru: 'Email: info@promebel.shop',
    kz: 'Email: info@promebel.shop',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get saved language from localStorage or default to Russian
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'ru';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
