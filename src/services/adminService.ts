
import { supabase } from '@/integrations/supabase/client';
import { AdminSettings } from '@/types/admin';
import { toast } from 'sonner';
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils';

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
    // Try to get admin settings from localStorage first as a fallback
    const localSettings = loadFromLocalStorage<AdminSettings | null>('admin_settings', null);
    
    if (localSettings) {
      console.log('Found cached admin settings:', localSettings);
    }
    
    // Try to get settings from the database
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'admin_settings')
      .maybeSingle();

    if (error) {
      console.log('Error fetching admin settings:', error);
      // Return cached settings if available, otherwise default
      return localSettings || defaultSettings;
    }

    if (!data || !data.value) {
      console.log('No settings found in database, using cached or defaults');
      // Return cached settings if available, otherwise default
      return localSettings || defaultSettings;
    }

    try {
      const parsedSettings = JSON.parse(data.value);
      console.log('Parsed admin settings from database:', parsedSettings);
      
      // Cache the settings in localStorage
      saveToLocalStorage('admin_settings', parsedSettings);
      
      return parsedSettings;
    } catch (e) {
      console.error('Error parsing admin settings from database:', e);
      // Return cached settings if available, otherwise default
      return localSettings || defaultSettings;
    }
  } catch (err) {
    console.error('Error in fetchAdminSettings:', err);
    // Check if we have cached settings
    const localSettings = loadFromLocalStorage<AdminSettings | null>('admin_settings', null);
    if (localSettings) {
      return localSettings;
    }
    return defaultSettings;
  }
};

// Update admin settings
export const updateAdminSettings = async (settings: AdminSettings): Promise<boolean> => {
  console.log('Updating admin settings:', settings);
  
  try {
    // Cache settings in localStorage as a fallback
    saveToLocalStorage('admin_settings', settings);
    
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key: 'admin_settings',
        value: JSON.stringify(settings)
      });

    if (error) {
      console.error('Error updating admin settings in database:', error);
      toast.error('Error saving settings: ' + error.message, { duration: 3000 });
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updateAdminSettings:', err);
    return false;
  }
};
