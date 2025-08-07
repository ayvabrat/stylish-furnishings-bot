
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductType } from '@/types/product';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: ProductType;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
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

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Default image if none available - updated to new image
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://s3.iimg.su/s/14/Cjj6DJKqDK9j4ubDVJhofAcAalWhIJPFJAdyiLEo.jpg';

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="group h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-kimmy-pink/10 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px] hover:border-kimmy-pink/30 h-full flex flex-col relative">
          {/* Favorite heart button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorite 
                  ? 'text-kimmy-pink fill-current animate-heartbeat' 
                  : 'text-gray-400 hover:text-kimmy-pink'
              }`}
            />
          </button>

          {/* Product image */}
          <div className="relative aspect-square overflow-hidden bg-kimmy-pink-light/20">
            <div className="w-full h-full bg-gradient-to-br from-kimmy-pink-light to-white flex items-center justify-center">
              {!isImageLoaded && !hasError && (
                <div className="animate-pulse w-full h-full bg-kimmy-pink/10 shimmer-effect"></div>
              )}
              
              {/* Fallback for image errors */}
              {hasError && (
                <div className="w-full h-full flex items-center justify-center bg-kimmy-pink-light">
                  <div className="text-kimmy-pink text-sm font-medium text-center p-4">
                    {language === 'ru' ? product.name : (product.nameKz || product.name)}
                  </div>
                </div>
              )}
              
              <img 
                src={productImage} 
                alt={language === 'ru' ? product.name : (product.nameKz || product.name)}
                className={`w-full h-full object-cover transition-all duration-700 ease-out-expo ${
                  isImageLoaded && !hasError ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  setHasError(true);
                  setIsImageLoaded(true);
                }}
              />
            </div>
            
            {/* Add to cart button overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="bg-kimmy-pink hover:bg-kimmy-pink-dark text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 rounded-full px-6"
              >
                <ShoppingCart size={16} className="mr-2" />
                {language === 'ru' ? 'В корзину' : 'Себетке'}
              </Button>
            </div>
          </div>
          
          {/* Product info */}
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-kimmy-pink-dark font-bold text-base md:text-lg mb-2 line-clamp-2 leading-tight">
              {language === 'ru' ? product.name : (product.nameKz || product.name)}
            </h3>
            
            {/* Product description */}
            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {language === 'ru' ? product.description.ru : product.description.kz}
              </p>
            )}
            
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl md:text-2xl font-black text-kimmy-pink block">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-gray-500 text-xs block mt-1">
                    {product.inStock 
                      ? (language === 'ru' ? 'В наличии' : 'Қолда бар') 
                      : (language === 'ru' ? 'Нет в наличии' : 'Қолда жоқ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
