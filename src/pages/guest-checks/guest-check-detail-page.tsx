import { isAxiosError } from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CircleAlert, MapPin } from "lucide-react"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QueryState } from "@/components/query-state"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { useGuestCheck } from "@/cases/guest-checks/hooks/use-guest-check"

export function GuestCheckDetailPage() {

  const navigate = useNavigate()
  const { id = '' } = useParams()

  const { data: guestCheck, isPending, isError, error } = useGuestCheck(id)
  const notFound = isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => navigate('/guest-checks')}>
          <ArrowLeft />
          Voltar para comandas
        </Button>
        <h2 className="text-2xl font-semibold uppercase">
          {guestCheck ? `Comanda - ${guestCheck.spot.name}` : 'Comanda'}
        </h2>
      </div>

      {notFound ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Comanda não encontrada.</AlertTitle>
        </Alert>
      ) : (
        <QueryState
          isPending={isPending}
          isError={isError}
          isEmpty={!guestCheck}
          emptyMessage="Comanda não encontrada."
        >
          {guestCheck && (
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/70 bg-card p-5 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Mesa</span>
                <span className="flex items-center gap-2 font-medium">
                  <MapPin className="size-4 text-brand" />
                  {guestCheck.spot.name}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Aberta em</span>
                <span className="font-medium">{formatDateTime(guestCheck.createdAt)}</span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm text-muted-foreground">Situação</span>
                <Badge variant={guestCheck.status === 'OPENED' ? 'default' : 'outline'}>
                  {guestCheck.status === 'OPENED' ? 'Aberta' : 'Fechada'}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Total acumulado</span>
                <span className="text-lg font-semibold">{formatCurrency(guestCheck.total)}</span>
              </div>
            </div>
          )}
        </QueryState>
      )}
    </div>
  )
}
