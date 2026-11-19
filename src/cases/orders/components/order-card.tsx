import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { OrderStatusBadge } from "./order-status-badge"
import { OrderStatusSelect } from "./order-status-select"
import type { OrderDTO } from "../dtos/order.dto"

interface OrderCardProps {
    order: OrderDTO;
    number: number;
    onStatusSuccess: (message: string) => void;
    onStatusError: (message: string) => void;
}

export function OrderCard({
    order,
    number,
    onStatusSuccess,
    onStatusError
}: OrderCardProps) {

    return (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold">Pedido {number}</span>
                    <span className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</span>
                    <OrderStatusBadge status={order.status} />
                </div>
                <OrderStatusSelect order={order} onSuccess={onStatusSuccess} onError={onStatusError} />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-4">Produto</TableHead>
                        <TableHead className="text-center">Qtd.</TableHead>
                        <TableHead className="text-right">Preço unit.</TableHead>
                        <TableHead className="pr-4 text-right">Subtotal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {order.items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="pl-4 whitespace-normal">{item.product.name}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                            <TableCell className="pr-4 text-right">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-end gap-2 border-t border-border/70 px-4 py-3">
                <span className="text-muted-foreground">Total do pedido:</span>
                <span className="font-semibold">{formatCurrency(order.total)}</span>
            </div>
        </div>
    )
}
