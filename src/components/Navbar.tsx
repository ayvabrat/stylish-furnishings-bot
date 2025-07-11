
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Globe, 
  ChevronDown,
  Headphones,
  Heart,
  Search,
  User
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import TechSupportModal from './TechSupportModal';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isTechSupportOpen, setIsTechSupportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    { name: language === 'ru' ? 'Главная' : 'Басты бет', path: '/' },
    { name: language === 'ru' ? 'Каталог' : 'Каталог', path: '/catalog' },
    { name: language === 'ru' ? 'О бренде' : 'Бренд туралы', path: '/about' },
    { name: language === 'ru' ? 'Доставка' : 'Жеткізу', path: '/delivery' },
    { name: language === 'ru' ? 'Гарантия' : 'Кепілдік', path: '/warranty' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2 border-b border-kimmy-pink/20' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Logo size="md" variant="dark" />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  to={link.path}
                  className={`text-kimmy-pink-dark hover:text-kimmy-pink transition-all duration-300 font-semibold text-sm relative group ${
                    location.pathname === link.path ? 'text-kimmy-pink' : ''
                  }`}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-kimmy-pink rounded-full transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={language === 'ru' ? 'Поиск сумок...' : 'Сөмкелерді іздеу...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-white/80 backdrop-blur-sm border border-kimmy-pink/20 rounded-full focus:outline-none focus:ring-2 focus:ring-kimmy-pink/50 focus:border-kimmy-pink transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-kimmy-pink" />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* User Registration */}
            <Button
              variant="ghost"
              size="icon"
              className="text-kimmy-pink-dark hover:text-kimmy-pink hover:bg-kimmy-pink/10 rounded-full transition-all duration-300"
            >
              <User size={22} />
            </Button>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              className="text-kimmy-pink-dark hover:text-kimmy-pink hover:bg-kimmy-pink/10 rounded-full transition-all duration-300 relative"
            >
              <Heart size={22} />
              <span className="absolute -top-1 -right-1 bg-kimmy-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Language switcher */}
            <div className="relative hidden md:block">
              <button 
                className="flex items-center text-kimmy-pink-dark hover:text-kimmy-pink transition-colors p-2 rounded-full hover:bg-kimmy-pink/10"
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              >
                <Globe size={20} />
                <span className="ml-1 text-sm font-semibold">{language.toUpperCase()}</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              {/* Language dropdown */}
              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 bg-white/95 backdrop-blur-md shadow-xl rounded-xl overflow-hidden z-20 w-28 border border-kimmy-pink/20"
                  >
                    <button 
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-kimmy-pink/10 transition-colors ${
                        language === 'ru' ? 'font-semibold bg-kimmy-pink/5 text-kimmy-pink' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setLanguage('ru');
                        setIsLanguageMenuOpen(false);
                      }}
                    >
                      Русский
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-kimmy-pink/10 transition-colors ${
                        language === 'kz' ? 'font-semibold bg-kimmy-pink/5 text-kimmy-pink' : 'text-gray-700'
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
                className="text-kimmy-pink-dark hover:text-kimmy-pink hover:bg-kimmy-pink/10 rounded-full transition-all duration-300"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-kimmy-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden text-kimmy-pink-dark p-2 rounded-full hover:bg-kimmy-pink/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск сумок...' : 'Сөмкелерді іздеу...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/80 backdrop-blur-sm border border-kimmy-pink/20 rounded-full focus:outline-none focus:ring-2 focus:ring-kimmy-pink/50 focus:border-kimmy-pink transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-kimmy-pink" />
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
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-kimmy-pink/20 shadow-xl"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {menuLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`text-kimmy-pink-dark py-3 block font-semibold transition-colors ${
                    location.pathname === link.path ? 'text-kimmy-pink' : 'hover:text-kimmy-pink'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-kimmy-pink/20 pt-4">
                <button 
                  className="flex items-center text-kimmy-pink-dark py-2 font-medium"
                  onClick={() => {
                    setIsTechSupportOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <Headphones size={18} className="mr-2" />
                  {language === 'ru' ? 'Поддержка' : 'Қолдау'}
                </button>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-gray-600">
                    {language === 'ru' ? 'Язык:' : 'Тіл:'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage('ru')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        language === 'ru' 
                          ? 'bg-kimmy-pink text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-kimmy-pink/20'
                      }`}
                    >
                      RU
                    </button>
                    <button
                      onClick={() => setLanguage('kz')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        language === 'kz' 
                          ? 'bg-kimmy-pink text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-kimmy-pink/20'
                      }`}
                    >
                      KZ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <TechSupportModal open={isTechSupportOpen} onOpenChange={setIsTechSupportOpen} />
    </header>
  );
};

export default Navbar;
