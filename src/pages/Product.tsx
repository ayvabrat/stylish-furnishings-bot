
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import { getProductById, getRelatedProducts } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

const Product = () => {
  const { productId } = useParams<{ productId: string }>();
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  // Get product details
  const product = productId ? getProductById(productId) : null;
  
  // Get related products
  const relatedProducts = productId ? getRelatedProducts(productId, 4) : [];
  
  // State for current image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImageIndex(0);
    setImageLoaded(false);
  }, [productId]);
  
  // Redirect to 404 if product not found
  if (!product) {
    return <div>Product not found</div>;
  }

  // Format price with thousand separators
  const formattedPrice = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  // Handle image navigation
  const goToNextImage = () => {
    setImageLoaded(false);
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const goToPrevImage = () => {
    setImageLoaded(false);
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };
  
  // Add product to cart and go to cart page
  const handleBuyNow = () => {
    addItem(product);
    navigate('/cart');
  };
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Link 
                to="/catalog" 
                className="text-furniture-secondary hover:text-furniture-primary transition-colors text-sm inline-flex items-center"
              >
                <ChevronLeft size={16} className="mr-1" />
                {t('nav.catalog')}
              </Link>
            </div>
            
            {/* Product details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Product images */}
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-furniture-light relative">
                  {/* Image loader */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-furniture-accent/20 animate-pulse"></div>
                  )}
                  
                  {/* Main image */}
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImageIndex}
                      src={product.images[currentImageIndex]} 
                      alt={language === 'ru' ? product.name : (product.nameKz || product.name)} 
                      className="w-full h-full object-cover product-gallery-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imageLoaded ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </AnimatePresence>
                  
                  {/* Navigation arrows - only show if multiple images */}
                  {product.images.length > 1 && (
                    <>
                      <button 
                        onClick={goToPrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={goToNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail gallery - only show if multiple images */}
                {product.images.length > 1 && (
                  <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button 
                        key={index}
                        onClick={() => {
                          setImageLoaded(false);
                          setCurrentImageIndex(index);
                        }}
                        className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                          index === currentImageIndex 
                            ? 'border-furniture-primary' 
                            : 'border-transparent hover:border-furniture-secondary/50'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${product.name} - ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {language === 'ru' ? product.name : (product.nameKz || product.name)}
                </h1>
                
                <div className="mb-6">
                  <span className="text-xl md:text-2xl font-bold text-furniture-primary block">
                    {formattedPrice} {t('product.currency')}
                  </span>
                  <span className="text-furniture-secondary text-sm block mt-1">
                    {product.inStock 
                      ? (language === 'ru' ? 'В наличии' : 'Қолда бар') 
                      : (language === 'ru' ? 'Нет в наличии' : 'Қолда жоқ')}
                  </span>
                </div>
                
                {/* Product actions */}
                <div className="flex space-x-4 mb-8">
                  <Button 
                    onClick={() => addItem(product)}
                    className="bg-furniture-primary text-white hover:bg-furniture-dark"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    {t('product.addToCart')}
                  </Button>
                  
                  <Button 
                    onClick={handleBuyNow}
                    variant="outline"
                    className="border-furniture-primary text-furniture-primary hover:bg-furniture-primary hover:text-white"
                    disabled={!product.inStock}
                  >
                    {t('product.buyNow')}
                  </Button>
                </div>
                
                {/* Product characteristics */}
                <div className="mt-4">
                  <h2 className="text-lg font-medium mb-3">
                    {language === 'ru' ? 'Характеристики' : 'Сипаттамалары'}
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="font-medium w-32 text-furniture-primary">{t('product.dimensions')}:</span>
                      <span className="text-furniture-secondary">{product.characteristics.dimensions}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-32 text-furniture-primary">{t('product.material')}:</span>
                      <span className="text-furniture-secondary">{product.characteristics.material}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-32 text-furniture-primary">{t('product.color')}:</span>
                      <span className="text-furniture-secondary">{product.characteristics.color}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Related products */}
            {relatedProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-8">
                  {language === 'ru' ? 'Похожие товары' : 'Ұқсас тауарлар'}
                </h2>
                <ProductGrid products={relatedProducts} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
