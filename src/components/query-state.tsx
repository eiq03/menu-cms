import type { ReactNode } from "react"
import { CircleAlert, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface QueryStateProps {
    isPending: boolean;
    isError: boolean;
    isEmpty: boolean;
    emptyMessage: string;
    children: ReactNode;
}

export function QueryState({
    isPending,
    isError,
    isEmpty,
    emptyMessage,
    children
}: QueryStateProps) {

    if (isPending) {
        return (
            <div className="flex items-center gap-2 py-6 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Carregando...
            </div>
        )
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <CircleAlert />
                <AlertTitle>Erro ao carregar os dados.</AlertTitle>
                <AlertDescription>Verifique se a API está rodando e recarregue a página.</AlertDescription>
            </Alert>
        )
    }

    if (isEmpty) {
        return (
            <p className="py-6 text-muted-foreground">{emptyMessage}</p>
        )
    }

    return <>{children}</>
}
