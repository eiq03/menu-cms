import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeedbackAlert } from "@/components/feedback-alert"
import { QueryState } from "@/components/query-state"
import { useFeedback } from "@/hooks/use-feedback"
import { CategoryDeleteDialog } from "@/cases/categories/components/category-delete-dialog"
import { CategoryDialog } from "@/cases/categories/components/category-dialog"
import { CategoryTable } from "@/cases/categories/components/category-table"
import type { CategoryDTO } from "@/cases/categories/dtos/category.dto"
import { useCategories } from "@/cases/categories/hooks/use-categories"

export function CategoryPage() {

  const { data: categories = [], isPending, isError } = useCategories()
  const { feedback, showSuccess, showError } = useFeedback()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDTO | null>(null)

  function handleNew() {
    setSelectedCategory(null)
    setDialogOpen(true)
  }

  function handleEdit(category: CategoryDTO) {
    setSelectedCategory(category)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold uppercase">
          Categorias
        </h2>
        <Button className="cursor-pointer" onClick={handleNew}>
          <Plus />
          Nova categoria
        </Button>
      </div>

      <FeedbackAlert feedback={feedback} />

      <QueryState
        isPending={isPending}
        isError={isError}
        isEmpty={categories.length === 0}
        emptyMessage="Nenhuma categoria cadastrada."
      >
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={setCategoryToDelete}
        />
      </QueryState>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSuccess={showSuccess}
      />

      <CategoryDeleteDialog
        category={categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onSuccess={showSuccess}
        onError={showError}
      />
    </div>
  )
}
