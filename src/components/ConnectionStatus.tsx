
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ 
  className
}: ConnectionStatusProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium"
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
        Connected
      </Badge>
    </div>
  );
}
