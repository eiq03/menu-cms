import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeedbackAlert } from "@/components/feedback-alert"
import { QueryState } from "@/components/query-state"
import { useFeedback } from "@/hooks/use-feedback"
import { ProductCategoryFilter } from "@/cases/products/components/product-category-filter"
import { ProductDeleteDialog } from "@/cases/products/components/product-delete-dialog"
import { ProductDialog } from "@/cases/products/components/product-dialog"
import { ProductTable } from "@/cases/products/components/product-table"
import type { ProductDTO } from "@/cases/products/dtos/product.dto"
import { useProducts } from "@/cases/products/hooks/use-product"

export function ProductPage() {

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('categoryId') ?? undefined

  // o filtro por categoria é feito pelo backend (GET /products?categoryId=)
  const { data: products = [], isPending, isError } = useProducts(categoryId)
  const { feedback, showSuccess, showError } = useFeedback()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null)
  const [productToDelete, setProductToDelete] = useState<ProductDTO | null>(null)

  function handleFilterChange(id: string | null) {
    setSearchParams(id ? { categoryId: id } : {})
  }

  function handleNew() {
    setSelectedProduct(null)
    setDialogOpen(true)
  }

  function handleEdit(product: ProductDTO) {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold uppercase">
          Produtos
        </h2>
        <Button className="cursor-pointer" onClick={handleNew}>
          <Plus />
          Novo produto
        </Button>
      </div>

      <ProductCategoryFilter value={categoryId ?? null} onChange={handleFilterChange} />

      <FeedbackAlert feedback={feedback} />

      <QueryState
        isPending={isPending}
        isError={isError}
        isEmpty={products.length === 0}
        emptyMessage={categoryId ? 'Nenhum produto nesta categoria.' : 'Nenhum produto cadastrado.'}
      >
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={setProductToDelete}
        />
      </QueryState>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSuccess={showSuccess}
      />

      <ProductDeleteDialog
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onSuccess={showSuccess}
        onError={showError}
      />
    </div>
  )
}
