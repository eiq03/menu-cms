import { Pencil, Trash2, Utensils } from "lucide-react"
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
import type { CategoryDTO } from "../dtos/category.dto"

interface CategoryTableProps {
    categories: CategoryDTO[];
    onEdit: (category: CategoryDTO) => void;
    onDelete: (category: CategoryDTO) => void;
}

export function CategoryTable({
    categories,
    onEdit,
    onDelete
}: CategoryTableProps) {

    return (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16 pl-4">Ícone</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="w-20 text-center">Ordem</TableHead>
                        <TableHead className="w-24">Situação</TableHead>
                        <TableHead className="w-24 pr-4 text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell className="pl-4">
                                {category.icon ? (
                                    <img src={category.icon} alt={category.name} className="size-8 object-contain" />
                                ) : (
                                    <Utensils className="size-8 text-brand" />
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell className="text-center">{category.displayOrder}</TableCell>
                            <TableCell>
                                <Badge variant={category.active ? 'default' : 'outline'}>
                                    {category.active ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </TableCell>
                            <TableCell className="pr-4 text-right">
                                <Button
                                variant="ghost"
                                size="icon-sm"
                                className="cursor-pointer"
                                aria-label={`Editar ${category.name}`}
                                onClick={() => onEdit(category)}
                                >
                                    <Pencil />
                                </Button>
                                <Button
                                variant="ghost"
                                size="icon-sm"
                                className="cursor-pointer text-destructive hover:text-destructive"
                                aria-label={`Excluir ${category.name}`}
                                onClick={() => onDelete(category)}
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
