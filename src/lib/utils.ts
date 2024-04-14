import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils.js
export function encodeId(id: number) {
  return btoa(id);  // codifica em base64
}

export function decodeId(encodedId: number){
  return atob(encodedId);  // decodifica de base64
}

