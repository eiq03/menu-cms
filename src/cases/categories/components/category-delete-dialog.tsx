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
import { useDeleteCategory } from "../hooks/use-categories"
import type { CategoryDTO } from "../dtos/category.dto"

interface CategoryDeleteDialogProps {
    category: CategoryDTO | null;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export function CategoryDeleteDialog({
    category,
    onClose,
    onSuccess,
    onError
}: CategoryDeleteDialogProps) {

    const deleteCategory = useDeleteCategory()

    function handleConfirm() {
        if (!category) return

        deleteCategory.mutate(category.id, {
            onSuccess: () => {
                onClose()
                onSuccess('Categoria excluída com sucesso.')
            },
            onError: (error) => {
                onClose()

                // 409 = backend recusou porque a categoria tem produtos
                if (isAxiosError(error) && error.response?.status === 409) {
                    onError('Não é possível excluir: a categoria possui produtos vinculados.')
                } else {
                    onError('Não foi possível excluir a categoria. Tente novamente.')
                }
            },
        })
    }

    return (
    <AlertDialog open={!!category} onOpenChange={(open) => !open && onClose()}>
    <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
        <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria "{category?.name}"? Essa ação não pode ser desfeita.
        </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={deleteCategory.isPending}>
                Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            disabled={deleteCategory.isPending}
            onClick={handleConfirm}
            >
                {deleteCategory.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    )
}
