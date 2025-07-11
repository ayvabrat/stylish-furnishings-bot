
import { ProductType, CategoryType } from '@/types/product';

// Categories - только сумки
export const categories: CategoryType[] = [
  {
    id: 'c1',
    name: {
      ru: 'Сумки через плечо',
      kz: 'Иық арқылы сөмкелер'
    },
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000',
    slug: 'shoulder-bags'
  },
  {
    id: 'c2',
    name: {
      ru: 'Ручные сумки',
      kz: 'Қол сөмкелері'
    },
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000',
    slug: 'handbags'
  },
  {
    id: 'c3',
    name: {
      ru: 'Клатчи',
      kz: 'Клатчтар'
    },
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000',
    slug: 'clutches'
  },
  {
    id: 'c4',
    name: {
      ru: 'Мини-сумки',
      kz: 'Мини сөмкелер'
    },
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000',
    slug: 'mini-bags'
  }
];

// Products - только сумки
export const products: ProductType[] = [
  {
    id: 'p1',
    name: 'Сумка розовая через плечо MY Kimmy Classic',
    nameKz: 'MY Kimmy Classic қызғылт иық сөмкесі',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600'
    ],
    category: 'shoulder-bags',
    characteristics: {
      dimensions: '25x20x8 см',
      material: 'Экокожа премиум',
      color: 'Розовый'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p2',
    name: 'Элегантная ручная сумка MY Kimmy Elegant',
    nameKz: 'MY Kimmy Elegant сәнді қол сөмкесі',
    price: 5200,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600',
    ],
    category: 'handbags',
    characteristics: {
      dimensions: '30x25x12 см',
      material: 'Натуральная кожа',
      color: 'Бежевый'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p3',
    name: 'Стильный клатч MY Kimmy Evening',
    nameKz: 'MY Kimmy Evening стильді клатчы',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=600',
    ],
    category: 'clutches',
    characteristics: {
      dimensions: '22x12x4 см',
      material: 'Лакированная кожа',
      color: 'Черный'
    },
    inStock: true
  },
  {
    id: 'p4',
    name: 'Мини-сумка MY Kimmy Mini Rose',
    nameKz: 'MY Kimmy Mini Rose мини сөмкесі',
    price: 3800,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600',
    ],
    category: 'mini-bags',
    characteristics: {
      dimensions: '18x15x6 см',
      material: 'Мягкая экокожа',
      color: 'Пудровый розовый'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p5',
    name: 'Большая сумка MY Kimmy Spacious',
    nameKz: 'MY Kimmy Spacious үлкен сөмкесі',
    price: 6100,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600',
    ],
    category: 'handbags',
    characteristics: {
      dimensions: '35x28x15 см',
      material: 'Премиум экокожа',
      color: 'Коричневый'
    },
    inStock: true
  },
  {
    id: 'p6',
    name: 'Сумка-седло MY Kimmy Saddle',
    nameKz: 'MY Kimmy Saddle ер сөмкесі',
    price: 4800,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600',
    ],
    category: 'shoulder-bags',
    characteristics: {
      dimensions: '28x22x10 см',
      material: 'Текстурированная кожа',
      color: 'Песочный'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p7',
    name: 'Вечерний клатч MY Kimmy Glamour',
    nameKz: 'MY Kimmy Glamour кешкі клатчы',
    price: 4200,
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=600',
    ],
    category: 'clutches',
    characteristics: {
      dimensions: '25x15x3 см',
      material: 'Атлас с пайетками',
      color: 'Золотой'
    },
    inStock: true
  },
  {
    id: 'p8',
    name: 'Компактная сумка MY Kimmy Compact',
    nameKz: 'MY Kimmy Compact ықшам сөмкесі',
    price: 3600,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600',
    ],
    category: 'mini-bags',
    characteristics: {
      dimensions: '20x18x8 см',
      material: 'Мягкая кожа',
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
