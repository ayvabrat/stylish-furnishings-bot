
import { supabase } from '@/integrations/supabase/client';
import { AdminSettings } from '@/types/admin';

// Default settings
const defaultSettings: AdminSettings = {
  paymentDetails: {
    bankName: 'Казкоммерцбанк',
    accountNumber: 'KZ123456789012345678',
    recipientName: 'ТОО "ProMebel"'
  },
  contactInfo: {
    phone: '+7 777 123 4567',
    email: 'info@pro-mebel.shop',
    address: 'г. Алматы, ул. Достык, 123'
  }
};

// Fetch admin settings
export const fetchAdminSettings = async (): Promise<AdminSettings> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'admin_settings')
      .single();

    if (error || !data) {
      console.log('No settings found, returning defaults');
      return defaultSettings;
    }

    try {
      return JSON.parse(data.value);
    } catch (e) {
      console.error('Error parsing admin settings:', e);
      return defaultSettings;
    }
  } catch (err) {
    console.error('Error fetching admin settings:', err);
    return defaultSettings;
  }
};

// Update admin settings
export const updateAdminSettings = async (settings: AdminSettings): Promise<boolean> => {
  console.log('Updating admin settings:', settings);
  
  try {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ 
        key: 'admin_settings',
        value: JSON.stringify(settings)
      });

    if (error) {
      console.error('Error updating admin settings:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updateAdminSettings:', err);
    return false;
  }
};
