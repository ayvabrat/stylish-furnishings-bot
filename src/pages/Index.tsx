
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import HomePromoArea from '@/components/HomePromoArea';
import { Star } from 'lucide-react';

export default function Home() {
  const { language } = useLanguage();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-furniture-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-furniture-secondary">
                  {language === 'ru' 
                    ? 'Современная мебель для вашего комфорта' 
                    : 'Сіздің жайлылығыңыз үшін заманауи жиһаз'}
                </h1>
                <p className="text-lg md:text-xl mb-4 text-gray-600">
                  {language === 'ru'
                    ? 'Создайте дом своей мечты с нашей элегантной и функциональной мебелью'
                    : 'Біздің талғампаз және функционалды жиһазымызбен өз арманыңыздағы үйді жасаңыз'}
                </p>
                <p className="text-xl md:text-2xl mb-8 italic text-furniture-primary font-medium">
                  {language === 'ru'
                    ? 'Клик - и твой интерьер преобразился'
                    : 'Бір басу - және сіздің интерьеріңіз өзгерді'}
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Button asChild size="lg" className="bg-furniture-primary hover:bg-furniture-primary/90">
                    <Link to="/catalog">
                      {language === 'ru' ? 'Смотреть каталог' : 'Каталогты қарау'}
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/about">
                      {language === 'ru' ? 'О нас' : 'Біз туралы'}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/public/lovable-uploads/92935515-9b18-4cba-8af2-aebe0e7fb2bc.png" 
                  alt={language === 'ru' ? 'Современная мебель' : 'Заманауи жиһаз'} 
                  className="w-full h-auto rounded-lg shadow-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Code Banner Section */}
      <HomePromoArea />

      {/* Interior Design Image Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-furniture-primary">
                {language === 'ru' ? 'Вдохновляйтесь стильными решениями' : 'Стильді шешімдерден шабыт алыңыз'}
              </h2>
              <div className="w-full max-w-4xl h-80 md:h-96 rounded-xl overflow-hidden shadow-lg mb-10">
                <img 
                  src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200" 
                  alt={language === 'ru' ? 'Стильный интерьер' : 'Сәнді интерьер'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-furniture-primary">
              {language === 'ru' ? 'Отзывы наших клиентов' : 'Клиенттердің пікірлері'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Мария Егорова</h3>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Январь 2025</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Перед Новым годом 2024 года мы сделали заказ на четыре кровати размером 120х200 в интернет-магазине «PRO MEBEL». 
                  Так как в наличии их не оказалось, нам пришлось ждать доставку из России через транспортную компанию.
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  После Нового года нам пришло уведомление о том, что груз в пути. 17 января 2025 года он уже был в Астане. 
                  В течение трёх недель с нами была на связи менеджер Алена. Так как мы не могли забрать кровати в пункте выдачи 
                  по улице Алаш, транспортная компания доставила их до нашей квартиры за 6300 тенге.
                </p>
                <p className="text-gray-700 text-sm mt-2 font-medium">
                  Мы очень довольны покупкой. В городе мы не смогли найти такие кровати: они полностью из дерева, а фасад из МДФ крашеный.
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Азамат Абдуллин</h3>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Март 2025</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Купили там диван, продовец молодец, диван хорошего качества, доставили быстро. 
                  Единственный минус ребята при сборке очень торопяться в итоге приезжали повторно дозакручивали спинки. 
                  А так все ок. Диван супер удобный.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
