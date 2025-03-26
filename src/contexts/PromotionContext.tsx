
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { validatePromoCode } from '@/services/promotionService';
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils';

interface PromotionContextType {
  promoCode: string;
  discountPercentage: number;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
  isValidatingPromo: boolean;
  activePromotion: { code: string; discountPercentage: number } | null;
  calculateDiscountedAmount: (subtotal: number) => number;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export const PromotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Инициализация состояния из localStorage
  const [promoCode, setPromoCode] = useState<string>(() => 
    loadFromLocalStorage('promoCode', '')
  );
  
  const [discountPercentage, setDiscountPercentage] = useState<number>(() => 
    loadFromLocalStorage('discountPercentage', 0)
  );
  
  const [isValidatingPromo, setIsValidatingPromo] = useState<boolean>(false);

  // Сохранение состояния в localStorage при изменении
  useEffect(() => {
    saveToLocalStorage('promoCode', promoCode);
    saveToLocalStorage('discountPercentage', discountPercentage);
  }, [promoCode, discountPercentage]);

  // Active promotion object
  const activePromotion = promoCode ? {
    code: promoCode,
    discountPercentage: discountPercentage
  } : null;

  // Calculate discounted amount
  const calculateDiscountedAmount = (subtotal: number): number => {
    if (!activePromotion) return 0;
    return Math.round((subtotal * activePromotion.discountPercentage) / 100);
  };

  // Apply promotion code
  const applyPromoCode = async (code: string): Promise<boolean> => {
    if (!code) {
      toast.error('Введите промокод', {
        duration: 3000
      });
      return false;
    }

    setIsValidatingPromo(true);
    try {
      const promoResult = await validatePromoCode(code);
      
      if (promoResult && promoResult.isActive) {
        setPromoCode(promoResult.code);
        setDiscountPercentage(promoResult.discountPercentage);
        toast.success(`Промокод ${promoResult.code} применен! Скидка ${promoResult.discountPercentage}%`, {
          duration: 3000
        });
        return true;
      } else {
        toast.error('Недействительный промокод', {
          duration: 3000
        });
        return false;
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      toast.error('Ошибка при проверке промокода', {
        duration: 3000
      });
      return false;
    } finally {
      setIsValidatingPromo(false);
    }
  };

  // Remove promotion code
  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercentage(0);
  };

  return (
    <PromotionContext.Provider 
      value={{ 
        promoCode, 
        discountPercentage, 
        applyPromoCode, 
        removePromoCode,
        isValidatingPromo,
        activePromotion,
        calculateDiscountedAmount
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
};

// Custom hook to use promotion context
export const usePromotion = (): PromotionContextType => {
  const context = useContext(PromotionContext);
  if (context === undefined) {
    throw new Error('usePromotion must be used within a PromotionProvider');
  }
  return context;
};
