import { api } from '@/lib/axios'
import type { CreateProductDTO, ProductDTO, UpdateProductDTO } from '../dtos/product.dto'

const ENDPOINT = '/products'

export const ProductService = {
  // o CMS precisa ver também os produtos inativos para poder reativá-los
  async listAll(categoryId?: string): Promise<ProductDTO[]> {
    const result = await api.get<ProductDTO[]>(ENDPOINT, {
      params: { categoryId, includeInactive: true }
    })
    return result.data
  },

  async findOne(id: string): Promise<ProductDTO> {
    const result = await api.get<ProductDTO>(`${ENDPOINT}/${id}`)
    return result.data
  },

  async create(product: CreateProductDTO): Promise<ProductDTO> {
    const result = await api.post<ProductDTO>(ENDPOINT, product)
    return result.data
  },

  async update(id: string, product: UpdateProductDTO): Promise<ProductDTO> {
    const result = await api.patch<ProductDTO>(`${ENDPOINT}/${id}`, product)
    return result.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}
