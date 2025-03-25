
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Contacts = () => {
  const { language } = useLanguage();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      language === 'ru' 
        ? 'Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.'
        : 'Сіздің хабарламаңыз жіберілді! Біз сізбен жақын арада байланысамыз.'
    );
    // Reset form
    (e.target as HTMLFormElement).reset();
  };
  
  return (
    <Layout>
      <div className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                {language === 'ru' ? 'Контакты' : 'Байланыс'}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                {/* Contact details */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">
                    {language === 'ru' ? 'Наши контакты' : 'Біздің байланыстарымыз'}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="text-furniture-primary mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium mb-1">
                          {language === 'ru' ? 'Адрес' : 'Мекенжай'}
                        </h3>
                        <p className="text-furniture-secondary">
                          {language === 'ru'
                            ? 'г. Алматы, ул. Абая, 52'
                            : 'Алматы қ., Абай к-сі, 52'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="text-furniture-primary mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium mb-1">
                          {language === 'ru' ? 'Телефон' : 'Телефон'}
                        </h3>
                        <p className="text-furniture-secondary">
                          <a href="tel:+77271234567" className="hover:text-furniture-primary transition-colors">
                            +7 (727) 123-45-67
                          </a>
                        </p>
                        <p className="text-furniture-secondary">
                          <a href="tel:+77771234567" className="hover:text-furniture-primary transition-colors">
                            +7 (777) 123-45-67
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="text-furniture-primary mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium mb-1">
                          {language === 'ru' ? 'Email' : 'Email'}
                        </h3>
                        <p className="text-furniture-secondary">
                          <a href="mailto:info@promebel.shop" className="hover:text-furniture-primary transition-colors">
                            info@promebel.shop
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="text-furniture-primary mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium mb-1">
                          {language === 'ru' ? 'Режим работы' : 'Жұмыс уақыты'}
                        </h3>
                        <p className="text-furniture-secondary">
                          {language === 'ru'
                            ? 'Пн-Пт: 9:00 - 18:00'
                            : 'Дс-Жм: 9:00 - 18:00'}
                        </p>
                        <p className="text-furniture-secondary">
                          {language === 'ru'
                            ? 'Сб: 10:00 - 16:00'
                            : 'Сб: 10:00 - 16:00'}
                        </p>
                        <p className="text-furniture-secondary">
                          {language === 'ru'
                            ? 'Вс: выходной'
                            : 'Жс: демалыс'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact form */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">
                    {language === 'ru' ? 'Написать нам' : 'Бізге жазыңыз'}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-furniture-primary mb-1">
                        {language === 'ru' ? 'Имя' : 'Аты'}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-furniture-primary mb-1">
                        {language === 'ru' ? 'Email' : 'Email'}
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-furniture-primary mb-1">
                        {language === 'ru' ? 'Телефон' : 'Телефон'}
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-furniture-primary mb-1">
                        {language === 'ru' ? 'Сообщение' : 'Хабарлама'}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-furniture-primary text-white hover:bg-furniture-dark">
                      {language === 'ru' ? 'Отправить' : 'Жіберу'}
                    </Button>
                  </form>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6 text-center">
                  {language === 'ru' ? 'Мы на карте' : 'Біз картада'}
                </h2>
                
                <div className="h-96 bg-furniture-light rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.983391336785!2d76.94093271173461!3d43.241862971058094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x388369154ed9a9b3%3A0x99be7a64c717530a!2z0L_RgNC-0YHQv9C10LrRgiDQkNCx0LDRjywg0JDQu9C80LDRgtGLIDQ4MDAwMCwg0JrQsNC30LDRhdGB0YLQsNC9!5e0!3m2!1sru!2sru!4v1661163853870!5m2!1sru!2sru"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contacts;
