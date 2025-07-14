
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

const Cart = () => {
  const { language, t } = useLanguage();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();
  
  // Cart item animation variants
  const cartItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1]
      }
    }),
    exit: { 
      opacity: 0, 
      x: -10,
      transition: { 
        duration: 0.3,
        ease: [0.95, 0.05, 0.795, 0.035]
      }
    }
  };
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            {/* Page title */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">{t('cart.title')}</h1>
            </div>
            
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-6">
                  <ShoppingCart size={64} className="mx-auto text-furniture-secondary/30" />
                </div>
                <h2 className="text-xl font-medium mb-4">{t('cart.empty')}</h2>
                <Button asChild>
                  <Link to="/catalog">{t('cart.continue')}</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                      {items.map((item, index) => (
                        <motion.li 
                          key={item.id}
                          custom={index}
                          variants={cartItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="p-4 md:p-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            {/* Product image */}
                            <div className="w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                              <Link to={`/product/${item.id}`}>
                                <img 
                                  src={item.images[0]} 
                                  alt={language === 'ru' ? item.name : (item.nameKz || item.name)} 
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </Link>
                            </div>
                            
                            {/* Product details */}
                            <div className="flex-grow sm:ml-4">
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <div>
                                  <Link to={`/product/${item.id}`} className="text-furniture-primary font-medium hover:underline">
                                    {language === 'ru' ? item.name : (item.nameKz || item.name)}
                                  </Link>
                                  <p className="text-furniture-secondary text-sm mt-1">
                                    {formatPrice(item.price)}
                                  </p>
                                </div>
                                
                                <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                                  <p className="font-semibold">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                  
                                  <div className="flex items-center mt-2">
                                    {/* Quantity controls */}
                                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 flex items-center justify-center text-furniture-secondary hover:bg-furniture-light"
                                        disabled={item.quantity <= 1}
                                      >
                                        <ChevronLeft size={16} />
                                      </button>
                                      <span className="w-10 text-center">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-furniture-secondary hover:bg-furniture-light"
                                      >
                                        <ChevronRight size={16} />
                                      </button>
                                    </div>
                                    
                                    {/* Remove button */}
                                    <button
                                      onClick={() => removeItem(item.id)}
                                      className="ml-4 text-furniture-secondary hover:text-red-500 transition-colors"
                                      aria-label={t('cart.remove')}
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Order summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
                    <h2 className="text-lg font-semibold mb-4">
                      {language === 'ru' ? 'Сумма заказа' : 'Тапсырыс сомасы'}
                    </h2>
                    
                    <div className="border-t border-b border-gray-100 py-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-furniture-secondary">
                          {language === 'ru' 
                            ? `Товары (${items.length})` 
                            : `Тауарлар (${items.length})`}
                        </span>
                        <span className="font-medium">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center font-semibold text-lg mb-6">
                      <span>{t('cart.total')}</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    
                    <Button 
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-furniture-primary text-white hover:bg-furniture-dark"
                    >
                      {t('cart.checkout')}
                    </Button>
                    
                    <Link to="/catalog" className="block text-center mt-4 text-furniture-secondary hover:text-furniture-primary text-sm">
                      {t('cart.continue')}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
