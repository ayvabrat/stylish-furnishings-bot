
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchProducts, deleteProduct } from '@/services/productService';
import { ProductType } from '@/types/product';

const AdminProducts = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
        toast.error(language === 'ru' ? 'Ошибка при загрузке товаров' : 'Тауарларды жүктеу қатесі');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [language]);
  
  // Filtered products based on search
  const filteredProducts = products.filter(product => 
    (language === 'ru' ? product.name : (product.nameKz || product.name))
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  
  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete);
      setProducts(products.filter(product => product.id !== productToDelete));
      toast.success(language === 'ru' ? 'Товар успешно удален' : 'Тауар сәтті жойылды');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error(language === 'ru' ? 'Ошибка при удалении товара' : 'Тауарды жою қатесі');
    } finally {
      setProductToDelete(null);
    }
  };
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Link to="/admin" className="mr-4">
                  <ArrowLeft className="h-5 w-5 text-furniture-secondary hover:text-furniture-primary" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {language === 'ru' ? 'Управление товарами' : 'Тауарларды басқару'}
                </h1>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-furniture-secondary" />
                  <Input
                    type="text"
                    placeholder={language === 'ru' ? "Поиск товаров..." : "Тауарларды іздеу..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Button asChild>
                  <Link to="/admin/products/add">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'ru' ? 'Добавить товар' : 'Тауар қосу'}
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-furniture-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>{language === 'ru' ? 'Загрузка товаров...' : 'Тауарлар жүктелуде...'}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-furniture-secondary">
                    {searchQuery 
                      ? (language === 'ru' ? 'Товары не найдены' : 'Тауарлар табылмады') 
                      : (language === 'ru' ? 'Нет доступных товаров' : 'Қол жетімді тауарлар жоқ')
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-furniture-secondary uppercase tracking-wider">
                          {language === 'ru' ? 'Изображение' : 'Сурет'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-furniture-secondary uppercase tracking-wider">
                          {language === 'ru' ? 'Название' : 'Атауы'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-furniture-secondary uppercase tracking-wider">
                          {language === 'ru' ? 'Цена' : 'Бағасы'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-furniture-secondary uppercase tracking-wider">
                          {language === 'ru' ? 'Категория' : 'Санаты'}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-furniture-secondary uppercase tracking-wider">
                          {language === 'ru' ? 'Действия' : 'Әрекеттер'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={language === 'ru' ? product.name : (product.nameKz || product.name)} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                  <span className="text-gray-400 text-xs">Нет фото</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-furniture-primary">
                              {language === 'ru' ? product.name : (product.nameKz || product.name)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-furniture-secondary">
                              {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-furniture-secondary">
                              {product.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              <Link 
                                to={`/admin/products/edit/${product.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => setProductToDelete(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ru' ? 'Подтверждение удаления' : 'Жоюды растау'}
            </DialogTitle>
          </DialogHeader>
          <p>
            {language === 'ru'
              ? 'Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.'
              : 'Бұл тауарды жойғыңыз келетініне сенімдісіз бе? Бұл әрекетті болдырмау мүмкін емес.'}
          </p>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setProductToDelete(null)}
            >
              {language === 'ru' ? 'Отмена' : 'Болдырмау'}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProduct}
            >
              {language === 'ru' ? 'Удалить' : 'Жою'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminProducts;
