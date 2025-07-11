
import { PromotionCode } from '@/types/admin';

const PROMO_CODES_KEY = 'admin_promo_codes';

// Default promo codes
const defaultPromoCodes: PromotionCode[] = [
  {
    id: '1',
    code: 'ALMATY2025',
    discountPercentage: 5,
    isActive: true
  }
];

export const fetchPromoCodes = async (): Promise<PromotionCode[]> => {
  try {
    const stored = localStorage.getItem(PROMO_CODES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // If no stored promo codes, return and save defaults
    localStorage.setItem(PROMO_CODES_KEY, JSON.stringify(defaultPromoCodes));
    return defaultPromoCodes;
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return defaultPromoCodes;
  }
};

export const updatePromoCodes = async (promoCodes: PromotionCode[]): Promise<void> => {
  try {
    localStorage.setItem(PROMO_CODES_KEY, JSON.stringify(promoCodes));
  } catch (error) {
    console.error('Error updating promo codes:', error);
    throw error;
  }
};
