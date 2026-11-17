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
import { useDeleteProduct } from "../hooks/use-product"
import type { ProductDTO } from "../dtos/product.dto"

interface ProductDeleteDialogProps {
    product: ProductDTO | null;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export function ProductDeleteDialog({
    product,
    onClose,
    onSuccess,
    onError
}: ProductDeleteDialogProps) {

    const deleteProduct = useDeleteProduct()

    function handleConfirm() {
        if (!product) return

        deleteProduct.mutate(product.id, {
            onSuccess: () => {
                onClose()
                onSuccess('Produto excluído com sucesso.')
            },
            onError: (error) => {
                onClose()

                // 409 = backend recusou porque o produto já está em pedidos
                if (isAxiosError(error) && error.response?.status === 409) {
                    onError('Não é possível excluir: o produto já está em pedidos.')
                } else {
                    onError('Não foi possível excluir o produto. Tente novamente.')
                }
            },
        })
    }

    return (
    <AlertDialog open={!!product} onOpenChange={(open) => !open && onClose()}>
    <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Excluir produto</AlertDialogTitle>
        <AlertDialogDescription>
            Tem certeza que deseja excluir o produto "{product?.name}"? Essa ação não pode ser desfeita.
        </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={deleteProduct.isPending}>
                Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            disabled={deleteProduct.isPending}
            onClick={handleConfirm}
            >
                {deleteProduct.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    )
}
