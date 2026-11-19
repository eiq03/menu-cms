import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { OrderService } from '../services/order.service'
import type { OrderStatus } from '../dtos/order.dto'


export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: OrderService.listAll,
    refetchInterval: 10000,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: OrderStatus }) => OrderService.updateStatus(id, status),
    onSuccess: () => {
      // os pedidos aparecem no kanban e dentro da comanda (lista e detalhe)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['guest-checks'] })
    },
  })
}
