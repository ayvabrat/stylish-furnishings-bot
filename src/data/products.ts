
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
      'https://i.ibb.co/6Rm3mpmJ/aba5a0d0-8dc6-4e12-907c-c79b8bb39e37.jpg',
      'https://i.ibb.co/S7JXjc7n/f7fda5a4-793a-4e77-8f4e-ac0d5dceb371.jpg'
    ],
    category: 'beds',
    description: {
      ru: 'Категория: Кровати\nРазмер кровати: 2-спальные\nТип механизма кровати: Без механизма\nШирина: 175 см\nДлина: 215 см\nВысота: 90 см\nШирина спального места: 160 см\nДлина спального места: 200 см\nОсобенности кровати: Мягкое изголовье\nТип каркаса кровати: ЛДСП\nСтиль: Современный\nТип обивки: Ткань, Эко кожа, Рогожка\nСтрана: Россия\nЦвет: Розовый\nПроизводитель: Proson\nГарантия производителя: 18 месяцев\nМатрас в комплекте: Нет\nОснование в комплекте: Нет\nОсобенности: 160x200',
      kz: 'Санаты: Төсектер\nТөсек мөлшері: 2-орындық\nТөсек механизмінің түрі: Механизмсіз\nЕні: 175 см\nҰзындығы: 215 см\nБиіктігі: 90 см\nЖатын орынның ені: 160 см\nЖатын орынның ұзындығы: 200 см\nТөсектің ерекшеліктері: Жұмсақ бас жағы\nТөсек қаңқасының түрі: ЛДСП\nСтилі: Заманауи\nҚаптау түрі: Мата, Эко тері, Рогожка\nЕлі: Ресей\nТүсі: Қызғылт\nӨндіруші: Proson\nӨндірушінің кепілдігі: 18 ай\nМатрас жинақта: Жоқ\nТөсек негізі жинақта: Жоқ\nЕрекшеліктері: 160x200'
    },
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
      'public/lovable-uploads/eda46ef6-581c-4f09-ba51-9b6acbf5635a.png',
      'public/lovable-uploads/b453a213-a29a-4d82-b1e5-6a5cffdc1d08.png'
    ],
    category: 'beds',
    description: {
      ru: 'Категория: Кровати\nРазмер кровати: 2-спальные\nТип механизма кровати: Без механизма\nШирина: 175 см\nДлина: 215 см\nВысота: 90 см\nШирина спального места: 160 см\nДлина спального места: 200 см\nОсобенности кровати: Мягкое изголовье\nТип каркаса кровати: ЛДСП\nСтиль: Современный\nТип обивки: Ткань, Эко кожа, Рогожка\nСтрана: Россия\nЦвет: Розовый\nПроизводитель: Proson\nГарантия производителя: 18 месяцев\nМатрас в комплекте: Нет\nОснование в комплекте: Нет\nОсобенности: 160x200',
      kz: 'Санаты: Төсектер\nТөсек мөлшері: 2-орындық\nТөсек механизмінің түрі: Механизмсіз\nЕні: 175 см\nҰзындығы: 215 см\nБиіктігі: 90 см\nЖатын орынның ені: 160 см\nЖатын орынның ұзындығы: 200 см\nТөсектің ерекшеліктері: Жұмсақ бас жағы\nТөсек қаңқасының түрі: ЛДСП\nСтилі: Заманауи\nҚаптау түрі: Мата, Эко тері, Рогожка\nЕлі: Ресей\nТүсі: Қызғылт\nӨндіруші: Proson\nӨндірушінің кепілдігі: 18 ай\nМатрас жинақта: Жоқ\nТөсек негізі жинақта: Жоқ\nЕрекшеліктері: 160x200'
    },
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
      'public/lovable-uploads/c3dab1c5-cbb7-4d2f-ac50-b8ddd15e5179.png',
      'public/lovable-uploads/82a3dabc-dc36-4954-9491-423dfa0509f0.png'
    ],
    category: 'beds',
    description: {
      ru: 'Категория: Кровати\nВид кровати: Односпальные\nВид механизма кровати: Отсутствует\nШирина: 90 см\nДлина: 203.7 см\nВысота: 85 см\nШирина спального места: 90 см\nДлина спального места: 200 см\nКаркас кровати: ЛДСП\nСтиль: Современный\nСтрана-изготовитель: Россия\nЦвет: Бежевый, Дуб\nИзготовитель: Эра\nГарантия изготовителя: 18 месяцев\nМатрас в комплекте: Нет\nОснование в комплекте: Да\nВид основания кровати: Плоское',
      kz: 'Санаты: Төсектер\nТөсек түрі: Бір орындық\nТөсек механизмінің түрі: Жоқ\nЕні: 90 см\nҰзындығы: 203.7 см\nБиіктігі: 85 см\nЖатын орынның ені: 90 см\nЖатын орынның ұзындығы: 200 см\nТөсек қаңқасы: ЛДСП\nСтилі: Заманауи\nӨндіруші ел: Ресей\nТүсі: Бежевый, Дуб\nӨндіруші: Эра\nӨндірушінің кепілдігі: 18 ай\nМатрас жинақта: Жоқ\nТөсек негізі жинақта: Иә\nТөсек негізінің түрі: Тегіс'
    },
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
      'public/lovable-uploads/415022bf-9530-4913-9f6d-f4357eb15299.png',
      'public/lovable-uploads/f1259ffa-ecb2-432d-a8ef-e8811b3d7690.png'
    ],
    category: 'beds',
    description: {
      ru: 'Категория: Кровати\nТип кровати: 2-спальные\nМеханизм кровати: С подъемным механизмом\nШирина: 170 см\nДлина: 220 см\nВысота: 116 см\nШирина спального места: 160 см\nДлина спального места: 200 см\nОсобенности кровати: Мягкое изголовье, Место для хранения, Высокое изголовье, На ножках\nТип каркаса: ЛДСП\nСтиль: Современный\nТип обивки: Ткань, Эко кожа\nСтрана-производитель: Россия\nИзготовитель: АртСофа\nГарантия: 18 месяцев\nМатрас в комплекте: Нет\nОснование в комплекте: Да\nОснование кровати: Ортопедическое\nОсобенности: 160x200, C подъемным механизмом 160х200, 2-спальные кровати с подъемным механизмом',
      kz: 'Санаты: Төсектер\nТөсек түрі: 2-орындық\nТөсек механизмі: Көтеру механизмімен\nЕні: 170 см\nҰзындығы: 220 см\nБиіктігі: 116 см\nЖатын орынның ені: 160 см\nЖатын орынның ұзындығы: 200 см\nТөсектің ерекшеліктері: Жұмсақ бас жағы, Сақтау орны, Биік бас жағы, Аяқтарында\nҚаңқа түрі: ЛДСП\nСтилі: Заманауи\nҚаптау түрі: Мата, Эко тері\nӨндіруші ел: Ресей\nӨндіруші: АртСофа\nКепілдік: 18 ай\nМатрас жинақта: Жоқ\nТөсек негізі жинақта: Иә\nТөсек негізі: Ортопедиялық\nЕрекшеліктері: 160x200, Көтеру механизмімен 160х200, Көтеру механизмі бар 2-орындық төсектер'
    },
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
      'public/lovable-uploads/75e9da18-a3d7-43b3-bcbc-e60ba25d66d4.png',
      'public/lovable-uploads/10a7caa0-f823-48c8-bb47-44208a0fbd08.png'
    ],
    category: 'wardrobes',
    description: {
      ru: 'Категория: Шкафы в спальню\nВид шкафа: Распашной\nШирина: 82 см\nГлубина: 42 см\nВысота: 217 см\nНазначение: Для одежды\nОсобенности шкафа: На ножках, Дизайнерский, Со штангой\nЧисло дверей: Две\nРасположение: Напольный\nМатериал: ЛДСП\nПоверхность: Матовая\nСтиль: Современный, Лофт, Скандинавский\nЦвет: Коричневый, Черный, Дуб\nСтрана-производитель: Россия\nГарантия: 24 месяца\nИзготовитель: Олмеко\nОсобенности: Узкие шкафы в спальню',
      kz: 'Санаты: Жатын бөлмеге арналған шкафтар\nШкаф түрі: Ашпалы\nЕні: 82 см\nТереңдігі: 42 см\nБиіктігі: 217 см\nМақсаты: Киімге арналған\nШкаф ерекшеліктері: Аяқтарында, Дизайнерлік, Штангамен\nЕсіктер саны: Екі\nОрналасуы: Еденге қойылатын\nМатериалы: ЛДСП\nБеті: Матты\nСтилі: Заманауи, Лофт, Скандинавиялық\nТүсі: Қоңыр, Қара, Емен\nӨндіруші ел: Ресей\nКепілдік: 24 ай\nӨндіруші: Олмеко\nЕрекшеліктері: Жатын бөлмеге арналған жіңішке шкафтар'
    },
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
      'public/lovable-uploads/ee3a284e-01da-4ec7-a043-d2373c4c5b5a.png',
      'public/lovable-uploads/0a83d2cc-0eed-4dbb-8c4d-60ad6f309fa6.png'
    ],
    category: 'wardrobes',
    description: {
      ru: 'Категория: Шкафы в спальню\nВид шкафа: Распашной\nШирина: 200 см\nГлубина: 59 см\nВысота: 220.4 см\nНазначение: Для одежды\nОсобенности шкафа: С ящиками\nЧисло дверей: Четыре\nРасположение: Напольный\nМатериал: ЛДСП\nПоверхность: Матовая\nСтиль: Современный\nЦвет: Белый\nСтрана-производитель: Россия\nГарантия: 18 месяцев\nИзготовитель: Версаль\nОсобенности: Длинный шкаф в спальню',
      kz: 'Санаты: Жатын бөлмеге арналған шкафтар\nШкаф түрі: Ашпалы\nЕні: 200 см\nТереңдігі: 59 см\nБиіктігі: 220.4 см\nМақсаты: Киімге арналған\nШкаф ерекшеліктері: Жәшіктері бар\nЕсіктер саны: Төрт\nОрналасуы: Еденге қойылатын\nМатериалы: ЛДСП\nБеті: Матты\nСтилі: Заманауи\nТүсі: Ақ\nӨндіруші ел: Ресей\nКепілдік: 18 ай\nӨндіруші: Версаль\nЕрекшеліктері: Жатын бөлмеге арналған ұзын шкаф'
    },
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
      'public/lovable-uploads/a13394ee-fea9-476d-ba34-6489c2b3301b.png',
      'public/lovable-uploads/34bcc0e7-d43a-42cb-9c49-d1e4e86fe778.png'
    ],
    category: 'wardrobes',
    description: {
      ru: 'Категория: Шкафы в спальню\nВид шкафа: Распашной\nШирина: 82 см\nГлубина: 42 см\nВысота: 217 см\nНазначение: Для одежды\nОсобенности шкафа: На ножках, Дизайнерский, Со штангой\nЧисло дверей: Две\nРасположение: Напольный\nМатериал: ЛДСП\nПоверхность: Матовая\nСтиль: Современный, Лофт, Скандинавский\nЦвет: Коричневый, Черный, Дуб\nСтрана-производитель: Россия\nГарантия: 24 месяца\nИзготовитель: Олмеко\nОсобенности: Узкие шкафы в спальню',
      kz: 'Санаты: Жатын бөлмеге арналған шкафтар\nШкаф түрі: Ашпалы\nЕні: 82 см\nТереңдігі: 42 см\nБиіктігі: 217 см\nМақсаты: Киімге арналған\nШкаф ерекшеліктері: Аяқтарында, Дизайнерлік, Штангамен\nЕсіктер саны: Екі\nОрналасуы: Еденге қойылатын\nМатериалы: ЛДСП\nБеті: Матты\nСтилі: Заманауи, Лофт, Скандинавиялық\nТүсі: Қоңыр, Қара, Емен\nӨндіруші ел: Ресей\nКепілдік: 24 ай\nӨндіруші: Олмеко\nЕрекшеліктері: Жатын бөлмеге арналған жіңішке шкафтар'
    },
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
      'public/lovable-uploads/84a3be10-7520-4a73-8dc8-2574154a7ac5.png',
      'public/lovable-uploads/08922a97-3494-4b32-97fe-679995c2024f.png'
    ],
    category: 'wardrobes',
    description: {
      ru: 'Категория: Шкафы в спальню\nВид шкафа: Распашной\nШирина: 200 см\nГлубина: 59 см\nВысота: 220.4 см\nНазначение: Для одежды\nОсобенности шкафа: С ящиками\nЧисло дверей: Четыре\nРасположение: Напольный\nМатериал: ЛДСП\nПоверхность: Матовая\nСтиль: Современный\nЦвет: Белый\nСтрана-производитель: Россия\nГарантия: 18 месяцев\nИзготовитель: Версаль\nОсобенности: Длинный шкаф в спальню',
      kz: 'Санаты: Жатын бөлмеге арналған шкафтар\nШкаф түрі: Ашпалы\nЕні: 200 см\nТереңдігі: 59 см\nБиіктігі: 220.4 см\nМақсаты: Киімге арналған\nШкаф ерекшеліктері: Жәшіктері бар\nЕсіктер саны: Төрт\nОрналасуы: Еденге қойылатын\nМатериалы: ЛДСП\nБеті: Матты\nСтилі: Заманауи\nТүсі: Ақ\nӨндіруші ел: Ресей\nКепілдік: 18 ай\nӨндіруші: Версаль\nЕрекшеліктері: Жатын бөлмеге арналған ұзын шкаф'
    },
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
      'public/lovable-uploads/24c5b2fc-a25a-42aa-8c31-4b8e18603154.png',
      'public/lovable-uploads/90aa0eb9-1d54-4e88-bafe-7c0cf6845c82.png'
    ],
    category: 'wardrobes',
    description: {
      ru: 'Категория: Шкафы в спальню\nВид шкафа: Шкаф купе\nШирина: 120 см\nГлубина: 42 см\nВысота: 220 см\nНазначение: Для одежды\nОсобенности шкафа: С зеркалом\nЧисло дверей: Две\nРасположение: Напольный\nМатериал: ДСП\nПоверхность: Матовая\nСтиль: Современный\nЦвет: Белый, Серый\nСтрана-изготовитель: Россия\nГарантия изготовителя: 18 месяцев\nИзготовитель: Аллоджио\nОсобенности: Узкие шкафы в спальню',
      kz: 'Санаты: Жатын бөлмеге арналған шкафтар\nШкаф түрі: Шкаф купе\nЕні: 120 см\nТереңдігі: 42 см\nБиіктігі: 220 см\nМақсаты: Киімге арналған\nШкаф ерекшеліктері: Айнасы бар\nЕсіктер саны: Екі\nОрналасуы: Еденге қойылатын\nМатериалы: ДСП\nБеті: Матты\nСтилі: Заманауи\nТүсі: Ақ, Сұр\nӨндіруші ел: Ресей\nӨндірушінің кепілдігі: 18 ай\nӨндіруші: Аллоджио\nЕрекшеліктері: Жатын бөлмеге арналған жіңішке шкафтар'
    },
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
      'public/lovable-uploads/5b6d7aa6-9a98-48bd-b743-e4629578a2db.png'
    ],
    category: 'nightstands',
    description: {
      ru: 'Категория: Прикроватные тумбы\nКоличество ящиков: 2\nШирина: 48 см\nГлубина: 42.9 см\nВысота: 46 см\nОсобенности прикроватной тумбы: С полкой\nТип поверхности: Матовая\nМатериал: ЛДСП\nСтиль: Современный\nЦвет: Бежевый, Дуб\nПроизводитель: Олмеко\nСтрана: Россия\nС замком: Нет\nГарантия производителя: 24 месяца',
      kz: 'Санаты: Төсек жанындағы тумбалар\nЖәшіктер саны: 2\nЕні: 48 см\nТереңдігі: 42.9 см\nБиіктігі: 46 см\nТөсек жанындағы тумбаның ерекшеліктері: Сөремен\nБет түрі: Матты\nМатериалы: ЛДСП\nСтилі: Заманауи\nТүсі: Бежевый, Емен\nӨндіруші: Олмеко\nЕлі: Ресей\nҚұлыппен: Жоқ\nӨндірушінің кепілдігі: 24 ай'
    },
    characteristics: {
      dimensions: '48x42.9x46 см',
      material: 'ЛДСП',
      color: 'Бежевый, Дуб'
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
