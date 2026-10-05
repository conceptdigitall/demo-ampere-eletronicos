import {
  BatteryCharging, Gamepad2, Headphones, Laptop, Monitor, Smartphone, Speaker, Tv, type LucideIcon,
} from "lucide-react";
import type { IconeProduto as Icone } from "@/lib/produtos";

const ICONES: Record<Icone, LucideIcon> = {
  smartphone: Smartphone,
  fone: Headphones,
  carregador: BatteryCharging,
  notebook: Laptop,
  console: Gamepad2,
  monitor: Monitor,
  tv: Tv,
  caixa: Speaker,
};

export function IconeProduto({ icone, className }: { icone: Icone; className?: string }) {
  const Componente = ICONES[icone];
  return <Componente className={className} strokeWidth={1.4} />;
}
