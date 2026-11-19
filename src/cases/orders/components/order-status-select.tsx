import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateOrderStatus } from "../hooks/use-order"
import { ORDER_STATUS_LABELS, type OrderDTO, type OrderStatus } from "../dtos/order.dto"

const statusItems = (Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => ({
    label: ORDER_STATUS_LABELS[status],
    value: status,
}))

interface OrderStatusSelectProps {
    order: OrderDTO;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export function OrderStatusSelect({ order, onSuccess, onError }: OrderStatusSelectProps) {

    const updateOrderStatus = useUpdateOrderStatus()

    function handleChange(status: OrderStatus | null) {
        if (!status || status === order.status) return

        updateOrderStatus.mutate(
            { id: order.id, status },
            {
                onSuccess: () => onSuccess(`Status do pedido alterado para "${ORDER_STATUS_LABELS[status]}".`),
                onError: () => onError('Não foi possível alterar o status do pedido. Tente novamente.'),
            }
        )
    }

    return (
        <Select
        items={statusItems}
        value={order.status}
        onValueChange={handleChange}
        disabled={updateOrderStatus.isPending}
        >
            <SelectTrigger size="sm" className="w-36 cursor-pointer" aria-label="Alterar status do pedido">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {statusItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
