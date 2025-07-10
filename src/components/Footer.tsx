
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-furniture-light border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <Logo />
            <p className="text-furniture-secondary text-sm mt-4 font-medium">
              My Kimmy - магазин стильных сумок для современных женщин
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-furniture-primary font-bold mb-4">{t('nav.catalog')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog/handbags" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm font-medium">
                  Сумки
                </Link>
              </li>
              <li>
                <Link to="/catalog/backpacks" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm font-medium">
                  Рюкзаки
                </Link>
              </li>
              <li>
                <Link to="/catalog/clutches" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm font-medium">
                  Клатчи
                </Link>
              </li>
              <li>
                <Link to="/catalog/accessories" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm font-medium">
                  Аксессуары
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-furniture-primary font-bold mb-4">{t('nav.about')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm font-medium">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm font-medium">
                  {t('nav.delivery')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-furniture-secondary text-sm font-medium">
            © {currentYear} My Kimmy. {t('footer.rights')}.
          </p>
          <div className="mt-4 md:mt-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 inline-block mr-2" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 inline-block" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
