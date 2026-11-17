export interface CategoryDTO {
    id: string;
    name: string;
    active: boolean;
    icon: string | null;
    displayOrder: number;
}

export interface CreateCategoryDTO {
    name: string;
    icon: string | null;
    displayOrder: number;
}

export interface UpdateCategoryDTO {
    name: string;
    icon: string | null;
    displayOrder: number;
    active: boolean;
}
