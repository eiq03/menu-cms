import { isAxiosError } from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteSpot } from "../hooks/use-spot"
import type { SpotDTO } from "../dtos/spot.dto"

interface SpotDeleteDialogProps {
    spot: SpotDTO | null;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export function SpotDeleteDialog({
    spot,
    onClose,
    onSuccess,
    onError
}: SpotDeleteDialogProps) {

    const deleteSpot = useDeleteSpot()

    function handleConfirm() {
        if (!spot) return

        deleteSpot.mutate(spot.id, {
            onSuccess: () => {
                onClose()
                onSuccess('Mesa excluída com sucesso.')
            },
            onError: (error) => {
                onClose()

                // 409 = backend recusou porque a mesa já tem comandas
                if (isAxiosError(error) && error.response?.status === 409) {
                    onError('Não é possível excluir: a mesa possui comandas vinculadas.')
                } else {
                    onError('Não foi possível excluir a mesa. Tente novamente.')
                }
            },
        })
    }

    return (
    <AlertDialog open={!!spot} onOpenChange={(open) => !open && onClose()}>
    <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Excluir mesa</AlertDialogTitle>
        <AlertDialogDescription>
            Tem certeza que deseja excluir a mesa "{spot?.name}"? Essa ação não pode ser desfeita.
        </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={deleteSpot.isPending}>
                Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            disabled={deleteSpot.isPending}
            onClick={handleConfirm}
            >
                {deleteSpot.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    )
}
