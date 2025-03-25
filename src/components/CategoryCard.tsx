
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategoryType } from '@/types/product';

interface CategoryCardProps {
  category: CategoryType;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const { language } = useLanguage();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
        to={`/catalog/${category.slug}`} 
        className="block rounded-lg overflow-hidden group relative shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="aspect-square relative overflow-hidden">
          {/* Background placeholder/loader */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-furniture-accent/30 animate-pulse"></div>
          )}
          
          {/* Category image */}
          <img 
            src={category.image} 
            alt={category.name[language]} 
            className={`w-full h-full object-cover transition-all duration-700 ease-out-expo group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Category name */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-medium text-lg md:text-xl mb-1">
              {category.name[language]}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
