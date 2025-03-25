
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const { logout } = useAdmin();
  
  // Dashboard items
  const dashboardItems = [
    {
      title: language === 'ru' ? 'Управление товарами' : 'Тауарларды басқару',
      description: language === 'ru' 
        ? 'Добавление, редактирование и удаление товаров' 
        : 'Тауарларды қосу, өңдеу және жою',
      icon: <Package className="h-8 w-8 text-furniture-primary" />,
      link: '/admin/products',
    },
    {
      title: language === 'ru' ? 'Промокоды' : 'Промокодтар',
      description: language === 'ru' 
        ? 'Управление промокодами и скидками' 
        : 'Промокодтарды және жеңілдіктерді басқару',
      icon: <Tag className="h-8 w-8 text-furniture-primary" />,
      link: '/admin/promotions',
    },
    {
      title: language === 'ru' ? 'Настройки' : 'Параметрлер',
      description: language === 'ru' 
        ? 'Настройка контактной информации и реквизитов' 
        : 'Байланыс ақпараты мен деректемелерді орнату',
      icon: <Settings className="h-8 w-8 text-furniture-primary" />,
      link: '/admin/settings',
    },
  ];

  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                {language === 'ru' ? 'Панель администратора' : 'Әкімші тақтасы'}
              </h1>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Выйти' : 'Шығу'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.link}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="mb-4">{item.icon}</div>
                  <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                  <p className="text-furniture-secondary text-sm">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
