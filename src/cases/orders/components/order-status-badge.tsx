import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_LABELS, type OrderStatus } from "../dtos/order.dto"

// cores da paleta do tema (index.css)
const statusClasses: Record<OrderStatus, string> = {
    NEW: 'bg-chart-5 text-foreground',
    PREPARING: 'bg-primary text-primary-foreground',
    READY: 'bg-chart-4 text-white',
    DELIVERED: 'bg-brand text-brand-foreground',
}

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    return (
        <Badge className={statusClasses[status]}>
            {ORDER_STATUS_LABELS[status]}
        </Badge>
    )
}
