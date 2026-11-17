import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { isValidUrl } from "@/lib/validators"
import { useCreateCategory, useUpdateCategory } from "../hooks/use-category"
import type { CategoryDTO } from "../dtos/category.dto"

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: CategoryDTO | null;
    onSuccess: (message: string) => void;
}

export function CategoryDialog({
    open,
    onOpenChange,
    category,
    onSuccess
}: CategoryDialogProps) {

    function handleSaved(message: string) {
        onOpenChange(false)
        onSuccess(message)
    }

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>{category ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
        <DialogDescription>
            Preencha os dados da categoria do cardápio.
        </DialogDescription>
        </DialogHeader>

        <CategoryForm category={category} onSaved={handleSaved} />
    </DialogContent>
    </Dialog>
    )
}

interface CategoryFormProps {
    category: CategoryDTO | null;
    onSaved: (message: string) => void;
}

interface CategoryFormErrors {
    name?: string;
    icon?: string;
    displayOrder?: string;
    api?: string;
}

// fica dentro do DialogContent, então é montado de novo (limpo) a cada abertura
function CategoryForm({ category, onSaved }: CategoryFormProps) {

    const [name, setName] = useState(category?.name ?? '')
    const [icon, setIcon] = useState(category?.icon ?? '')
    const [displayOrder, setDisplayOrder] = useState(String(category?.displayOrder ?? 0))
    const [active, setActive] = useState(category?.active ?? true)
    const [errors, setErrors] = useState<CategoryFormErrors>({})

    const createCategory = useCreateCategory()
    const updateCategory = useUpdateCategory()
    const isSaving = createCategory.isPending || updateCategory.isPending

    function validate(): CategoryFormErrors {
        const formErrors: CategoryFormErrors = {}
        const order = Number(displayOrder)

        if (!name.trim()) {
            formErrors.name = 'Informe o nome da categoria.'
        } else if (name.trim().length > 60) {
            formErrors.name = 'O nome deve ter no máximo 60 caracteres.'
        }

        if (icon.trim() && !isValidUrl(icon.trim())) {
            formErrors.icon = 'Informe uma URL válida (ex.: https://site.com/icone.png).'
        }

        if (displayOrder.trim() === '' || !Number.isInteger(order) || order < 0) {
            formErrors.displayOrder = 'A ordem deve ser um número inteiro maior ou igual a 0.'
        }

        return formErrors
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formErrors = validate()
        setErrors(formErrors)
        if (Object.keys(formErrors).length > 0) return

        const data = {
            name: name.trim(),
            icon: icon.trim() || null,
            displayOrder: Number(displayOrder),
        }

        const onError = () => setErrors({ api: 'Não foi possível salvar a categoria. Tente novamente.' })

        if (category) {
            updateCategory.mutate(
                { id: category.id, category: { ...data, active } },
                { onSuccess: () => onSaved('Categoria atualizada com sucesso.'), onError }
            )
        } else {
            createCategory.mutate(
                data,
                { onSuccess: () => onSaved('Categoria cadastrada com sucesso.'), onError }
            )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-2">
                <Label htmlFor="category-name">Nome</Label>
                <Input
                id="category-name"
                value={name}
                maxLength={60}
                aria-invalid={!!errors.name}
                onChange={(event) => setName(event.target.value)}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="category-icon">Ícone (URL da imagem)</Label>
                <Input
                id="category-icon"
                type="url"
                placeholder="https://site.com/icone.png"
                value={icon}
                aria-invalid={!!errors.icon}
                onChange={(event) => setIcon(event.target.value)}
                />
                {errors.icon && <p className="text-sm text-destructive">{errors.icon}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="category-order">Ordem de exibição</Label>
                <Input
                id="category-order"
                type="number"
                min={0}
                step={1}
                value={displayOrder}
                aria-invalid={!!errors.displayOrder}
                onChange={(event) => setDisplayOrder(event.target.value)}
                />
                {errors.displayOrder && <p className="text-sm text-destructive">{errors.displayOrder}</p>}
            </div>

            {category && (
                <Label className="flex items-center gap-3">
                    <Switch checked={active} onCheckedChange={(checked) => setActive(checked)} />
                    Categoria ativa
                </Label>
            )}

            {errors.api && <p className="text-sm text-destructive">{errors.api}</p>}

            <DialogFooter>
                <DialogClose render={<Button variant="outline" type="button" className="cursor-pointer" />}>
                    Cancelar
                </DialogClose>
                <Button type="submit" className="cursor-pointer" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
            </DialogFooter>
        </form>
    )
}
