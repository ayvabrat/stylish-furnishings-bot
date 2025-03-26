
import { supabase } from '@/integrations/supabase/client';
import { PromotionCode } from '@/types/admin';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';

// Constant for the special ALMATY20 promo code
const SPECIAL_PROMO_CODE: PromotionCode = {
  id: 'special',
  code: 'ALMATY20',
  discountPercentage: 20,
  isActive: true
};

// Validate promotion code
export const validatePromoCode = async (code: string): Promise<PromotionCode | null> => {
  // First check in localStorage cache to reduce API calls
  const cachedCodes = loadFromLocalStorage<PromotionCode[]>('promo_codes', []);
  
  // Prioritize ALMATY20 special promo code
  if (code.toUpperCase() === 'ALMATY20') {
    return SPECIAL_PROMO_CODE;
  }
  
  // Check if code exists in cache
  const cachedCode = cachedCodes.find(p => p.code.toLowerCase() === code.toLowerCase() && p.isActive);
  if (cachedCode) {
    console.log('Found promo code in cache:', cachedCode);
    return cachedCode;
  }

  try {
    // If not in cache, check in Supabase
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'promo_codes')
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching promo codes:', error);
      return null;
    }

    try {
      const promoCodes = JSON.parse(data.value);
      
      // Update cache
      saveToLocalStorage('promo_codes', promoCodes);
      
      const promoCode = promoCodes.find((p: PromotionCode) => 
        p.code.toLowerCase() === code.toLowerCase() && p.isActive
      );
      
      return promoCode || null;
    } catch (e) {
      console.error('Error parsing promo codes:', e);
      return null;
    }
  } catch (err) {
    console.error('Error in validatePromoCode:', err);
    return null;
  }
};

// Fetch all promotion codes
export const fetchPromoCodes = async (): Promise<PromotionCode[]> => {
  // First try to get from localStorage
  const cachedCodes = loadFromLocalStorage<PromotionCode[]>('promo_codes', []);
  
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'promo_codes')
      .maybeSingle();

    if (error) {
      console.error('Error fetching promo codes:', error);
      
      // If no promo codes are set yet, return default with ALMATY20
      if (!cachedCodes.some(p => p.code === 'ALMATY20')) {
        const codes = [SPECIAL_PROMO_CODE, ...cachedCodes];
        saveToLocalStorage('promo_codes', codes);
        return codes;
      }
      return cachedCodes;
    }

    if (!data || !data.value) {
      // If no data returned, return default with ALMATY20
      const codes = [SPECIAL_PROMO_CODE];
      saveToLocalStorage('promo_codes', codes);
      return codes;
    }

    try {
      let promoCodes = JSON.parse(data.value);
      
      // Always include ALMATY20
      if (!promoCodes.some((p: PromotionCode) => p.code === 'ALMATY20')) {
        promoCodes = [SPECIAL_PROMO_CODE, ...promoCodes];
      }
      
      // Update cache
      saveToLocalStorage('promo_codes', promoCodes);
      
      return promoCodes;
    } catch (e) {
      console.error('Error parsing promo codes:', e);
      
      // Return cached or default
      if (cachedCodes.length > 0) {
        if (!cachedCodes.some(p => p.code === 'ALMATY20')) {
          const codes = [SPECIAL_PROMO_CODE, ...cachedCodes];
          saveToLocalStorage('promo_codes', codes);
          return codes;
        }
        return cachedCodes;
      }
      
      return [SPECIAL_PROMO_CODE];
    }
  } catch (err) {
    console.error('Error in fetchPromoCodes:', err);
    
    // Return cached or default
    if (cachedCodes.length > 0) {
      if (!cachedCodes.some(p => p.code === 'ALMATY20')) {
        const codes = [SPECIAL_PROMO_CODE, ...cachedCodes];
        saveToLocalStorage('promo_codes', codes);
        return codes;
      }
      return cachedCodes;
    }
    
    return [SPECIAL_PROMO_CODE];
  }
};

// Update promotion codes
export const updatePromoCodes = async (promoCodes: PromotionCode[]): Promise<boolean> => {
  // Always ensure ALMATY20 is included and active
  if (!promoCodes.some(p => p.code === 'ALMATY20')) {
    promoCodes.push(SPECIAL_PROMO_CODE);
  } else {
    // Make sure ALMATY20 is active
    const almaty20Index = promoCodes.findIndex(p => p.code === 'ALMATY20');
    if (almaty20Index >= 0) {
      promoCodes[almaty20Index].isActive = true;
      promoCodes[almaty20Index].discountPercentage = 20;
    }
  }

  // Update cache first
  saveToLocalStorage('promo_codes', promoCodes);

  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key: 'promo_codes',
        value: JSON.stringify(promoCodes)
      });

    if (error) {
      console.error('Error updating promo codes:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updatePromoCodes:', err);
    return false;
  }
};
