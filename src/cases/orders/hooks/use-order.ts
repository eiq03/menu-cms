import { useMutation, useQueryClient } from '@tanstack/react-query'
import { OrderService } from '../services/order.service'
import type { OrderStatus } from '../dtos/order.dto'


export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: OrderStatus }) => OrderService.updateStatus(id, status),
    onSuccess: () => {
      // os pedidos aparecem dentro do detalhe da comanda
      queryClient.invalidateQueries({ queryKey: ['guest-check'] })
      queryClient.invalidateQueries({ queryKey: ['guest-checks'] })
    },
  })
}
