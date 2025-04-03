
import React from 'react';
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
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  index = 0, 
  slug, 
  title
}) => {
  const { language } = useLanguage();

  // Determine values based on whether we're using a category object or direct props
  const categoryName = category ? category.name[language] : title;
  const categorySlug = category ? category.slug : slug;
  
  // Generate a random color from furniture color palette
  const colors = ['bg-furniture-primary', 'bg-furniture-secondary', 'bg-furniture-accent', 'bg-furniture-neutral'];
  const colorIndex = (index || 0) % colors.length;
  const bgColor = colors[colorIndex];

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
        <div className="p-6 relative">
          {/* Simplified colored block */}
          <div className={`w-full h-full absolute inset-0 ${bgColor} opacity-80 group-hover:opacity-90 transition-opacity`}></div>
          
          {/* Category name */}
          <div className="relative z-10 text-white">
            <h3 className="font-medium text-lg md:text-xl">
              {categoryName}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
