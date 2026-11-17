const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// aceita número ou o texto que vem do backend (ex.: "25.90")
export function formatCurrency(value: number | string): string {
  return currencyFormatter.format(Number(value))
}
