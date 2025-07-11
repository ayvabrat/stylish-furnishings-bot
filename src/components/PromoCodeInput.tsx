
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePromotion } from '@/contexts/PromotionContext';

const PromoCodeInput = () => {
  const { language } = useLanguage();
  const { activePromotion, applyPromoCode, removePromoCode } = usePromotion();
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error(
        language === 'ru' 
          ? 'Введите промокод' 
          : 'Промокодты енгізіңіз'
      );
      return;
    }

    setIsApplying(true);
    try {
      const success = await applyPromoCode(promoCode.trim());
      
      if (success) {
        toast.success(
          language === 'ru' 
            ? 'Промокод успешно применен!' 
            : 'Промокод сәтті қолданылды!'
        );
        setPromoCode('');
      } else {
        toast.error(
          language === 'ru' 
            ? 'Неверный или неактивный промокод' 
            : 'Жарамсыз немесе белсенді емес промокод'
        );
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast.error(
        language === 'ru' 
          ? 'Ошибка при применении промокода' 
          : 'Промокодты қолдану кезінде қате'
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromoCode = () => {
    removePromoCode();
    toast.success(
      language === 'ru' 
        ? 'Промокод удален' 
        : 'Промокод жойылды'
    );
  };

  if (activePromotion) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div>
            <div className="text-sm font-medium text-green-800">
              {language === 'ru' ? 'Промокод применен' : 'Промокод қолданылды'}
            </div>
            <div className="text-xs text-green-600">
              {activePromotion.code} (-{activePromotion.discountPercentage}%)
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemovePromoCode}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            {language === 'ru' ? 'Удалить' : 'Жою'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder={language === 'ru' ? 'Введите промокод' : 'Промокодты енгізіңіз'}
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          disabled={isApplying}
        />
        <Button
          onClick={handleApplyPromoCode}
          disabled={isApplying || !promoCode.trim()}
          variant="outline"
        >
          {isApplying 
            ? (language === 'ru' ? 'Применение...' : 'Қолдануда...')
            : (language === 'ru' ? 'Применить' : 'Қолдану')
          }
        </Button>
      </div>
    </div>
  );
};

export default PromoCodeInput;
