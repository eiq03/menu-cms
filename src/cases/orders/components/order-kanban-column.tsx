import { useState, type DragEvent } from "react"
import { cn } from "cn"
import { OrderKanbanCard } from "./order-kanban-card"
import { OrderStatusBadge } from "./order-status-badge"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"

interface OrderKanbanColumnProps {
    status: OrderStatus;
    orders: OrderDTO[];
    savingOrderId?: string;
    onDropOrder: (orderId: string, status: OrderStatus) => void;
}

export function OrderKanbanColumn({
    status,
    orders,
    savingOrderId,
    onDropOrder
}: OrderKanbanColumnProps) {

    const [isOver, setIsOver] = useState(false)

    function handleDragOver(event: DragEvent<HTMLDivElement>) {
        // sem o preventDefault o navegador não deixa soltar aqui
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        setIsOver(true)
    }

    function handleDragLeave(event: DragEvent<HTMLDivElement>) {
        // ignora quando o mouse só passou para um cartão dentro da própria coluna
        if (event.currentTarget.contains(event.relatedTarget as Node)) return
        setIsOver(false)
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setIsOver(false)

        const orderId = event.dataTransfer.getData('text/plain')
        if (orderId) onDropOrder(orderId, status)
    }

    return (
        <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
            'flex min-h-64 flex-col gap-3 rounded-xl border border-border/70 bg-card p-3 transition-colors',
            isOver && 'border-[#B86A2C] bg-primary/5'
        )}
        >
            <div className="flex items-center justify-between gap-2">
                <OrderStatusBadge status={status} />
                <span className="text-sm text-muted-foreground">{orders.length}</span>
            </div>

            {orders.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">Nenhum pedido</p>
            ) : (
                orders.map((order) => (
                    <OrderKanbanCard key={order.id} order={order} isSaving={order.id === savingOrderId} />
                ))
            )}
        </div>
    )
}
