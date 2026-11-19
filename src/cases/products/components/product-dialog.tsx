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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { isValidUrl } from "@/lib/validators"
import { useCategories } from "@/cases/categories/hooks/use-categories"
import { useCreateProduct, useUpdateProduct } from "../hooks/use-product"
import type { ProductDTO, UpdateProductDTO } from "../dtos/product.dto"

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: ProductDTO | null;
    onSuccess: (message: string) => void;
}

export function ProductDialog({
    open,
    onOpenChange,
    product,
    onSuccess
}: ProductDialogProps) {

    function handleSaved(message: string) {
        onOpenChange(false)
        onSuccess(message)
    }

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
        <DialogTitle>{product ? 'Editar produto' : 'Novo produto'}</DialogTitle>
        <DialogDescription>
            Preencha os dados do produto do cardápio.
        </DialogDescription>
        </DialogHeader>

        <ProductForm product={product} onSaved={handleSaved} />
    </DialogContent>
    </Dialog>
    )
}

interface ProductFormProps {
    product: ProductDTO | null;
    onSaved: (message: string) => void;
}

interface ProductFormErrors {
    name?: string;
    price?: string;
    categoryId?: string;
    picture?: string;
    api?: string;
}

// fica dentro do DialogContent, então é montado de novo (limpo) a cada abertura
function ProductForm({ product, onSaved }: ProductFormProps) {

    const [name, setName] = useState(product?.name ?? '')
    const [description, setDescription] = useState(product?.description ?? '')
    const [price, setPrice] = useState(product?.price ?? '')
    const [categoryId, setCategoryId] = useState<string | null>(product?.category?.id ?? null)
    const [picture, setPicture] = useState(product?.picture ?? '')
    const [vegetarian, setVegetarian] = useState(product?.vegetarian ?? false)
    const [isNew, setIsNew] = useState(product?.isNew ?? false)
    const [active, setActive] = useState(product?.active ?? true)
    const [errors, setErrors] = useState<ProductFormErrors>({})

    const { data: categories = [] } = useCategories()
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()
    const isSaving = createProduct.isPending || updateProduct.isPending

    // o backend só aceita categoria ativa; a atual entra na lista mesmo inativa para aparecer no select
    const categoryItems = categories
        .filter((category) => category.active || category.id === product?.category?.id)
        .map((category) => ({
            label: category.active ? category.name : `${category.name} (inativa)`,
            value: category.id,
        }))

    function validate(): ProductFormErrors {
        const formErrors: ProductFormErrors = {}
        const normalizedPrice = price.trim().replace(',', '.')

        if (!name.trim()) {
            formErrors.name = 'Informe o nome do produto.'
        } else if (name.trim().length > 60) {
            formErrors.name = 'O nome deve ter no máximo 60 caracteres.'
        }

        if (!/^\d+(\.\d{1,2})?$/.test(normalizedPrice) || Number(normalizedPrice) <= 0) {
            formErrors.price = 'Informe um preço maior que zero, com até 2 casas decimais.'
        }

        if (!categoryId) {
            formErrors.categoryId = 'Selecione a categoria.'
        }

        if (picture.trim() && !isValidUrl(picture.trim())) {
            formErrors.picture = 'Informe uma URL válida (ex.: https://site.com/imagem.png).'
        }

        return formErrors
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formErrors = validate()
        setErrors(formErrors)
        if (Object.keys(formErrors).length > 0 || !categoryId) return

        const data = {
            name: name.trim(),
            description: description.trim() || null,
            price: Number(price.trim().replace(',', '.')),
            picture: picture.trim() || null,
            vegetarian,
            isNew,
        }

        const onError = () => setErrors({ api: 'Não foi possível salvar o produto. Tente novamente.' })

        if (product) {
            const productData: UpdateProductDTO = { ...data, active }

            // só manda a categoria se mudou (a atual pode estar inativa)
            if (categoryId !== product.category?.id) {
                productData.categoryId = categoryId
            }

            updateProduct.mutate(
                { id: product.id, product: productData },
                { onSuccess: () => onSaved('Produto atualizado com sucesso.'), onError }
            )
        } else {
            createProduct.mutate(
                { ...data, categoryId },
                { onSuccess: () => onSaved('Produto cadastrado com sucesso.'), onError }
            )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-2">
                <Label htmlFor="product-name">Nome</Label>
                <Input
                id="product-name"
                value={name}
                maxLength={60}
                aria-invalid={!!errors.name}
                onChange={(event) => setName(event.target.value)}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="product-description">Descrição</Label>
                <Textarea
                id="product-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="product-price">Preço (R$)</Label>
                    <Input
                    id="product-price"
                    type="number"
                    min={0.01}
                    step={0.01}
                    placeholder="0,00"
                    value={price}
                    aria-invalid={!!errors.price}
                    onChange={(event) => setPrice(event.target.value)}
                    />
                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Categoria</Label>
                    <Select items={categoryItems} value={categoryId} onValueChange={(value) => setCategoryId(value)}>
                        <SelectTrigger className="w-full cursor-pointer" aria-invalid={!!errors.categoryId}>
                            <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            {categoryItems.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="product-picture">Imagem (URL)</Label>
                <Input
                id="product-picture"
                type="url"
                placeholder="https://site.com/imagem.png"
                value={picture}
                aria-invalid={!!errors.picture}
                onChange={(event) => setPicture(event.target.value)}
                />
                {errors.picture && <p className="text-sm text-destructive">{errors.picture}</p>}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
                <Label className="flex items-center gap-3">
                    <Switch checked={vegetarian} onCheckedChange={(checked) => setVegetarian(checked)} />
                    Vegetariano
                </Label>

                <Label className="flex items-center gap-3">
                    <Switch checked={isNew} onCheckedChange={(checked) => setIsNew(checked)} />
                    Novidade
                </Label>

                {product && (
                    <Label className="flex items-center gap-3">
                        <Switch checked={active} onCheckedChange={(checked) => setActive(checked)} />
                        Produto ativo
                    </Label>
                )}
            </div>

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
