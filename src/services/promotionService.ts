
import { supabase } from '@/integrations/supabase/client';
import { PromotionCode } from '@/types/admin';

// Validate promotion code
export const validatePromoCode = async (code: string): Promise<PromotionCode | null> => {
  // For the ALMATY20 promo code (hardcoded special case)
  if (code === 'ALMATY20') {
    return {
      id: 'special',
      code: 'ALMATY20',
      discountPercentage: 20,
      isActive: true
    };
  }

  // For other codes, we would check in Supabase
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'promo_codes')
    .single();

  if (error || !data) {
    console.error('Error fetching promo codes:', error);
    return null;
  }

  try {
    const promoCodes = JSON.parse(data.value);
    const promoCode = promoCodes.find((p: PromotionCode) => 
      p.code.toLowerCase() === code.toLowerCase() && p.isActive
    );
    
    return promoCode || null;
  } catch (e) {
    console.error('Error parsing promo codes:', e);
    return null;
  }
};

// Fetch all promotion codes
export const fetchPromoCodes = async (): Promise<PromotionCode[]> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'promo_codes')
    .single();

  if (error || !data) {
    // If no promo codes are set yet, return default with ALMATY20
    return [{
      id: 'special',
      code: 'ALMATY20',
      discountPercentage: 20,
      isActive: true
    }];
  }

  try {
    const promoCodes = JSON.parse(data.value);
    // Always include ALMATY20
    if (!promoCodes.some((p: PromotionCode) => p.code === 'ALMATY20')) {
      promoCodes.push({
        id: 'special',
        code: 'ALMATY20',
        discountPercentage: 20,
        isActive: true
      });
    }
    return promoCodes;
  } catch (e) {
    console.error('Error parsing promo codes:', e);
    return [{
      id: 'special',
      code: 'ALMATY20',
      discountPercentage: 20,
      isActive: true
    }];
  }
};

// Update promotion codes
export const updatePromoCodes = async (promoCodes: PromotionCode[]): Promise<boolean> => {
  // Always ensure ALMATY20 is included and active
  if (!promoCodes.some(p => p.code === 'ALMATY20')) {
    promoCodes.push({
      id: 'special',
      code: 'ALMATY20',
      discountPercentage: 20,
      isActive: true
    });
  } else {
    // Make sure ALMATY20 is active
    const almaty20Index = promoCodes.findIndex(p => p.code === 'ALMATY20');
    if (almaty20Index >= 0) {
      promoCodes[almaty20Index].isActive = true;
      promoCodes[almaty20Index].discountPercentage = 20;
    }
  }

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
};
