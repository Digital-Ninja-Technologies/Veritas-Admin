import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/format";
import type { BadgeTone } from "@/lib/status-meta";

const toneToVariant: Record<BadgeTone, "success" | "warning" | "info" | "destructive" | "secondary"> = {
  success: "success",
  warning: "warning",
  info: "info",
  destructive: "destructive",
  secondary: "secondary",
};

export function StatusBadge({ status, tone }: { status: string; tone: BadgeTone }) {
  return <Badge variant={toneToVariant[tone]}>{titleCase(status)}</Badge>;
}
