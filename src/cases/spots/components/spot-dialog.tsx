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
import { useCreateSpot, useUpdateSpot } from "../hooks/use-spot"
import type { SpotDTO } from "../dtos/spot.dto"

interface SpotDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    spot: SpotDTO | null;
    onSuccess: (message: string) => void;
}

export function SpotDialog({
    open,
    onOpenChange,
    spot,
    onSuccess
}: SpotDialogProps) {

    function handleSaved(message: string) {
        onOpenChange(false)
        onSuccess(message)
    }

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>{spot ? 'Editar mesa' : 'Nova mesa'}</DialogTitle>
        <DialogDescription>
            Informe o nome da mesa (ex.: Mesa 01).
        </DialogDescription>
        </DialogHeader>

        <SpotForm spot={spot} onSaved={handleSaved} />
    </DialogContent>
    </Dialog>
    )
}

interface SpotFormProps {
    spot: SpotDTO | null;
    onSaved: (message: string) => void;
}

interface SpotFormErrors {
    name?: string;
    api?: string;
}

// fica dentro do DialogContent, então é montado de novo (limpo) a cada abertura
function SpotForm({ spot, onSaved }: SpotFormProps) {

    const [name, setName] = useState(spot?.name ?? '')
    const [active, setActive] = useState(spot?.active ?? true)
    const [errors, setErrors] = useState<SpotFormErrors>({})

    const createSpot = useCreateSpot()
    const updateSpot = useUpdateSpot()
    const isSaving = createSpot.isPending || updateSpot.isPending

    function validate(): SpotFormErrors {
        const formErrors: SpotFormErrors = {}

        if (!name.trim()) {
            formErrors.name = 'Informe o nome da mesa.'
        } else if (name.trim().length > 60) {
            formErrors.name = 'O nome deve ter no máximo 60 caracteres.'
        }

        return formErrors
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formErrors = validate()
        setErrors(formErrors)
        if (Object.keys(formErrors).length > 0) return

        const onError = () => setErrors({ api: 'Não foi possível salvar a mesa. Tente novamente.' })

        if (spot) {
            updateSpot.mutate(
                { id: spot.id, spot: { name: name.trim(), active } },
                { onSuccess: () => onSaved('Mesa atualizada com sucesso.'), onError }
            )
        } else {
            createSpot.mutate(
                { name: name.trim() },
                { onSuccess: () => onSaved('Mesa cadastrada com sucesso.'), onError }
            )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-2">
                <Label htmlFor="spot-name">Nome</Label>
                <Input
                id="spot-name"
                placeholder="Mesa 01"
                value={name}
                maxLength={60}
                aria-invalid={!!errors.name}
                onChange={(event) => setName(event.target.value)}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {spot && (
                <Label className="flex items-center gap-3">
                    <Switch checked={active} onCheckedChange={(checked) => setActive(checked)} />
                    Mesa ativa
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
