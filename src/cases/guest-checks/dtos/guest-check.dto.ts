import type { OrderDTO } from '@/cases/orders/dtos/order.dto'
import type { SpotDTO } from '@/cases/spots/dtos/spot.dto'

export type GuestCheckStatus = 'OPENED' | 'CLOSED'

export interface GuestCheckDTO {
    id: string;
    createdAt: string;
    status: GuestCheckStatus;
    spot: SpotDTO;
    total: number; // calculado pelo backend (soma dos pedidos)
    orders: OrderDTO[]; // os itens só vêm no detalhe (GET /guest-checks/:id)
}
