
import { ProductType, CategoryType } from '@/types/product';

// Categories - только сумки
export const categories: CategoryType[] = [
  {
    id: 'c1',
    name: {
      ru: 'Сумки',
      kz: 'Сөмкелер'
    },
    image: 'https://s3.iimg.su/s/14/Cjj6DJKqDK9j4ubDVJhofAcAalWhIJPFJAdyiLEo.jpg',
    slug: 'bags'
  }
];

// Products - только одна сумка с обновленными данными
export const products: ProductType[] = [
  {
    id: 'p1',
    name: 'Сумка',
    nameKz: 'Сөмке',
    price: 990,
    images: [
      'https://s3.iimg.su/s/07/gCocQqqxKiWqvoPEIGL4qiSmjwObnvpberW6BpKN.jpg',
      'https://s3.iimg.su/s/07/gtHDPhWxJmPulDlY2G8grid7qC5Tq9hb4gaaaegU.jpg'
    ],
    category: 'bags',
    characteristics: {
      dimensions: '24х15х7 см',
      material: 'Полиэстер',
      color: 'Белый',
      lining: 'Текстиль',
      closureType: 'Молния',
      strap: 'НеРегулируемый',
      countryOfOrigin: 'Китай'
    },
    description: {
      ru: 'Отличное дополнение к любому образу',
      kz: 'Кез келген бейнеге тамаша толықтыру'
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
