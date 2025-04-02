
import { supabase } from '@/integrations/supabase/client';
import { PromotionCode } from '@/types/admin';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';

// Constant for the special promo code (updated from ALMATY20 to ALMATY2025 with 5% discount)
const SPECIAL_PROMO_CODE: PromotionCode = {
  id: 'special',
  code: 'ALMATY2025',
  discountPercentage: 5,
  isActive: true
};

// Additional MEBELVAM promo codes
const MEBELVAM_PROMO_CODES: PromotionCode[] = [
  {
    id: 'mebelvam1',
    code: 'MEBELVAM1',
    discountPercentage: 10,
    isActive: true
  },
  {
    id: 'mebelvam2',
    code: 'MEBELVAM2',
    discountPercentage: 10,
    isActive: true
  },
  {
    id: 'mebelvam3',
    code: 'MEBELVAM3',
    discountPercentage: 10,
    isActive: true
  },
  {
    id: 'mebelvam4',
    code: 'MEBELVAM4',
    discountPercentage: 10,
    isActive: true
  },
  {
    id: 'mebelvam5',
    code: 'MEBELVAM5',
    discountPercentage: 10,
    isActive: true
  }
];

// Validate promotion code
export const validatePromoCode = async (code: string): Promise<PromotionCode | null> => {
  // First check in localStorage cache to reduce API calls
  const cachedCodes = loadFromLocalStorage<PromotionCode[]>('promo_codes', []);
  
  // Check for special promo code
  if (code.toUpperCase() === SPECIAL_PROMO_CODE.code) {
    return SPECIAL_PROMO_CODE;
  }
  
  // Check for MEBELVAM promo codes
  const mebelvamCode = MEBELVAM_PROMO_CODES.find(p => p.code.toUpperCase() === code.toUpperCase());
  if (mebelvamCode) {
    return mebelvamCode;
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
      
      // If no promo codes are set yet, return default codes
      const defaultCodes = [SPECIAL_PROMO_CODE, ...MEBELVAM_PROMO_CODES, ...cachedCodes];
      saveToLocalStorage('promo_codes', defaultCodes);
      return defaultCodes;
    }

    if (!data || !data.value) {
      // If no data returned, return default codes
      const defaultCodes = [SPECIAL_PROMO_CODE, ...MEBELVAM_PROMO_CODES];
      saveToLocalStorage('promo_codes', defaultCodes);
      return defaultCodes;
    }

    try {
      let promoCodes = JSON.parse(data.value);
      
      // Always include default promo codes
      const existingCodes = new Set(promoCodes.map((p: PromotionCode) => p.code));
      
      if (!existingCodes.has(SPECIAL_PROMO_CODE.code)) {
        promoCodes.push(SPECIAL_PROMO_CODE);
      } else {
        // Update ALMATY2025 promo code
        const index = promoCodes.findIndex((p: PromotionCode) => p.code === SPECIAL_PROMO_CODE.code || p.code === 'ALMATY20');
        if (index !== -1) {
          promoCodes[index] = SPECIAL_PROMO_CODE;
        }
      }
      
      // Add MEBELVAM promo codes if they don't exist
      for (const code of MEBELVAM_PROMO_CODES) {
        if (!existingCodes.has(code.code)) {
          promoCodes.push(code);
        }
      }
      
      // Update cache
      saveToLocalStorage('promo_codes', promoCodes);
      
      return promoCodes;
    } catch (e) {
      console.error('Error parsing promo codes:', e);
      
      // Return cached or default
      const defaultCodes = [SPECIAL_PROMO_CODE, ...MEBELVAM_PROMO_CODES, ...cachedCodes];
      saveToLocalStorage('promo_codes', defaultCodes);
      return defaultCodes;
    }
  } catch (err) {
    console.error('Error in fetchPromoCodes:', err);
    
    // Return cached or default
    const defaultCodes = [SPECIAL_PROMO_CODE, ...MEBELVAM_PROMO_CODES, ...cachedCodes];
    saveToLocalStorage('promo_codes', defaultCodes);
    return defaultCodes;
  }
};

// Update promotion codes
export const updatePromoCodes = async (promoCodes: PromotionCode[]): Promise<boolean> => {
  // Always ensure ALMATY2025 is included and active
  if (!promoCodes.some(p => p.code === SPECIAL_PROMO_CODE.code)) {
    promoCodes.push(SPECIAL_PROMO_CODE);
  } else {
    // Make sure ALMATY2025 is active and has correct discount
    const index = promoCodes.findIndex(p => p.code === SPECIAL_PROMO_CODE.code);
    if (index >= 0) {
      promoCodes[index].isActive = true;
      promoCodes[index].discountPercentage = SPECIAL_PROMO_CODE.discountPercentage;
    }
  }
  
  // Remove old ALMATY20 if it exists
  const almaty20Index = promoCodes.findIndex(p => p.code === 'ALMATY20');
  if (almaty20Index >= 0) {
    promoCodes.splice(almaty20Index, 1);
  }
  
  // Ensure all MEBELVAM codes are included
  for (const code of MEBELVAM_PROMO_CODES) {
    if (!promoCodes.some(p => p.code === code.code)) {
      promoCodes.push(code);
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
