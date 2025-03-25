
import { supabase } from '@/integrations/supabase/client';
import { ProductType, CategoryType } from '@/types/product';

// Fetch all products from Supabase
export const fetchProducts = async (): Promise<ProductType[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data.map(product => ({
    id: product.id,
    name: product.name_ru,
    nameKz: product.name_kk,
    price: product.price,
    images: product.images || [],
    category: product.category_id || '',
    description: {
      ru: product.description_ru || '',
      kz: product.description_kk || ''
    },
    characteristics: {
      dimensions: '',
      material: '',
      color: ''
    },
    inStock: true,
    isPopular: product.is_popular || false
  }));
};

// Fetch all categories from Supabase
export const fetchCategories = async (): Promise<CategoryType[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data.map(category => ({
    id: category.id,
    name: {
      ru: category.name_ru,
      kz: category.name_kk
    },
    image: category.image_url || '',
    slug: category.id // Using ID as slug for now
  }));
};

// Upload image to Supabase Storage
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    
    // First, check if the products bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const productsBucketExists = buckets?.some(bucket => bucket.name === 'products');
    
    if (!productsBucketExists) {
      const { error } = await supabase.storage.createBucket('products', {
        public: true
      });
      
      if (error) {
        console.error('Error creating products bucket:', error);
        throw error;
      }
    }
    
    // Upload the file
    const { error, data } = await supabase.storage
      .from('products')
      .upload(fileName, file);
      
    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
      
    return publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    return null;
  }
};

// Add new product to Supabase
export const addProduct = async (product: {
  name_ru: string;
  name_kk: string;
  price: number;
  description_ru?: string;
  description_kk?: string;
  category_id?: string;
  images: string[];
  is_popular?: boolean;
}) => {
  console.log('Adding product:', product);
  
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }

  return data;
};

// Update product in Supabase
export const updateProduct = async (id: string, updates: {
  name_ru?: string;
  name_kk?: string;
  price?: number;
  description_ru?: string;
  description_kk?: string;
  category_id?: string;
  images?: string[];
  is_popular?: boolean;
}) => {
  console.log('Updating product:', id, updates);
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data;
};

// Delete product from Supabase
export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }

  return true;
};
