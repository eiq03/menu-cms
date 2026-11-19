export type ShiftId = 'morning' | 'afternoon' | 'night'

// endHour 30 = 06h do dia seguinte (o turno da noite atravessa a meia-noite)
export const SHIFTS: { id: ShiftId, label: string, startHour: number, endHour: number }[] = [
  { id: 'morning', label: 'Manhã (06h às 12h)', startHour: 6, endHour: 12 },
  { id: 'afternoon', label: 'Tarde (12h às 18h)', startHour: 12, endHour: 18 },
  { id: 'night', label: 'Noite (18h às 06h)', startHour: 18, endHour: 30 },
]

// data no formato do <input type="date"> (yyyy-mm-dd), no horário local
export function toDateInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export interface ShiftSelection {
  date: string
  shiftId: ShiftId
}

// turno em andamento agora; de 00h às 06h ainda é a noite do dia anterior
export function getCurrentShift(now: Date): ShiftSelection {
  const hour = now.getHours()

  if (hour < 6) {
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    return { date: toDateInputValue(yesterday), shiftId: 'night' }
  }

  const shiftId: ShiftId = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'night'
  return { date: toDateInputValue(now), shiftId }
}

// início (incluso) e fim (não incluso) do turno, no horário local
export function getShiftRange(date: string, shiftId: ShiftId): { start: Date, end: Date } {
  const [year, month, day] = date.split('-').map(Number)
  const shift = SHIFTS.find((item) => item.id === shiftId) ?? SHIFTS[0]

  return {
    start: new Date(year, month - 1, day, shift.startHour),
    end: new Date(year, month - 1, day, shift.endHour),
  }
}
