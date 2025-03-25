
import { ProductType, CategoryType } from '@/types/product';

// Categories
export const categories: CategoryType[] = [
  {
    id: 'c1',
    name: {
      ru: 'Гостиная',
      kz: 'Қонақ бөлмесі'
    },
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000',
    slug: 'living-room'
  },
  {
    id: 'c2',
    name: {
      ru: 'Спальня',
      kz: 'Жатын бөлмесі'
    },
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000',
    slug: 'bedroom'
  },
  {
    id: 'c3',
    name: {
      ru: 'Кухня',
      kz: 'Ас үй'
    },
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000',
    slug: 'kitchen'
  },
  {
    id: 'c4',
    name: {
      ru: 'Офис',
      kz: 'Кеңсе'
    },
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000',
    slug: 'office'
  },
  {
    id: 'c5',
    name: {
      ru: 'Детская',
      kz: 'Балалар'
    },
    image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=1000',
    slug: 'children'
  }
];

// Products
export const products: ProductType[] = [
  {
    id: 'p1',
    name: 'Диван "Комфорт"',
    nameKz: 'Диван "Комфорт"',
    price: 150000,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1000',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1000'
    ],
    category: 'living-room',
    description: {
      ru: 'Комфортный диван для гостиной с мягкими подушками и прочной обивкой из высококачественного текстиля. Идеально подходит для отдыха и приема гостей.',
      kz: 'Жоғары сапалы тоқымадан жасалған берік қаптамасы және жұмсақ жастықтары бар қонақ бөлмесіне арналған ыңғайлы диван. Демалу және қонақтарды қабылдау үшін өте қолайлы.'
    },
    characteristics: {
      dimensions: '220x90x85 см',
      material: 'Текстиль, дерево, поролон',
      color: 'Серый'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p2',
    name: 'Кровать "Релакс"',
    nameKz: 'Төсек "Релакс"',
    price: 120000,
    images: [
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=1000',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000'
    ],
    category: 'bedroom',
    description: {
      ru: 'Двуспальная кровать с ортопедическим матрасом и удобным изголовьем. Выполнена из экологически чистых материалов.',
      kz: 'Ортопедиялық матрас және ыңғайлы бас жағы бар екі орындық төсек. Экологиялық таза материалдардан жасалған.'
    },
    characteristics: {
      dimensions: '160x200 см',
      material: 'Дерево, текстиль',
      color: 'Бежевый'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p3',
    name: 'Кухонный гарнитур "Модерн"',
    nameKz: 'Ас үй жиһазы "Модерн"',
    price: 280000,
    images: [
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=1000',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000'
    ],
    category: 'kitchen',
    description: {
      ru: 'Современный кухонный гарнитур с глянцевыми фасадами и функциональными шкафами. Включает верхние и нижние модули, встроенную мойку.',
      kz: 'Жылтыр беттері және функционалды шкафтары бар заманауи ас үй жиһазы. Жоғарғы және төменгі модульдерді, кіріктірілген жуғышты қамтиды.'
    },
    characteristics: {
      dimensions: '260x60x220 см',
      material: 'МДФ, пластик',
      color: 'Белый/Серый'
    },
    inStock: true
  },
  {
    id: 'p4',
    name: 'Рабочий стол "Бизнес"',
    nameKz: 'Жұмыс үстелі "Бизнес"',
    price: 75000,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000',
      'https://images.unsplash.com/photo-1542330952-bffc55e812b2?q=80&w=1000'
    ],
    category: 'office',
    description: {
      ru: 'Эргономичный рабочий стол для офиса или домашнего кабинета. Оснащен выдвижными ящиками и удобной столешницей.',
      kz: 'Кеңсе немесе үй кабинеті үшін эргономикалық жұмыс үстелі. Жылжымалы жәшіктері және ыңғайлы үстелі бар.'
    },
    characteristics: {
      dimensions: '140x70x75 см',
      material: 'ЛДСП, металл',
      color: 'Дуб сонома'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p5',
    name: 'Детская кровать "Сказка"',
    nameKz: 'Балалар төсегі "Ертегі"',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1565329921943-7e537b7a2ea9?q=80&w=1000',
      'https://images.unsplash.com/photo-1617325710236-4a36d46427c5?q=80&w=1000'
    ],
    category: 'children',
    description: {
      ru: 'Уютная кровать для детской комнаты. Безопасный дизайн, выполнена из экологически чистых материалов.',
      kz: 'Балалар бөлмесіне арналған жайлы төсек. Қауіпсіз дизайн, экологиялық таза материалдардан жасалған.'
    },
    characteristics: {
      dimensions: '90x180 см',
      material: 'Дерево, МДФ',
      color: 'Белый'
    },
    inStock: true
  },
  {
    id: 'p6',
    name: 'Шкаф-купе "Престиж"',
    nameKz: 'Шкаф-купе "Престиж"',
    price: 180000,
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000',
      'https://images.unsplash.com/photo-1615874694520-474822394e73?q=80&w=1000'
    ],
    category: 'bedroom',
    description: {
      ru: 'Вместительный шкаф-купе с зеркальными дверями и продуманной системой хранения. Идеально впишется в любой интерьер спальни.',
      kz: 'Айналы есіктері және ойластырылған сақтау жүйесі бар сыйымды шкаф-купе. Жатын бөлмесінің кез келген интерьеріне керемет сәйкес келеді.'
    },
    characteristics: {
      dimensions: '200x60x220 см',
      material: 'ЛДСП, зеркало, алюминий',
      color: 'Венге'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p7',
    name: 'Стул "Классик"',
    nameKz: 'Орындық "Классик"',
    price: 15000,
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1000',
      'https://images.unsplash.com/photo-1551298370-9d3d53740c72?q=80&w=1000'
    ],
    category: 'kitchen',
    description: {
      ru: 'Элегантный стул с удобной спинкой и мягким сиденьем. Подходит для кухни, столовой или офиса.',
      kz: 'Ыңғайлы арқасы және жұмсақ отырғышы бар элегантты орындық. Ас үй, асхана немесе кеңсеге жарайды.'
    },
    characteristics: {
      dimensions: '45x45x95 см',
      material: 'Дерево, текстиль',
      color: 'Коричневый'
    },
    inStock: true
  },
  {
    id: 'p8',
    name: 'Комод "Минимал"',
    nameKz: 'Комод "Минимал"',
    price: 60000,
    images: [
      'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=1000',
      'https://images.unsplash.com/photo-1588200618450-3a5b1d3b9aa5?q=80&w=1000'
    ],
    category: 'living-room',
    description: {
      ru: 'Стильный комод в минималистичном дизайне. Имеет вместительные ящики и прочную конструкцию.',
      kz: 'Минималистік дизайндағы стильді комод. Сыйымды жәшіктері және берік құрылымы бар.'
    },
    characteristics: {
      dimensions: '120x45x80 см',
      material: 'МДФ, дерево',
      color: 'Белый'
    },
    inStock: true
  },
  {
    id: 'p9',
    name: 'Полка "Воздушная"',
    nameKz: 'Сөре "Әуе"',
    price: 25000,
    images: [
      'https://images.unsplash.com/photo-1526887593587-a307ea5d46b4?q=80&w=1000',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000'
    ],
    category: 'living-room',
    description: {
      ru: 'Настенная полка современного дизайна. Идеально подходит для размещения книг, фотографий и декоративных элементов.',
      kz: 'Заманауи дизайндағы қабырғаға ілінетін сөре. Кітаптар, фотосуреттер және сәндік элементтерді орналастыру үшін өте қолайлы.'
    },
    characteristics: {
      dimensions: '100x25x4 см',
      material: 'МДФ',
      color: 'Черный'
    },
    inStock: true
  },
  {
    id: 'p10',
    name: 'Офисное кресло "Директор"',
    nameKz: 'Кеңсе креслосы "Директор"',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=1000',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000'
    ],
    category: 'office',
    description: {
      ru: 'Эргономичное офисное кресло с регулируемой высотой и подлокотниками. Обеспечивает комфорт в течение всего рабочего дня.',
      kz: 'Биіктігі және шынтаққойғыштары реттелетін эргономикалық кеңсе креслосы. Бүкіл жұмыс күні бойы жайлылық қамтамасыз етеді.'
    },
    characteristics: {
      dimensions: '65x65x120 см',
      material: 'Экокожа, металл, пластик',
      color: 'Черный'
    },
    inStock: true,
    isPopular: true
  },
  {
    id: 'p11',
    name: 'Тумба ТВ "Медиа"',
    nameKz: 'ТВ тумбасы "Медиа"',
    price: 40000,
    images: [
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=1000',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1000'
    ],
    category: 'living-room',
    description: {
      ru: 'Компактная тумба для телевизора с местом для медиа-устройств и хранения дисков. Современный дизайн дополнит интерьер гостиной.',
      kz: 'Медиа құрылғыларына және дискілерді сақтауға арналған орны бар ықшам теледидар тумбасы. Заманауи дизайн қонақ бөлмесінің интерьерін толықтырады.'
    },
    characteristics: {
      dimensions: '160x45x50 см',
      material: 'ЛДСП, МДФ',
      color: 'Черный/Дуб'
    },
    inStock: true
  },
  {
    id: 'p12',
    name: 'Детский письменный стол "Умник"',
    nameKz: 'Балалар жазу үстелі "Ақылды"',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1539437829697-1b4ed5aebd19?q=80&w=1000',
      'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=1000'
    ],
    category: 'children',
    description: {
      ru: 'Удобный письменный стол для школьника. Имеет выдвижные ящики для хранения канцелярских принадлежностей и учебников.',
      kz: 'Оқушыға арналған ыңғайлы жазу үстелі. Кеңсе тауарлары мен оқулықтарды сақтауға арналған жылжымалы жәшіктері бар.'
    },
    characteristics: {
      dimensions: '120x60x75 см',
      material: 'ЛДСП',
      color: 'Белый/Голубой'
    },
    inStock: true
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
