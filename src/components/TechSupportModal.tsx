
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface TechSupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TechSupportModal: React.FC<TechSupportModalProps> = ({ open, onOpenChange }) => {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [comment, setComment] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !email || !city) {
      toast.error(
        language === 'ru' 
          ? 'Пожалуйста, заполните все обязательные поля' 
          : 'Барлық міндетті өрістерді толтырыңыз',
        { duration: 3000 }
      );
      return;
    }

    setSubmitting(true);
    
    // Here you would normally send the data to your backend
    // For now, let's simulate a successful submission
    
    setTimeout(() => {
      toast.success(
        language === 'ru' 
          ? 'Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.' 
          : 'Сіздің хабарламаңыз жіберілді! Біз сізбен жақын арада байланысамыз.',
        { duration: 5000 }
      );
      
      // Reset the form
      setName('');
      setPhone('');
      setEmail('');
      setCity('');
      setComment('');
      setCaptcha('');
      setSubmitting(false);
      
      // Close the modal
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
          <button 
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-gray-200 p-1"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-base">
              {language === 'ru' ? 'Имя' : 'Аты'}*
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-base">
              {language === 'ru' ? 'Телефон' : 'Телефон'}*
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base">
              {language === 'ru' ? 'Адрес элек.почты' : 'Электрондық пошта мекенжайы'}*
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="city" className="text-base">
              {language === 'ru' ? 'Населенный пункт' : 'Елді мекен'}*
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1"
              placeholder={language === 'ru' ? 'Астана' : 'Астана'}
            />
          </div>

          <div>
            <Label htmlFor="comment" className="text-base">
              {language === 'ru' ? 'Комментарий' : 'Түсініктеме'}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="captcha" className="text-base">
              {language === 'ru' ? 'Введите число' : 'Санды енгізіңіз'}*
            </Label>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 rounded p-2 flex-shrink-0">
                <img 
                  src="data:image/png;base64,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" 
                  alt={language === 'ru' ? 'Капча' : 'Капча'} 
                  className="w-24 h-10"
                />
              </div>
              <Input
                id="captcha"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="flex-grow"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-700 hover:bg-red-800 text-white" 
            disabled={submitting}
          >
            {language === 'ru' ? 'Отправить' : 'Жіберу'}
          </Button>
          
          <div className="text-xs text-gray-500 text-center space-y-2 mt-4">
            <p>
              {language === 'ru' 
                ? '*Если обнаружили ошибки на сайте или неточности, то напишите нам, отправив данную форму или на почту support@domdivanov.kz' 
                : '*Сайтта қателер немесе дәлсіздіктер табылса, бізге осы пішінді жіберу арқылы немесе support@domdivanov.kz поштасына жазыңыз'}
            </p>
            <p>
              {language === 'ru' 
                ? '** Нажимая кнопку "Отправить", я даю согласие на обработку своих персональных данных в соответствии с ' 
                : '** "Жіберу" түймесін басу арқылы мен өзімнің жеке деректерімді өңдеуге келісім беремін '}
              <a href="#" className="underline text-blue-600">
                {language === 'ru' ? 'Условиями' : 'Шарттарға сәйкес'}
              </a>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TechSupportModal;
