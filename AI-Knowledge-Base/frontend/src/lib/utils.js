import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes intelligently (later classes override earlier
 * conflicting ones) and supports conditional class objects via clsx.
 * Used by every shadcn/ui component.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
