import { CircleAlert, CircleCheck } from "lucide-react"
import { cn } from "cn"
import { Alert, AlertTitle } from "@/components/ui/alert"
import type { Feedback } from "@/hooks/use-feedback"

interface FeedbackAlertProps {
    feedback: Feedback | null;
}

export function FeedbackAlert({ feedback }: FeedbackAlertProps) {

    if (!feedback) return null

    const isError = feedback.type === 'error'

    return (
        <Alert
        variant={isError ? 'destructive' : 'default'}
        className={cn(!isError && 'border-brand/20 bg-secondary text-secondary-foreground')}
        >
            {isError ? <CircleAlert /> : <CircleCheck />}
            <AlertTitle>{feedback.message}</AlertTitle>
        </Alert>
    )
}
