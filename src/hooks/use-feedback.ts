import { useEffect, useState } from 'react'

export interface Feedback {
  type: 'success' | 'error'
  message: string
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  // some sozinho depois de 4 segundos
  useEffect(() => {
    if (!feedback) return

    const timer = setTimeout(() => setFeedback(null), 4000)
    return () => clearTimeout(timer)
  }, [feedback])

  return {
    feedback,
    showSuccess: (message: string) => setFeedback({ type: 'success', message }),
    showError: (message: string) => setFeedback({ type: 'error', message }),
  }
}
