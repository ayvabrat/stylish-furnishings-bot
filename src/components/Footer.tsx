
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gradient-pink border-t border-kimmy-pink/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-700 text-sm mt-4 font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-kimmy-pink" fill="currentColor" />
              {language === 'ru' 
                ? 'MY Kimmy - магазин стильных сумок для современных женщин' 
                : 'MY Kimmy - заманауи әйелдер үшін стильді сөмкелер дүкені'}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-kimmy-pink" />
              <span>{language === 'ru' ? 'Доставка по всей России' : 'Бүкіл Ресей бойынша жеткізу'}</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-kimmy-pink-dark font-bold mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" fill="currentColor" />
              {language === 'ru' ? 'Каталог' : 'Каталог'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog/handbags" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'Женские сумки' : 'Әйелдер сөмкелері'}
                </Link>
              </li>
              <li>
                <Link to="/catalog/backpacks" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'Рюкзаки' : 'Рюкзактар'}
                </Link>
              </li>
              <li>
                <Link to="/catalog/clutches" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'Клатчи' : 'Клатчтар'}
                </Link>
              </li>
              <li>
                <Link to="/catalog/accessories" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'Аксессуары' : 'Аксессуарлар'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-kimmy-pink-dark font-bold mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" fill="currentColor" />
              {language === 'ru' ? 'Информация' : 'Ақпарат'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'О бренде' : 'Бренд туралы'}
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'Доставка и оплата' : 'Жеткізу және төлем'}
                </Link>
              </li>
              <li>
                <Link to="/payment-info" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'Информация об оплате' : 'Төлем туралы ақпарат'}
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'Гарантия качества' : 'Сапа кепілдігі'}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'Политика конфиденциальности' : 'Құпиялылық саясаты'}
                </Link>
              </li>
              <li>
                <Link to="/offer" className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium">
                  {language === 'ru' ? 'Публичная оферта' : 'Публикалық ұсыныс'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-kimmy-pink-dark font-bold mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" fill="currentColor" />
              {language === 'ru' ? 'Связь с нами' : 'Бізбен байланыс'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://t.me/qswpr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Telegram
                </a>
              </li>
              <li>
                <a 
                  href="mailto:nastyakim0309@gmail.com" 
                  className="text-gray-600 hover:text-kimmy-pink transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  nastyakim0309@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Individual Entrepreneur Info */}
        <div className="border-t border-kimmy-pink/20 mt-8 pt-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600 text-sm font-medium">
              {language === 'ru' ? 'Самозанятая Юнева Полина Сергеевна' : 'Жеке кәсіпкер Юнева Полина Сергеевна'}
            </p>
            <p className="text-gray-600 text-xs">
              ИНН: 644308330314
            </p>
            <p className="text-gray-600 text-xs">
              {language === 'ru' ? 'г. Саратов, Орджоникидзе 44 а, дом 1' : 'Саратов қ., Орджоникидзе 44 а, үй 1'}
            </p>
          </div>
        </div>

        <div className="border-t border-kimmy-pink/20 mt-6 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm font-medium flex items-center gap-2">
            <Heart className="w-4 h-4 text-kimmy-pink animate-heartbeat" fill="currentColor" />
            © {currentYear} MY Kimmy. {language === 'ru' ? 'Все права защищены' : 'Барлық құқықтар қорғалған'}.
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="flex gap-2">
              <img src="/lovable-uploads/3be3ab67-ee71-42c6-8be7-dad505f9a50b.png" alt="Visa" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
              <img src="/lovable-uploads/d07598d9-8192-41b3-b48e-b2843ed07623.png" alt="Mastercard" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
              <img src="/lovable-uploads/160594c8-be4d-4e97-b8a8-82ed881ddef9.png" alt="МИР" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
