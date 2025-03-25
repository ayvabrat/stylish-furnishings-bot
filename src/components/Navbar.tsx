
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Globe, 
  ChevronDown 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'kz' : 'ru');
    setIsLanguageMenuOpen(false);
  };

  // Menu links
  const menuLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.catalog'), path: '/catalog' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.delivery'), path: '/delivery' },
    { name: t('nav.contacts'), path: '/contacts' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" variant={isScrolled ? 'dark' : 'dark'} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`text-furniture-primary hover:text-furniture-secondary transition-colors font-medium text-sm ${
                  location.pathname === link.path ? 'font-semibold' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <div className="relative">
              <button 
                className="flex items-center text-furniture-primary hover:text-furniture-secondary transition-colors"
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              >
                <Globe size={20} />
                <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              {/* Language dropdown */}
              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 bg-white shadow-md rounded-md overflow-hidden z-20 w-24"
                  >
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-furniture-accent transition-colors ${
                        language === 'ru' ? 'font-semibold bg-furniture-accent/50' : ''
                      }`}
                      onClick={() => {
                        setLanguage('ru');
                        setIsLanguageMenuOpen(false);
                      }}
                    >
                      Русский
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-furniture-accent transition-colors ${
                        language === 'kz' ? 'font-semibold bg-furniture-accent/50' : ''
                      }`}
                      onClick={() => {
                        setLanguage('kz');
                        setIsLanguageMenuOpen(false);
                      }}
                    >
                      Қазақша
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-furniture-primary hover:text-furniture-secondary"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-furniture-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-furniture-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t mt-2 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {menuLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`text-furniture-primary py-2 block font-medium ${
                    location.pathname === link.path ? 'font-semibold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
