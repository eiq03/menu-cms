import { useNavigate } from "react-router-dom"
import { QueryState } from "@/components/query-state"
import { GuestCheckTable } from "@/cases/guest-checks/components/guest-check-table"
import { useGuestChecks } from "@/cases/guest-checks/hooks/use-guest-check"

export function GuestCheckPage() {

  const navigate = useNavigate()

  // só as comandas abertas; quem abre comanda é o backend, no primeiro pedido da mesa
  const { data: guestChecks = [], isPending, isError } = useGuestChecks('OPENED')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold uppercase">
          Comandas
        </h2>
        <p className="text-sm text-muted-foreground">
          Comandas em aberto. A lista é atualizada automaticamente a cada 10 segundos.
        </p>
      </div>

      <QueryState
        isPending={isPending}
        isError={isError}
        isEmpty={guestChecks.length === 0}
        emptyMessage="Nenhuma comanda aberta no momento."
      >
        <GuestCheckTable
          guestChecks={guestChecks}
          onOpen={(guestCheck) => navigate(`/guest-checks/${guestCheck.id}`)}
        />
      </QueryState>
    </div>
  )
}
