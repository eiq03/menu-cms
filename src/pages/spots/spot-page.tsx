import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeedbackAlert } from "@/components/feedback-alert"
import { QueryState } from "@/components/query-state"
import { useFeedback } from "@/hooks/use-feedback"
import { SpotDeleteDialog } from "@/cases/spots/components/spot-delete-dialog"
import { SpotDialog } from "@/cases/spots/components/spot-dialog"
import { SpotTable } from "@/cases/spots/components/spot-table"
import type { SpotDTO } from "@/cases/spots/dtos/spot.dto"
import { useSpots } from "@/cases/spots/hooks/use-spot"

export function SpotPage() {

  const { data: spots = [], isPending, isError } = useSpots()
  const { feedback, showSuccess, showError } = useFeedback()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSpot, setSelectedSpot] = useState<SpotDTO | null>(null)
  const [spotToDelete, setSpotToDelete] = useState<SpotDTO | null>(null)

  function handleNew() {
    setSelectedSpot(null)
    setDialogOpen(true)
  }

  function handleEdit(spot: SpotDTO) {
    setSelectedSpot(spot)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold uppercase">
          Mesas
        </h2>
        <Button className="cursor-pointer" onClick={handleNew}>
          <Plus />
          Nova mesa
        </Button>
      </div>

      <FeedbackAlert feedback={feedback} />

      <QueryState
        isPending={isPending}
        isError={isError}
        isEmpty={spots.length === 0}
        emptyMessage="Nenhuma mesa cadastrada."
      >
        <SpotTable
          spots={spots}
          onEdit={handleEdit}
          onDelete={setSpotToDelete}
        />
      </QueryState>

      <SpotDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        spot={selectedSpot}
        onSuccess={showSuccess}
      />

      <SpotDeleteDialog
        spot={spotToDelete}
        onClose={() => setSpotToDelete(null)}
        onSuccess={showSuccess}
        onError={showError}
      />
    </div>
  )
}
