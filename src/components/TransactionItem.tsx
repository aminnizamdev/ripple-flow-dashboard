
import { formatAmount, formatDate, truncateAddress } from "@/lib/ripple-websocket";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    [key: string]: any;
  };
  className?: string;
}

export function TransactionItem({ transaction, className }: TransactionItemProps) {
  const isPayment = transaction.TransactionType === "Payment";
  const isOffer = transaction.TransactionType === "OfferCreate";

  return (
    <div className={cn("transaction-card flex flex-col space-y-2", className)}>
      <div className="flex justify-between items-start">
        <Badge variant="outline" className={cn(
          "font-medium",
          isPayment ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
          isOffer ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : 
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        )}>
          {transaction.TransactionType}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatDate(transaction.date)}
        </span>
      </div>
      
      <div className="text-sm">
        <div className="flex items-center gap-1 mb-1">
          <span className="font-medium">From:</span> 
          <span className="text-muted-foreground">{truncateAddress(transaction.Account || '')}</span>
        </div>
        
        {isPayment && transaction.Destination && (
          <div className="flex items-center gap-1 mb-1">
            <span className="font-medium">To:</span> 
            <span className="text-muted-foreground">{truncateAddress(transaction.Destination)}</span>
          </div>
        )}
        
        {isPayment && transaction.Amount && (
          <div className="flex items-center gap-1">
            <span className="font-medium">Amount:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatAmount(transaction.Amount)}
            </span>
          </div>
        )}
        
        {isOffer && transaction.TakerPays && transaction.TakerGets && (
          <div className="flex flex-col mt-1">
            <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
              <span className="font-medium">Pays:</span> 
              <span className="text-red-600 dark:text-red-400">
                {formatAmount(transaction.TakerPays)}
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
              <span className="font-medium">Gets:</span> 
              <span className="text-green-600 dark:text-green-400">
                {formatAmount(transaction.TakerGets)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground truncate">
        TX: {transaction.hash}
      </div>
    </div>
  );
}
