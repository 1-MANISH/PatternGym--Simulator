import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    // In production we might want to return partial data or throw, 
    // for dev we want to see the error but keep going if possible or throw loudly
    throw new Error(`Validation failed for ${label}: ${result.error.message}`);
  }
  return result.data;
}
