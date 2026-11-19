import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import type { ProductDTO } from "../dtos/product.dto"
// arquivos da pasta public/ não são importados: o Vite serve direto na raiz do site
const noProduct = "/no-product.svg"

interface ProductTableProps {
    products: ProductDTO[];
    onEdit: (product: ProductDTO) => void;
    onDelete: (product: ProductDTO) => void;
}

export function ProductTable({
    products,
    onEdit,
    onDelete
}: ProductTableProps) {

    return (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16 pl-4">Imagem</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead>Indicadores</TableHead>
                        <TableHead>Situação</TableHead>
                        <TableHead className="w-24 pr-4 text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="pl-4">
                                <img
                                src={product.picture ?? noProduct}
                                alt={product.name}
                                className="size-10 rounded-md object-cover"
                                />
                            </TableCell>
                            <TableCell className="font-medium whitespace-normal">{product.name}</TableCell>
                            <TableCell className="whitespace-normal">{product.category?.name ?? '-'}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {product.vegetarian && <Badge variant="secondary">Vegetariano</Badge>}
                                    {product.isNew && <Badge>Novidade</Badge>}
                                    {!product.vegetarian && !product.isNew && <span className="text-muted-foreground">-</span>}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={product.active ? 'default' : 'outline'}>
                                    {product.active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </TableCell>
                            <TableCell className="pr-4 text-right">
                                <Button
                                variant="ghost"
                                size="icon-sm"
                                className="cursor-pointer"
                                aria-label={`Editar ${product.name}`}
                                onClick={() => onEdit(product)}
                                >
                                    <Pencil />
                                </Button>
                                <Button
                                variant="ghost"
                                size="icon-sm"
                                className="cursor-pointer text-destructive hover:text-destructive"
                                aria-label={`Excluir ${product.name}`}
                                onClick={() => onDelete(product)}
                                >
                                    <Trash2 />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
