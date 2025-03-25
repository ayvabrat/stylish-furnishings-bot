
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-furniture-light border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <Logo />
            <p className="text-furniture-secondary text-sm mt-4">
              ProMebel.shop - {t('footer.companyName')}
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-furniture-primary hover:text-furniture-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-furniture-primary hover:text-furniture-secondary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-furniture-primary hover:text-furniture-secondary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-furniture-primary font-medium mb-4">{t('nav.catalog')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog/living-room" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm">
                  {t('category.livingRoom')}
                </Link>
              </li>
              <li>
                <Link to="/catalog/bedroom" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm">
                  {t('category.bedroom')}
                </Link>
              </li>
              <li>
                <Link to="/catalog/kitchen" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm">
                  {t('category.kitchen')}
                </Link>
              </li>
              <li>
                <Link to="/catalog/office" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm">
                  {t('category.office')}
                </Link>
              </li>
              <li>
                <Link to="/catalog/children" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm">
                  {t('category.children')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-furniture-primary font-medium mb-4">{t('nav.about')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm">
                  {t('nav.delivery')}
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm">
                  {t('nav.contacts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-furniture-primary font-medium mb-4">{t('nav.contacts')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-furniture-primary mr-2 mt-1" />
                <span className="text-furniture-secondary text-sm">{t('footer.address')}</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-furniture-primary mr-2" />
                <span className="text-furniture-secondary text-sm">{t('footer.phone')}</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-furniture-primary mr-2" />
                <span className="text-furniture-secondary text-sm">{t('footer.email')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-furniture-secondary text-sm">
            © {currentYear} ProMebel.shop. {t('footer.rights')}.
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
