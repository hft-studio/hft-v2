import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBaseUrl = () => {
	return process.env.NODE_ENV === "production" ? "https://hft.studio" : "http://localhost:3000";
}