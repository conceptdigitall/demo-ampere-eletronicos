import type { Metadata } from "next";
import { PainelCrm } from "@/components/painel-crm";

export const metadata: Metadata = {
  title: "Painel da loja · Ampère (demonstração)",
};

export default function Painel() {
  return <PainelCrm />;
}
