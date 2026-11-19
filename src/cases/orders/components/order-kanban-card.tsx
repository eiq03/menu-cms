import type { DragEvent } from "react"
import { MapPin } from "lucide-react"
import { cn } from "cn"
import { formatCurrency, formatTime } from "@/lib/format"
import type { OrderDTO } from "../dtos/order.dto"

interface OrderKanbanCardProps {
    order: OrderDTO;
    isSaving: boolean;
}

export function OrderKanbanCard({ order, isSaving }: OrderKanbanCardProps) {

    // drag and drop nativo do HTML5: o id do pedido vai junto com o cartão arrastado
    function handleDragStart(event: DragEvent<HTMLDivElement>) {
        event.dataTransfer.setData('text/plain', order.id)
        event.dataTransfer.effectAllowed = 'move'
    }

    return (
        <div
        draggable={!isSaving}
        onDragStart={handleDragStart}
        className={cn(
            'flex cursor-grab flex-col gap-2 rounded-lg border border-border/70 bg-popover p-3 text-sm shadow-xs active:cursor-grabbing',
            isSaving && 'cursor-wait opacity-60'
        )}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 font-semibold">
                    <MapPin className="size-4 text-brand" />
                    {order.guestCheck?.spot.name}
                </span>
                <span className="text-xs text-muted-foreground">{formatTime(order.createdAt)}</span>
            </div>

            <ul className="flex flex-col gap-0.5">
                {order.items.map((item) => (
                    <li key={item.id}>
                        {item.quantity}x {item.product.name}
                    </li>
                ))}
            </ul>

            <span className="text-right font-medium">{formatCurrency(order.total)}</span>
        </div>
    )
}
