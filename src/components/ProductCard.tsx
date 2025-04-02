
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductType } from '@/types/product';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: ProductType;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Format price with thousand separators
  const formattedPrice = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  // Default image if none available
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="group h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] h-full flex flex-col">
          {/* Product image */}
          <div className="relative aspect-square overflow-hidden bg-furniture-accent/20">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              {!isImageLoaded && !hasError && (
                <div className="animate-pulse w-full h-full bg-furniture-accent/30"></div>
              )}
              
              {/* Fallback for image errors */}
              {hasError && (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-gray-400 text-sm">{language === 'ru' ? product.name : (product.nameKz || product.name)}</div>
                </div>
              )}
              
              <img 
                src={productImage} 
                alt={language === 'ru' ? product.name : (product.nameKz || product.name)}
                className={`w-full h-full object-cover transition-all duration-500 ease-out-expo ${
                  isImageLoaded && !hasError ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  setHasError(true);
                  setIsImageLoaded(true);
                }}
              />
            </div>
            
            {/* Add to cart button */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                onClick={handleAddToCart}
                variant="secondary"
                size="sm"
                className="bg-white hover:bg-furniture-primary hover:text-white transition-all duration-300 shadow-md"
              >
                <ShoppingCart size={16} className="mr-2" />
                {t('product.addToCart')}
              </Button>
            </div>
          </div>
          
          {/* Product info */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-furniture-primary font-medium text-sm md:text-base mb-1 line-clamp-2">
              {language === 'ru' ? product.name : (product.nameKz || product.name)}
            </h3>
            <div className="mt-auto pt-2">
              <p className="font-semibold text-furniture-primary">
                {formattedPrice} {t('product.currency')}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
