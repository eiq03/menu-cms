import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/cases/categories/hooks/use-category"

interface ProductCategoryFilterProps {
    value: string | null;
    onChange: (categoryId: string | null) => void;
}

export function ProductCategoryFilter({ value, onChange }: ProductCategoryFilterProps) {

    const { data: categories = [], isPending } = useCategories()

    const items = [
        { label: 'Todas as categorias', value: null },
        ...categories.map((category) => ({ label: category.name, value: category.id })),
    ]

    return (
        <Select items={items} value={value} onValueChange={(categoryId) => onChange(categoryId)}>
            <SelectTrigger className="w-64 cursor-pointer" aria-label="Filtrar por categoria">
                <SelectValue>
                    {(selected: string | null) =>
                        items.find((item) => item.value === selected)?.label
                        ?? (isPending ? 'Carregando...' : 'Categoria não encontrada')
                    }
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {items.map((item) => (
                    <SelectItem key={item.value ?? 'all'} value={item.value}>
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
