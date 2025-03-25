
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAdminSettings, updateAdminSettings } from '@/services/adminService';
import { AdminSettings } from '@/types/admin';

const AdminSettings = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchAdminSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error(language === 'ru' ? 'Ошибка при загрузке настроек' : 'Параметрлерді жүктеу қатесі');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [language]);
  
  // Handle payment details change
  const handlePaymentChange = (field: keyof AdminSettings['paymentDetails'], value: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      paymentDetails: {
        ...settings.paymentDetails,
        [field]: value
      }
    });
  };
  
  // Handle contact info change
  const handleContactChange = (field: keyof AdminSettings['contactInfo'], value: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      contactInfo: {
        ...settings.contactInfo,
        [field]: value
      }
    });
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      await updateAdminSettings(settings);
      toast.success(language === 'ru' ? 'Настройки успешно сохранены' : 'Параметрлер сәтті сақталды');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error(language === 'ru' ? 'Ошибка при сохранении настроек' : 'Параметрлерді сақтау қатесі');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="bg-white py-10 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-screen-xl mx-auto">
              <div className="p-6 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-furniture-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>{language === 'ru' ? 'Загрузка настроек...' : 'Параметрлер жүктелуде...'}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!settings) {
    return (
      <Layout>
        <div className="bg-white py-10 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-screen-xl mx-auto">
              <div className="p-6 text-center">
                <p className="text-furniture-secondary">
                  {language === 'ru' ? 'Не удалось загрузить настройки' : 'Параметрлерді жүктеу мүмкін болмады'}
                </p>
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
            {/* Header */}
            <div className="flex items-center mb-6">
              <Link to="/admin" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-furniture-secondary hover:text-furniture-primary" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">
                {language === 'ru' ? 'Настройки' : 'Параметрлер'}
              </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Payment Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ru' ? 'Реквизиты для оплаты' : 'Төлем деректемелері'}
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="bank-name" className="text-sm font-medium">
                      {language === 'ru' ? 'Название банка' : 'Банк атауы'}
                    </label>
                    <Input
                      id="bank-name"
                      value={settings.paymentDetails.bankName}
                      onChange={(e) => handlePaymentChange('bankName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="account-number" className="text-sm font-medium">
                      {language === 'ru' ? 'Номер счета / IBAN' : 'Шот нөмірі / IBAN'}
                    </label>
                    <Input
                      id="account-number"
                      value={settings.paymentDetails.accountNumber}
                      onChange={(e) => handlePaymentChange('accountNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="recipient-name" className="text-sm font-medium">
                      {language === 'ru' ? 'Получатель' : 'Алушы'}
                    </label>
                    <Input
                      id="recipient-name"
                      value={settings.paymentDetails.recipientName}
                      onChange={(e) => handlePaymentChange('recipientName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ru' ? 'Контактная информация' : 'Байланыс ақпараты'}
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      {language === 'ru' ? 'Телефон' : 'Телефон'}
                    </label>
                    <Input
                      id="phone"
                      value={settings.contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {language === 'ru' ? 'Email' : 'Email'}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      {language === 'ru' ? 'Адрес' : 'Мекенжай'}
                    </label>
                    <Textarea
                      id="address"
                      value={settings.contactInfo.address}
                      onChange={(e) => handleContactChange('address', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    {language === 'ru' ? 'Сохранение...' : 'Сақтау...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {language === 'ru' ? 'Сохранить настройки' : 'Параметрлерді сақтау'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSettings;
