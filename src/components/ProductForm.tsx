
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchCategories } from '@/services/productService';
import { uploadImage, addProduct, updateProduct } from '@/services/productService';
import { CategoryType } from '@/types/product';

const productSchema = z.object({
  name_ru: z.string().min(2, 'Введите название на русском'),
  name_kk: z.string().min(2, 'Введите название на казахском'),
  price: z.coerce.number().min(1, 'Введите цену'),
  description_ru: z.string().optional(),
  description_kk: z.string().optional(),
  category_id: z.string().optional(),
  is_popular: z.boolean().default(false),
});

type ProductFormProps = {
  initialData?: any;
  isEditing?: boolean;
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEditing = false }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);
  
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name_ru: initialData?.name || '',
      name_kk: initialData?.nameKz || '',
      price: initialData?.price || 0,
      description_ru: initialData?.description?.ru || '',
      description_kk: initialData?.description?.kz || '',
      category_id: initialData?.category || '',
      is_popular: initialData?.isPopular || false,
    },
  });
  
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error(language === 'ru' ? 'Ошибка при загрузке категорий' : 'Санаттарды жүктеу қатесі');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, [language]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newImages]);
      
      // Create preview URLs
      newImages.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImageUrls((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleSubmit = async (values: z.infer<typeof productSchema>) => {
    setIsSubmitting(true);
    try {
      let uploadedImageUrls = [...imageUrls];
      
      // Upload new images
      if (selectedImages.length > 0) {
        for (const image of selectedImages) {
          try {
            const imageUrl = await uploadImage(image);
            if (imageUrl) {
              uploadedImageUrls.push(imageUrl);
            }
          } catch (error) {
            console.error('Failed to upload image:', error);
            toast.error(language === 'ru' ? 'Ошибка при загрузке изображения' : 'Суретті жүктеу қатесі');
          }
        }
      }
      
      // Prepare product data
      const productData = {
        ...values,
        images: uploadedImageUrls,
      };
      
      // Save product
      if (isEditing && initialData?.id) {
        await updateProduct(initialData.id, productData);
        toast.success(language === 'ru' ? 'Товар успешно обновлен' : 'Тауар сәтті жаңартылды');
      } else {
        await addProduct(productData);
        toast.success(language === 'ru' ? 'Товар успешно добавлен' : 'Тауар сәтті қосылды');
      }
      
      // Redirect back to products list
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(language === 'ru' ? 'Ошибка при сохранении товара' : 'Тауарды сақтау қатесі');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'ru' ? 'Название (рус)' : 'Атауы (орыс)'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name_kk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'ru' ? 'Название (каз)' : 'Атауы (қазақ)'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'ru' ? 'Цена (тенге)' : 'Бағасы (теңге)'}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'ru' ? 'Категория' : 'Санаты'}</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ru' ? 'Выберите категорию' : 'Санатты таңдаңыз'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {language === 'ru' ? category.name.ru : category.name.kz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_popular"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {language === 'ru' ? 'Популярный товар' : 'Танымал тауар'}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description_ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'ru' ? 'Описание (рус)' : 'Сипаттама (орыс)'}</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description_kk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'ru' ? 'Описание (каз)' : 'Сипаттама (қазақ)'}</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>{language === 'ru' ? 'Изображения' : 'Суреттер'}</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="h-24 w-24 border border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    multiple
                  />
                  <span className="text-2xl text-gray-400">+</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            {language === 'ru' ? 'Отмена' : 'Болдырмау'}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                {language === 'ru' ? 'Сохранение...' : 'Сақтау...'}
              </>
            ) : isEditing ? (
              language === 'ru' ? 'Обновить товар' : 'Тауарды жаңарту'
            ) : (
              language === 'ru' ? 'Добавить товар' : 'Тауар қосу'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
