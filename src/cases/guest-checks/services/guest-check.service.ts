import { api } from '@/lib/axios'
import type { GuestCheckDTO, GuestCheckStatus } from '../dtos/guest-check.dto'

const ENDPOINT = '/guest-checks'

export const GuestCheckService = {
  async listAll(status?: GuestCheckStatus): Promise<GuestCheckDTO[]> {
    const result = await api.get<GuestCheckDTO[]>(ENDPOINT, { params: { status } })
    return result.data
  },

  async findOne(id: string): Promise<GuestCheckDTO> {
    const result = await api.get<GuestCheckDTO>(`${ENDPOINT}/${id}`)
    return result.data
  },
}
