
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

          <Button 
            type="submit" 
            className="w-full bg-furniture-primary hover:bg-furniture-primary/90 text-white" 
            disabled={submitting}
          >
            {language === 'ru' ? 'Отправить' : 'Жіберу'}
          </Button>
          
          <div className="text-xs text-gray-500 text-center space-y-2 mt-4">
            <p>
              {language === 'ru' 
                ? '*Если обнаружили ошибки на сайте или неточности, то напишите нам, отправив данную форму' 
                : '*Сайтта қателер немесе дәлсіздіктер табылса, бізге осы пішінді жіберу арқылы жазыңыз'}
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
