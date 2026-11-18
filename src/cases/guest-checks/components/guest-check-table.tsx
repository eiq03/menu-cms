import { Eye, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDateTime } from "@/lib/format"
import type { GuestCheckDTO } from "../dtos/guest-check.dto"

interface GuestCheckTableProps {
    guestChecks: GuestCheckDTO[];
    onOpen: (guestCheck: GuestCheckDTO) => void;
}

export function GuestCheckTable({ guestChecks, onOpen }: GuestCheckTableProps) {

    return (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-4">Mesa</TableHead>
                        <TableHead>Aberta em</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-36 pr-4 text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {guestChecks.map((guestCheck) => (
                        <TableRow key={guestCheck.id}>
                            <TableCell className="pl-4">
                                <div className="flex items-center gap-2 font-medium">
                                    <MapPin className="size-5 text-brand" />
                                    {guestCheck.spot.name}
                                </div>
                            </TableCell>
                            <TableCell>{formatDateTime(guestCheck.createdAt)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(guestCheck.total)}</TableCell>
                            <TableCell className="pr-4 text-right">
                                <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => onOpen(guestCheck)}
                                >
                                    <Eye />
                                    Ver pedidos
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
