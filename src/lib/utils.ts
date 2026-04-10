import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetUrl(path: string | null | undefined, fallback: string = '/images/login-hero.jpg'): string {
  if (!path) return fallback;
  
  // Si le chemin est déjà une URL complète, on le retourne tel quel
  if (path.startsWith('http')) return path;

  const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL || '';
  return `${baseUrl}${path}`.replace(/\/+/g, '/').replace(':/', '://');
}

export function formatEventType(type: string): string {
  const mapping: Record<string, string> = {
    'TRAIL': 'Trail',
    'COURSE_ROUTE': 'Course route',
    'ENTRAINEMENT': 'Entraînement',
    'VIE_DU_CLUB': 'Vie du club',
    'SORTIE': 'Sortie',
    'AUTRE': 'Autre'
  };
  
  if (mapping[type]) return mapping[type];
  
  // Fallback regex pour les types non mappés
  return type.replace(/_/g, ' ').toLowerCase();
}
