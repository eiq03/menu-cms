import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { GuestCheckService } from '../services/guest-check.service'
import type { GuestCheckStatus } from '../dtos/guest-check.dto'

// as comandas mudam conforme os clientes pedem no menu-frontend
const REFETCH_INTERVAL = 10000

// 404 (não existe) ou 400 (id inválido): não adianta tentar de novo
function isNotFound(error: unknown) {
  return isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)
}


export function useGuestChecks(status?: GuestCheckStatus) {
  return useQuery({
    queryKey: ['guest-checks', status],
    queryFn: () => GuestCheckService.listAll(status),
    refetchInterval: REFETCH_INTERVAL,
  })
}

export function useGuestCheck(id: string) {
  return useQuery({
    queryKey: ['guest-check', id],
    queryFn: () => GuestCheckService.findOne(id),
    enabled: !!id,
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 3,
    refetchInterval: (query) => isNotFound(query.state.error) ? false : REFETCH_INTERVAL,
  })
}
