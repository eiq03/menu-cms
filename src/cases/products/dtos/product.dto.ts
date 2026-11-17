import type { CategoryDTO } from '@/cases/categories/dtos/category.dto'

export interface ProductDTO {
    id: string;
    name: string;
    active: boolean;
    description: string | null;
    price: string; // numeric do Postgres chega como texto (ex.: "25.90")
    picture: string | null;
    vegetarian: boolean;
    isNew: boolean;
    category: CategoryDTO | null;
}

export interface CreateProductDTO {
    name: string;
    description: string | null;
    price: number;
    categoryId: string;
    picture: string | null;
    vegetarian: boolean;
    isNew: boolean;
}

export interface UpdateProductDTO {
    name: string;
    description: string | null;
    price: number;
    categoryId?: string;
    picture: string | null;
    vegetarian: boolean;
    isNew: boolean;
    active: boolean;
}
