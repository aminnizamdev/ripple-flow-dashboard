
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, WifiOff, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  message?: string;
  className?: string;
}

export function ConnectionStatus({ 
  status,
  message,
  className
}: ConnectionStatusProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant="outline"
        className={cn(
          "font-medium",
          status === 'connected' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          status === 'connecting' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          status === 'disconnected' && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
          status === 'error' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        )}
      >
        {status === 'connected' && (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Connected
          </>
        )}
        {status === 'connecting' && (
          <>
            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            Connecting
          </>
        )}
        {status === 'disconnected' && (
          <>
            <WifiOff className="h-3.5 w-3.5 mr-1" />
            Disconnected
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            Error
          </>
        )}
      </Badge>
      {message && <span className="text-xs text-muted-foreground">{message}</span>}
    </div>
  );
}
