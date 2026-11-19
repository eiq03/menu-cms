import type { GuestCheckDTO } from '@/cases/guest-checks/dtos/guest-check.dto'
import type { ProductDTO } from '@/cases/products/dtos/product.dto'

export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'DELIVERED'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    NEW: 'Novo',
    PREPARING: 'Em preparo',
    READY: 'Pronto',
    DELIVERED: 'Entregue',
}

export interface OrderItemDTO {
    id: string;
    product: ProductDTO;
    quantity: number;
    price: string; // numeric chega como texto
    subtotal: string;
}

export interface OrderDTO {
    id: string;
    createdAt: string;
    total: string;
    status: OrderStatus;
    items: OrderItemDTO[];
    guestCheck?: Pick<GuestCheckDTO, 'id' | 'status' | 'spot'>; // só vem no GET /orders
}
