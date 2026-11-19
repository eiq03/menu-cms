import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FeedbackAlert } from "@/components/feedback-alert"
import { QueryState } from "@/components/query-state"
import { useFeedback } from "@/hooks/use-feedback"
import { SHIFTS, getCurrentShift, getShiftRange, type ShiftId, type ShiftSelection } from "@/lib/shifts"
import { OrderKanbanColumn } from "@/cases/orders/components/order-kanban-column"
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/cases/orders/dtos/order.dto"
import { useOrders, useUpdateOrderStatus } from "@/cases/orders/hooks/use-order"

const statuses = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]
const shiftItems = SHIFTS.map((shift) => ({ label: shift.label, value: shift.id }))

// a data/turno escolhidos ficam guardados enquanto a aba do navegador estiver aberta
const SHIFT_STORAGE_KEY = 'kanban-shift'

export function OrderKanbanPage() {

  const [shift, setShift] = useState<ShiftSelection>(() => {
    const shiftStorage = sessionStorage.getItem(SHIFT_STORAGE_KEY)
    return shiftStorage ? JSON.parse(shiftStorage) : getCurrentShift(new Date())
  })

  function changeShift(newShift: ShiftSelection) {
    sessionStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(newShift))
    setShift(newShift)
  }

  const { data: orders = [], isPending, isError } = useOrders()
  const updateOrderStatus = useUpdateOrderStatus()
  const { feedback, showSuccess, showError } = useFeedback()

  const { start, end } = getShiftRange(shift.date, shift.shiftId)
  const savingOrder = updateOrderStatus.isPending ? updateOrderStatus.variables : undefined

  // só os pedidos feitos no turno escolhido; enquanto grava, o cartão já aparece na coluna nova
  const shiftOrders = orders
    .filter((order) => {
      const createdAt = new Date(order.createdAt)
      return createdAt >= start && createdAt < end
    })
    .map((order) => order.id === savingOrder?.id ? { ...order, status: savingOrder.status } : order)

  function handleDropOrder(orderId: string, status: OrderStatus) {
    const order = orders.find((item) => item.id === orderId)
    if (!order || order.status === status) return

    updateOrderStatus.mutate(
      { id: orderId, status },
      {
        onSuccess: () => showSuccess(`Pedido da ${order.guestCheck?.spot.name} movido para "${ORDER_STATUS_LABELS[status]}".`),
        onError: () => showError('Não foi possível alterar o status do pedido. Tente novamente.'),
      }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold uppercase">
          Kanban de Pedidos
        </h2>
        <p className="text-sm text-muted-foreground">
          Arraste os cartões entre as colunas para alterar o status. A tela é atualizada automaticamente a cada 10 segundos.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="kanban-date">Data</Label>
          <Input
            id="kanban-date"
            type="date"
            className="w-44"
            value={shift.date}
            onChange={(event) => event.target.value && changeShift({ ...shift, date: event.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Turno</Label>
          <Select
            items={shiftItems}
            value={shift.shiftId}
            onValueChange={(shiftId: ShiftId | null) => shiftId && changeShift({ ...shift, shiftId })}
          >
            <SelectTrigger className="w-48 cursor-pointer" aria-label="Turno">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {shiftItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="cursor-pointer" onClick={() => changeShift(getCurrentShift(new Date()))}>
          Turno atual
        </Button>
      </div>

      <FeedbackAlert feedback={feedback} />

      <QueryState
        isPending={isPending}
        isError={isError}
        isEmpty={false}
        emptyMessage=""
      >
        {shiftOrders.length === 0 && (
          <p className="text-muted-foreground">Nenhum pedido neste turno.</p>
        )}

        <div className="grid grid-cols-4 gap-3">
          {statuses.map((status) => (
            <OrderKanbanColumn
              key={status}
              status={status}
              orders={shiftOrders.filter((order) => order.status === status)}
              savingOrderId={savingOrder?.id}
              onDropOrder={handleDropOrder}
            />
          ))}
        </div>
      </QueryState>
    </div>
  )
}
