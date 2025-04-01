
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategoryType } from '@/types/product';

interface CategoryCardProps {
  category?: CategoryType;
  index?: number;
  // Support for direct usage without a category object
  slug?: string;
  title?: string;
  imageUrl?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  index = 0, 
  slug, 
  title, 
  imageUrl 
}) => {
  const { language } = useLanguage();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Determine values based on whether we're using a category object or direct props
  const categoryName = category ? category.name[language] : title;
  const categoryImage = category ? category.image : imageUrl;
  const categorySlug = category ? category.slug : slug;

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

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link 
        to={`/catalog/${categorySlug}`} 
        className="block rounded-lg overflow-hidden group relative shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="aspect-square relative overflow-hidden">
          {/* Background placeholder/loader */}
          {!isImageLoaded && !hasError && (
            <div className="absolute inset-0 bg-furniture-accent/30 animate-pulse"></div>
          )}
          
          {/* Fallback for image errors */}
          {hasError && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-sm">{categoryName}</div>
            </div>
          )}
          
          {/* Category image */}
          <img 
            src={categoryImage} 
            alt={categoryName || ''} 
            className={`w-full h-full object-cover transition-all duration-700 ease-out-expo group-hover:scale-105 ${
              isImageLoaded && !hasError ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsImageLoaded(true); // Also set as loaded to remove loading animation
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Category name */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-medium text-lg md:text-xl mb-1">
              {categoryName}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
