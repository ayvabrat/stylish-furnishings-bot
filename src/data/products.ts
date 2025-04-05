
import { ProductType, CategoryType } from '@/types/product';

// Categories
export const categories: CategoryType[] = [
  {
    id: 'c1',
    name: {
      ru: 'Кровати',
      kz: 'Төсектер'
    },
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000',
    slug: 'beds'
  },
  {
    id: 'c2',
    name: {
      ru: 'Шкафы',
      kz: 'Шкафтар'
    },
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000',
    slug: 'wardrobes'
  },
  {
    id: 'c3',
    name: {
      ru: 'Тумбы',
      kz: 'Тумбалар'
    },
    image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?q=80&w=1000',
    slug: 'nightstands'
  },
  {
    id: 'c4',
    name: {
      ru: 'Комоды',
      kz: 'Комодтар'
    },
    image: 'https://images.unsplash.com/photo-1573866926487-a1865558a9cf?q=80&w=1000',
    slug: 'dressers'
  }
];

// Products
export const products: ProductType[] = [
  {
    id: 'p1',
    name: 'Кровать Varna Grand 160х200, Рогожка (Savana Berry)',
    nameKz: 'Кровать Varna Grand 160х200, Рогожка (Savana Berry)',
    price: 145000,
    images: [
      'https://cdn.domdivanov.kz/files/imgs/ig1111928/dvuspalnaya-krovat-varna-grand-160h200-rogozhka-savana-berry-fioletovyi-590x430.jpg',
      'https://cdn.domdivanov.kz/files/imgs/ig1111928/dvuspalnaya-krovat-varna-grand-160h200-rogozhka-savana-berry-fioletovyi-2000x1460.png'
    ],
    category: 'beds',
    characteristics: {
      dimensions: '175x215x90 см',
      material: 'ЛДСП, Рогожка',
      color: 'Фиолетовый (Savana Berry)'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p2',
    name: 'Кровать 2-спальная Вероника-3 (Слоновая кость) 160х200',
    nameKz: 'Кровать 2-спальная Вероника-3 (Слоновая кость) 160х200',
    price: 90000,
    images: [
      'https://cdn.domdivanov.kz/files/imgs/ig1111928/dvuspalnaya-krovat-veronika-3-slonovaya-kost-160h200-4-590x430.jpg',
    ],
    category: 'beds',
    characteristics: {
      dimensions: '175x215x90 см',
      material: 'ЛДСП',
      color: 'Слоновая кость'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p3',
    name: 'Спальная кровать Эко 900 ЛДСП, Дуб вотан/Белый',
    nameKz: 'Спальная кровать Эко 900 ЛДСП, Дуб вотан/Белый',
    price: 52000,
    images: [
      'https://cdn.domdivanov.kz/files/imgs/ig1111928/odnospalnaya-krovat-eko-900-ldsp-dub-votanbelyi-590x430.png',
      'https://cdn.domdivanov.kz/files/imgs/ig1111928/odnospalnaya-krovat-eko-900-ldsp-yasen-shimo-temnyisvetlyi-2000x1460.png'
    ],
    category: 'beds',
    characteristics: {
      dimensions: '90x203.7x85 см',
      material: 'ЛДСП',
      color: 'Дуб вотан/Белый'
    },
    inStock: true
  },
  {
    id: 'p4',
    name: 'Двуспальная кровать с подъемным механизмом Модерн-3 (160)',
    nameKz: 'Двуспальная кровать с подъемным механизмом Модерн-3 (160)',
    price: 266000,
    images: [
      'https://cdn.domdivanov.kz/files/imgs/ig1111928/krovat-v-spalnu-modern-3-160-590x430.jpg',
      'https://cdn.domdivanov.kz/files/imgs/ig1111928/krovat-v-spalnu-modern-3-160-1-2000x1460.jpg'
    ],
    category: 'beds',
    characteristics: {
      dimensions: '170x220x116 см',
      material: 'ЛДСП, Ткань, Эко-кожа',
      color: 'Серый'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p5',
    name: 'Шкаф Конго, 2-х створчатый (Венге/Выбеленное дерево)',
    nameKz: 'Шкаф Конго, 2-х створчатый (Венге/Выбеленное дерево)',
    price: 99000,
    images: [
      'https://cdn.domdivanov.kz/files/imgs/ig1817754/shkaf-raspashnoi-kongo-2-h-stvorchatyi-vengevybelennoe-derevo-590x430.png',
      'https://cdn.domdivanov.kz/files/imgs/ig1817754/shkaf-raspashnoi-kongo-2-h-stvorchatyi-vengevybelennoe-derevo-2-2000x1460.png'
    ],
    category: 'wardrobes',
    characteristics: {
      dimensions: '82x42x217 см',
      material: 'ЛДСП',
      color: 'Венге/Выбеленное дерево'
    },
    inStock: true
  },
  {
    id: 'p6',
    name: 'Шкаф четырехдверный Элика',
    nameKz: 'Шкаф четырехдверный Элика',
    price: 276000,
    images: [
      'https://cdn.domdivanov.kz/files/imgs/ig1817754/shkaf-4-dvernyi-elika-590x430.png',
      'https://cdn.domdivanov.kz/files/imgs/ig1817754/shkaf-4-dvernyi-elika-2000x1460.jpg'
    ],
    category: 'wardrobes',
    characteristics: {
      dimensions: '200x59x220.4 см',
      material: 'ЛДСП',
      color: 'Белый'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p7',
    name: 'Шкаф для одежды Либерти 51.01 (H-150)',
    nameKz: 'Шкаф для одежды Либерти 51.01 (H-150)',
    price: 87000,
    images: [
      'https://s.iimg.su/s/05/QmprnNaowJA5HICRAXhXzEtKnlJ3faODT95tHk8n.jpg',
      'https://s.iimg.su/s/05/KTpudUUJJ3MWWCpKeE8erlmtUvqYCeVwd7kr3NrP.jpg'
    ],
    category: 'wardrobes',
    characteristics: {
      dimensions: '82x42x217 см',
      material: 'ЛДСП',
      color: 'Коричневый/Черный/Дуб'
    },
    inStock: true
  },
  {
    id: 'p8',
    name: 'Шкаф распашной 4-х дверный Вега с 2 ящиками',
    nameKz: 'Шкаф распашной 4-х дверный Вега с 2 ящиками',
    price: 200000,
    images: [
      'https://s.iimg.su/s/05/EzwqqF14rWjOl5GPmRtCBXOMtT1UpwfDFKibhspi.jpg',
      'https://s.iimg.su/s/05/6831vPYMot51Vbv5tFrlZMnZp6NaWf8cWM2e5YJW.jpg'
    ],
    category: 'wardrobes',
    characteristics: {
      dimensions: '200x59x220.4 см',
      material: 'ЛДСП',
      color: 'Белый'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p9',
    name: 'Шкаф 2-х створчатый 2200х1200х420 с одним зеркалом ХИТ 22-4-12/2-15 Белая шагрень',
    nameKz: 'Шкаф 2-х створчатый 2200х1200х420 с одним зеркалом ХИТ 22-4-12/2-15 Белая шагрень',
    price: 111000,
    images: [
      'https://s.iimg.su/s/05/Pya3nqC2uneC6ZOW1xZlZi8ibs7MrdZ3EGJATT19.jpg',
      'https://s.iimg.su/s/05/gwdGSY4xvf1a60GcXsXlraTNnW9fTGx3ZaSBB1Dc.jpg'
    ],
    category: 'wardrobes',
    characteristics: {
      dimensions: '120x42x220 см',
      material: 'ДСП',
      color: 'Белая шагрень'
    },
    inStock: true
  },
  {
    id: 'p10',
    name: 'Прикроватная тумба 51.17 Либерти H-20',
    nameKz: 'Прикроватная тумба 51.17 Либерти H-20',
    price: 35000,
    images: [
      'https://s.iimg.su/s/05/c6fYhhS7qtvBruKIJ11u1rdlTsgdjW3CcqGxcH0J.jpg'
    ],
    category: 'nightstands',
    characteristics: {
      dimensions: '48x42.9x46 см',
      material: 'ЛДСП',
      color: 'Бежевый, Дуб'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p11',
    name: 'Тумбочка прикроватная Айла ЛД 688.030.000, Белый/Статуарио, исполнение 1',
    nameKz: 'Тумбочка прикроватная Айла ЛД 688.030.000, Белый/Статуарио, исполнение 1',
    price: 48000,
    images: [
      'https://i.postimg.cc/xTyXr8c8/4.webp'
    ],
    category: 'nightstands',
    characteristics: {
      dimensions: '50.1x36.6x36.9 см',
      material: 'ЛДСП, МДФ',
      color: 'Белый/Статуарио'
    },
    inStock: true
  },
  {
    id: 'p12',
    name: 'Прикроватная тумба Глэдис М30 (Шимо светлый/Белый текстурный)',
    nameKz: 'Прикроватная тумба Глэдис М30 (Шимо светлый/Белый текстурный)',
    price: 32000,
    images: [
      'https://s.iimg.su/s/05/JShiJU8W22P7NXqYGBi4WLGz6OPewbAEuflvS1HO.jpg'
    ],
    category: 'nightstands',
    characteristics: {
      dimensions: '47.5x34.8x40.5 см',
      material: 'ЛДСП, МДФ',
      color: 'Шимо светлый/Белый текстурный'
    },
    inStock: true
  },
  {
    id: 'p13',
    name: 'Прикроватная тумбочка Вилладжио 680.130 в Астане',
    nameKz: 'Прикроватная тумбочка Вилладжио 680.130 в Астане',
    price: 75000,
    images: [
      'https://i.postimg.cc/DyKSYLfR/3.webp'
    ],
    category: 'nightstands',
    characteristics: {
      dimensions: '47.6x38.2x52 см',
      material: 'ЛДСП, Фасад МДФ',
      color: 'Белый'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p14',
    name: 'Комод с 6 ящиками Leset Кассио (Серый) в Астане',
    nameKz: 'Комод с 6 ящиками Leset Кассио (Серый) в Астане',
    price: 62000,
    images: [
      'https://i.postimg.cc/ht2hjY8q/21.webp',
      'https://i.postimg.cc/K8GRmbMN/2.webp'
    ],
    category: 'dressers',
    characteristics: {
      dimensions: '101x35x72.5 см',
      material: 'МДФ, металл, картон',
      color: 'Серый'
    },
    inStock: true
  },
  {
    id: 'p15',
    name: 'Комод в спальню с 7 ящиками Leset Ноа в Астане',
    nameKz: 'Комод в спальню с 7 ящиками Leset Ноа в Астане',
    price: 50000,
    images: [
      'https://i.postimg.cc/74sgqWQQ/1.webp'
    ],
    category: 'dressers',
    characteristics: {
      dimensions: '80x29x79 см',
      material: 'МДФ, металл, пластик',
      color: 'Серый'
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
