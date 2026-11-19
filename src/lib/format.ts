const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// aceita número ou o texto que vem do backend (ex.: "25.90")
export function formatCurrency(value: number | string): string {
  return currencyFormatter.format(Number(value))
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

// ex.: "15/09/2026, 21:54"
export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value))
}

const timeFormatter = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' })

// ex.: "21:54"
export function formatTime(value: string): string {
  return timeFormatter.format(new Date(value))
}
