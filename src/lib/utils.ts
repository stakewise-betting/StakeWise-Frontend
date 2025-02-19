import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge" //solve tailwindcss class conflicts

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
