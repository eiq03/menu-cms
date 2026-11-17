// URL com http/https e domínio (ex.: https://site.com/imagem.png), como o backend exige
export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.')
  } catch {
    return false
  }
}
