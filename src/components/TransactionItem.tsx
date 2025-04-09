
import { formatAmount, formatDate, truncateAddress } from "@/lib/ripple-websocket";
import { ArrowRight, TrendingUp, ExternalLink, Flag, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TransactionItemProps {
  transaction: {
    TransactionType: string;
    hash?: string;
    Account?: string;
    Destination?: string;
    Amount?: string | { value: string; currency: string; issuer?: string };
    TakerPays?: string | { value: string; currency: string; issuer?: string };
    TakerGets?: string | { value: string; currency: string; issuer?: string };
    date?: number;
    Flags?: number;
    Fee?: string;
    Sequence?: number;
    DestinationTag?: number;
    SourceTag?: number;
    [key: string]: any;
  };
  className?: string;
  style?: React.CSSProperties;
}

export function TransactionItem({ transaction, className, style }: TransactionItemProps) {
  const isPayment = transaction.TransactionType === "Payment";
  const isOffer = transaction.TransactionType === "OfferCreate";

  // Format the transaction age in a more readable way
  const getTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "Unknown";
    const now = Date.now();
    const txTime = (timestamp + 946684800) * 1000; // Convert to milliseconds since epoch
    const diffMs = now - txTime;
    
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  };

  return (
    <div className={cn(
      "transaction-card relative overflow-hidden rounded-lg border p-3 transition-all duration-200 hover:shadow-md",
      isPayment ? "hover:border-green-300 dark:hover:border-green-700" : 
      isOffer ? "hover:border-blue-300 dark:hover:border-blue-700" : 
      "hover:border-gray-300 dark:hover:border-gray-700",
      className
    )} style={style}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-bl-full pointer-events-none"></div>
      
      <div className="flex justify-between items-start">
        <Badge variant="outline" className={cn(
          "font-medium",
          isPayment ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
          isOffer ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : 
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        )}>
          {transaction.TransactionType}
        </Badge>
        <div className="flex items-center gap-1.5">
          {transaction.Fee && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                  Fee: {parseInt(transaction.Fee) / 1000000} XRP
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Transaction Fee</p>
              </TooltipContent>
            </Tooltip>
          )}
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {getTimeAgo(transaction.date)}
          </span>
        </div>
      </div>
      
      <div className="text-sm mt-2">
        <div className="flex items-start gap-1 mb-1.5">
          <span className="font-medium text-muted-foreground min-w-16 mt-0.5">From:</span> 
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs">{truncateAddress(transaction.Account || '')}</span>
              <a href={`https://xrpscan.com/account/${transaction.Account}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            {transaction.SourceTag !== undefined && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Tag className="h-3 w-3" />
                <span>Source Tag: {transaction.SourceTag}</span>
              </div>
            )}
          </div>
        </div>
        
        {isPayment && transaction.Destination && (
          <div className="flex items-start gap-1 mb-1.5">
            <span className="font-medium text-muted-foreground min-w-16 mt-0.5">To:</span> 
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs">{truncateAddress(transaction.Destination)}</span>
                <a href={`https://xrpscan.com/account/${transaction.Destination}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              {transaction.DestinationTag !== undefined && (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  <span>Destination Tag: {transaction.DestinationTag}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {isPayment && transaction.Amount && (
          <div className="flex items-start gap-1 mt-3 bg-muted/30 p-2 rounded-md">
            <span className="font-medium text-muted-foreground min-w-16">Amount:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatAmount(transaction.Amount)}
            </span>
          </div>
        )}
        
        {isOffer && transaction.TakerPays && transaction.TakerGets && (
          <div className="grid gap-2 mt-3 bg-muted/30 p-2 rounded-md">
            <div className="flex items-center gap-1">
              <span className="font-medium text-muted-foreground min-w-16">Pays:</span> 
              <span className="text-red-600 dark:text-red-400">
                {formatAmount(transaction.TakerPays)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-muted-foreground min-w-16">Gets:</span> 
              <span className="text-green-600 dark:text-green-400">
                {formatAmount(transaction.TakerGets)}
              </span>
            </div>
            {transaction.Flags !== undefined && (
              <div className="flex items-center gap-1 mt-1 text-[10px]">
                <Flag className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Flags: {transaction.Flags}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
        <div className="truncate max-w-[70%]">
          <span className="font-medium mr-1">TX:</span>
          <span className="font-mono">{transaction.hash}</span>
        </div>
        <a 
          href={`https://xrpscan.com/tx/${transaction.hash}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
        >
          <span>View</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
