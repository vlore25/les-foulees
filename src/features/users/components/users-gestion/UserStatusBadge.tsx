import { Badge } from "@/components/ui/badge";

// 1. Les CLÉS (à gauche) doivent matcher EXACTEMENT ta Base de Données.
const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "destructive" | "secondary" | "outline"; className?: string }> = {
  
  // DB: "ACTIVE"  --->  Écran: "Actif" (Vert)
  ACTIVE: { 
    label: "Actif", 
    variant: "default", 
    className: "bg-emerald-600 hover:bg-emerald-700 border-emerald-600" 
  },

  // DB: "INACTIVE" ---> Écran: "Inactif" (Rouge)
  INACTIVE: { 
    label: "Inactif", 
    variant: "destructive" 
  },
};

interface UserStatusBadgeProps {
  status: string; 
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  
  // 2. On cherche dans le dico. 
  // Si status est "ACTIVE", ça renvoie l'objet configuré plus haut.
  // Le "|| STATUS_CONFIG.INACTIVE" sert de sécurité (fallback) si le status est inconnu.
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.INACTIVE;

  return (
    <Badge 
      variant={config.variant} 
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}