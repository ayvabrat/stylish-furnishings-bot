
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import { getProductsByCategory, getCategoryBySlug, categories, products } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryCard from '@/components/CategoryCard';

const Catalog = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { language, t } = useLanguage();
  
  // Get products based on category or all products if no category specified
  const displayProducts = categorySlug 
    ? getProductsByCategory(categorySlug) 
    : products;
  
  // Get category details if a category is specified
  const category = categorySlug 
    ? getCategoryBySlug(categorySlug) 
    : null;

  // Scroll to top on component mount or when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  // Determine page title
  const pageTitle = category 
    ? category.name[language] 
    : t('nav.catalog');

  return (
    <Layout>
      <div className="bg-furniture-light py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            {/* Page title */}
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl font-bold">{pageTitle}</h1>
              {!categorySlug && (
                <p className="text-furniture-secondary mt-4 max-w-2xl mx-auto">
                  {language === 'ru' 
                    ? 'Выберите качественную мебель для вашего дома от лучших производителей Казахстана'
                    : 'Қазақстанның үздік өндірушілерінен үйіңізге сапалы жиһазды таңдаңыз'}
                </p>
              )}
            </div>
            
            {/* Category filters - only show if no category is selected */}
            {!categorySlug && (
              <div className="mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {categories.map((cat, index) => (
                    <CategoryCard 
                      key={cat.id}
                      category={cat}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Products */}
            {displayProducts.length > 0 ? (
              <ProductGrid products={displayProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-furniture-secondary">
                  {language === 'ru'
                    ? 'Товары не найдены'
                    : 'Тауарлар табылмады'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;
