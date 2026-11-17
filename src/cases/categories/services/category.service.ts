import { api } from '@/lib/axios'
import type { CategoryDTO, CreateCategoryDTO, UpdateCategoryDTO } from '../dtos/category.dto'

const ENDPOINT = '/categories'

export const CategoryService = {
  async listAll(): Promise<CategoryDTO[]> {
    const result = await api.get<CategoryDTO[]>(ENDPOINT)
    return result.data
  },

  async findOne(id: string): Promise<CategoryDTO> {
    const result = await api.get<CategoryDTO>(`${ENDPOINT}/${id}`)
    return result.data
  },

  async create(category: CreateCategoryDTO): Promise<CategoryDTO> {
    const result = await api.post<CategoryDTO>(ENDPOINT, category)
    return result.data
  },

  async update(id: string, category: UpdateCategoryDTO): Promise<CategoryDTO> {
    const result = await api.patch<CategoryDTO>(`${ENDPOINT}/${id}`, category)
    return result.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}
