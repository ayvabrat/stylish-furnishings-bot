
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchPromoCodes } from '@/services/promotionService';

interface PromotionCode {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
}

interface PromotionContextType {
  activePromotion: PromotionCode | null;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
  calculateDiscountedAmount: (amount: number) => number;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export const usePromotion = () => {
  const context = useContext(PromotionContext);
  if (!context) {
    throw new Error('usePromotion must be used within a PromotionProvider');
  }
  return context;
};

interface PromotionProviderProps {
  children: ReactNode;
}

export const PromotionProvider: React.FC<PromotionProviderProps> = ({ children }) => {
  const [activePromotion, setActivePromotion] = useState<PromotionCode | null>(null);
  const [availablePromoCodes, setAvailablePromoCodes] = useState<PromotionCode[]>([]);

  useEffect(() => {
    const loadPromoCodes = async () => {
      try {
        const promoCodes = await fetchPromoCodes();
        setAvailablePromoCodes(promoCodes);
      } catch (error) {
        console.error('Failed to load promo codes:', error);
      }
    };
    
    loadPromoCodes();
  }, []);

  const applyPromoCode = async (code: string): Promise<boolean> => {
    const promoCode = availablePromoCodes.find(
      promo => promo.code.toLowerCase() === code.toLowerCase() && promo.isActive
    );
    
    if (promoCode) {
      setActivePromotion(promoCode);
      return true;
    }
    
    return false;
  };

  const removePromoCode = () => {
    setActivePromotion(null);
  };

  const calculateDiscountedAmount = (amount: number): number => {
    if (!activePromotion) return 0;
    return Math.round((amount * activePromotion.discountPercentage) / 100);
  };

  const value: PromotionContextType = {
    activePromotion,
    applyPromoCode,
    removePromoCode,
    calculateDiscountedAmount,
  };

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
};
