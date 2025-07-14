
import { ProductType, CategoryType } from '@/types/product';

// Categories - только сумки
export const categories: CategoryType[] = [
  {
    id: 'c1',
    name: {
      ru: 'Сумки',
      kz: 'Сөмкелер'
    },
    image: 'https://s3.iimg.su/s/13/49izzvNxfsO1twUEAxwHFpHOXaHIspDowVxnHzsr.jpg',
    slug: 'bags'
  }
];

// Products - только одна сумка
export const products: ProductType[] = [
  {
    id: 'p1',
    name: 'Сумка',
    nameKz: 'Сөмке',
    price: 2499,
    images: [
      'https://s3.iimg.su/s/13/49izzvNxfsO1twUEAxwHFpHOXaHIspDowVxnHzsr.jpg',
      'https://s3.iimg.su/s/13/l2ZuZSN26Al5BA3bkrbtLfSB31vZ9tUrkH9j54X2.jpg'
    ],
    category: 'bags',
    characteristics: {
      dimensions: '24х15х7 см',
      material: 'Полиэстер',
      color: 'Белый'
    },
    inStock: true,
    isPopular: true
  }
];

// Get products by category
export const getProductsByCategory = (categorySlug: string): ProductType[] => {
  return products.filter(product => product.category === categorySlug);
};

// Get product by ID
export const getProductById = (id: string): ProductType | undefined => {
  return products.find(product => product.id === id);
};

// Get popular products
export const getPopularProducts = (): ProductType[] => {
  return products.filter(product => product.isPopular);
};

// Get related products for a specific product
export const getRelatedProducts = (productId: string, limit: number = 4): ProductType[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, limit);
};

// Get category by slug
export const getCategoryBySlug = (slug: string): CategoryType | undefined => {
  return categories.find(category => category.slug === slug);
};
