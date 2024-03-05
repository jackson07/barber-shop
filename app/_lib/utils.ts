import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeekdayName(dayNumber: number): string {
  const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return weekdays[dayNumber] || '';
}

export function adjustDate(dateStr: string): Date {
  const date = new Date(dateStr);
  return new Date(date.getTime() - (3 * 3600000));;
}