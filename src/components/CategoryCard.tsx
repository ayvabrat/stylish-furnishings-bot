
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
  imageUrl?: string; // Add this prop to support image backgrounds
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  index = 0, 
  slug, 
  title,
  imageUrl
}) => {
  const { language } = useLanguage();

  // Determine values based on whether we're using a category object or direct props
  const categoryName = category ? category.name[language] : title;
  const categorySlug = category ? category.slug : slug;
  const categoryImage = category?.image_url || imageUrl;

  // Generate a random color from furniture color palette
  const colors = ['bg-furniture-primary', 'bg-furniture-secondary', 'bg-furniture-accent', 'bg-furniture-neutral'];
  const colorIndex = (index || 0) % colors.length;
  const bgColor = colors[colorIndex];

  // Background patterns for each category
  const patterns = [
    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    "url(\"data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='72' viewBox='0 0 36 72'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
  ];
  
  const patternIndex = (index || 0) % patterns.length;
  const backgroundPattern = patterns[patternIndex];

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
          {/* Colored block with pattern background */}
          <div 
            className={`w-full h-full ${bgColor} opacity-80 group-hover:opacity-90 transition-opacity`}
            style={{ backgroundImage: backgroundPattern, backgroundRepeat: 'repeat' }}
          ></div>
          
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
