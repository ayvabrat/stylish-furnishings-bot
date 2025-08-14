
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAdmin } from '@/contexts/AdminContext';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminLogin = () => {
  const { language } = useLanguage();
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success(language === 'ru' ? 'Вход выполнен успешно' : 'Кіру сәтті орындалды');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <Lock className="h-12 w-12 mx-auto text-furniture-primary mb-4" />
              <h1 className="text-2xl md:text-3xl font-bold">
                {language === 'ru' ? 'Вход в панель администратора' : 'Әкімші панеліне кіру'}
              </h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {language === 'ru' ? 'Email' : 'Email'}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === 'ru' ? 'admin@example.com' : 'admin@example.com'}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    {language === 'ru' ? 'Пароль' : 'Құпия сөз'}
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'ru' ? 'Введите пароль' : 'Құпия сөзді енгізіңіз'}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      {language === 'ru' ? 'Вход...' : 'Кіру...'}
                    </>
                  ) : (
                    language === 'ru' ? 'Войти' : 'Кіру'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
