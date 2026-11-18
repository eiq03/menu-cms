import { MapPin, Pencil, Trash2 } from "lucide-react"
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
import type { SpotDTO } from "../dtos/spot.dto"

interface SpotTableProps {
    spots: SpotDTO[];
    onEdit: (spot: SpotDTO) => void;
    onDelete: (spot: SpotDTO) => void;
}

export function SpotTable({
    spots,
    onEdit,
    onDelete
}: SpotTableProps) {

    return (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16 pl-4" />
                        <TableHead>Nome</TableHead>
                        <TableHead className="w-24">Situação</TableHead>
                        <TableHead className="w-24 pr-4 text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {spots.map((spot) => (
                        <TableRow key={spot.id}>
                            <TableCell className="pl-4">
                                <MapPin className="size-6 text-brand" />
                            </TableCell>
                            <TableCell className="font-medium">{spot.name}</TableCell>
                            <TableCell>
                                <Badge variant={spot.active ? 'default' : 'outline'}>
                                    {spot.active ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </TableCell>
                            <TableCell className="pr-4 text-right">
                                <Button
                                variant="ghost"
                                size="icon-sm"
                                className="cursor-pointer"
                                aria-label={`Editar ${spot.name}`}
                                onClick={() => onEdit(spot)}
                                >
                                    <Pencil />
                                </Button>
                                <Button
                                variant="ghost"
                                size="icon-sm"
                                className="cursor-pointer text-destructive hover:text-destructive"
                                aria-label={`Excluir ${spot.name}`}
                                onClick={() => onDelete(spot)}
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
