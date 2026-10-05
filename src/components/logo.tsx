import { Zap } from "lucide-react";

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-ink-900 ring-1 ring-white/10">
        <Zap className="size-5 fill-volt-400 text-volt-400" />
      </span>
      <span className={`font-display text-lg font-bold tracking-tight ${claro ? "text-white" : "text-ink-900"}`}>
        Ampère<span className="text-volt-500">.</span>
      </span>
    </span>
  );
}
