import { api } from '@/lib/axios'
import type { CreateSpotDTO, SpotDTO, UpdateSpotDTO } from '../dtos/spot.dto'

const ENDPOINT = '/spots'

export const SpotService = {
  async listAll(): Promise<SpotDTO[]> {
    const result = await api.get<SpotDTO[]>(ENDPOINT)
    return result.data
  },

  async findOne(id: string): Promise<SpotDTO> {
    const result = await api.get<SpotDTO>(`${ENDPOINT}/${id}`)
    return result.data
  },

  async create(spot: CreateSpotDTO): Promise<SpotDTO> {
    const result = await api.post<SpotDTO>(ENDPOINT, spot)
    return result.data
  },

  async update(id: string, spot: UpdateSpotDTO): Promise<SpotDTO> {
    const result = await api.patch<SpotDTO>(`${ENDPOINT}/${id}`, spot)
    return result.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}
