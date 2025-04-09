
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  trend,
}: StatCardProps) {
  return (
    <div className={cn("stat-card relative overflow-hidden group hover:border-ripple-300 transition-all duration-300", className)}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-ripple-100 rounded-full -mr-10 -mt-10 opacity-30 dark:opacity-10 group-hover:opacity-50 transition-opacity"></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
          
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium mt-2 gap-1",
              trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              <span className="flex items-center gap-0.5">
                {trend.isPositive ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L20 11L17.5 11L17.5 19L6.5 19L6.5 11L4 11L12 3Z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21L4 13L6.5 13L6.5 5L17.5 5L17.5 13L20 13L12 21Z" fill="currentColor" />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground text-[10px]">last 24h</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
          )}
        </div>
        
        {Icon && (
          <div className="p-2.5 bg-primary/10 rounded-full shadow-sm">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      
      <div className="h-1 w-full bg-muted absolute bottom-0 left-0">
        <div className="h-full bg-ripple-400 rounded-r-full" style={{ width: `${Math.min(trend?.value ? Math.abs(trend.value) * 3 : 30, 100)}%` }}></div>
      </div>
    </div>
  );
}
