
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePromotion } from '@/contexts/PromotionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tag, X } from 'lucide-react';

const PromoCodeInput: React.FC = () => {
  const { language } = useLanguage();
  const { promoCode, discountPercentage, applyPromoCode, removePromoCode, isValidatingPromo } = usePromotion();
  const [inputCode, setInputCode] = useState('');

  const handleApplyPromo = async () => {
    if (inputCode.trim()) {
      await applyPromoCode(inputCode.trim());
    }
  };

  if (promoCode) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center">
          <Tag className="h-4 w-4 text-green-600 mr-2" />
          <div>
            <p className="font-medium text-green-700">
              {language === 'ru' ? 'Промокод применен' : 'Промокод қолданылды'}
            </p>
            <p className="text-sm text-green-600">
              {promoCode} (-{discountPercentage}%)
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={removePromoCode}
          className="text-green-700 hover:text-green-800 hover:bg-green-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Input
          placeholder={language === 'ru' ? "Введите промокод" : "Промокодты енгізіңіз"}
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleApplyPromo} 
          disabled={isValidatingPromo || !inputCode.trim()}
          className="whitespace-nowrap"
        >
          {isValidatingPromo 
            ? (language === 'ru' ? "Проверка..." : "Тексеру...") 
            : (language === 'ru' ? "Применить" : "Қолдану")
          }
        </Button>
      </div>
    </div>
  );
};

export default PromoCodeInput;
