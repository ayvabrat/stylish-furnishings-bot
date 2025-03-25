
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductForm from '@/components/ProductForm';

const AddProductPage = () => {
  const { language } = useLanguage();
  
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
                {language === 'ru' ? 'Добавить товар' : 'Тауар қосу'}
              </h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <ProductForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddProductPage;
