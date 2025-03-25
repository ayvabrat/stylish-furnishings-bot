
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductForm from '@/components/ProductForm';
import { fetchProducts } from '@/services/productService';
import { ProductType } from '@/types/product';

const EditProductPage = () => {
  const { language } = useLanguage();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts();
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error(language === 'ru' ? 'Товар не найден' : 'Тауар табылмады');
          navigate('/admin/products');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error(language === 'ru' ? 'Ошибка при загрузке товара' : 'Тауарды жүктеу қатесі');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productId) {
      loadProduct();
    }
  }, [productId, language, navigate]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="bg-white py-10 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-screen-xl mx-auto">
              <div className="p-6 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-furniture-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>{language === 'ru' ? 'Загрузка товара...' : 'Тауар жүктелуде...'}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center mb-6">
              <Link to="/admin/products" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-furniture-secondary hover:text-furniture-primary" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">
                {language === 'ru' ? 'Редактировать товар' : 'Тауарды өңдеу'}
              </h1>
            </div>
            
            {product ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <ProductForm initialData={product} isEditing={true} />
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-furniture-secondary">
                  {language === 'ru' ? 'Товар не найден' : 'Тауар табылмады'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProductPage;
