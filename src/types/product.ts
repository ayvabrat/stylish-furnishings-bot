
export interface ProductType {
  id: string;
  name: string;
  nameKz?: string;
  price: number;
  images: string[];
  category: string;
  description: {
    ru: string;
    kz: string;
  };
  characteristics: {
    dimensions: string;
    material: string;
    color: string;
  };
  inStock: boolean;
  isPopular?: boolean;
}

export interface CategoryType {
  id: string;
  name: {
    ru: string;
    kz: string;
  };
  image: string;
  slug: string;
}
