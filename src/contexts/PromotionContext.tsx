
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { validatePromoCode } from '@/services/promotionService';

interface PromotionContextType {
  promoCode: string;
  discountPercentage: number;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
  isValidatingPromo: boolean;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export const PromotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState<boolean>(false);

  // Apply promotion code
  const applyPromoCode = async (code: string): Promise<boolean> => {
    if (!code) {
      toast.error('Введите промокод');
      return false;
    }

    setIsValidatingPromo(true);
    try {
      const promoResult = await validatePromoCode(code);
      
      if (promoResult && promoResult.isActive) {
        setPromoCode(promoResult.code);
        setDiscountPercentage(promoResult.discountPercentage);
        toast.success(`Промокод ${promoResult.code} применен! Скидка ${promoResult.discountPercentage}%`);
        return true;
      } else {
        toast.error('Недействительный промокод');
        return false;
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      toast.error('Ошибка при проверке промокода');
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
        isValidatingPromo
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
