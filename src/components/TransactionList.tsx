
import { TransactionItem } from "./TransactionItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  TransactionType: string;
  hash?: string;
  Account?: string;
  Destination?: string;
  Amount?: string | { value: string; currency: string; issuer?: string };
  TakerPays?: string | { value: string; currency: string; issuer?: string };
  TakerGets?: string | { value: string; currency: string; issuer?: string };
  date?: number;
  [key: string]: any;
}

interface TransactionListProps {
  transactions: Transaction[];
  title: string;
  emptyMessage?: string;
  maxHeight?: string;
}

export function TransactionList({
  transactions,
  title,
  emptyMessage = "No transactions yet",
  maxHeight = "500px",
}: TransactionListProps) {
  const maxHeightStyle = { maxHeight };

  return (
    <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="h-[1px] bg-border my-2"></div>
        
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            <RefreshCw className="h-6 w-6 text-muted-foreground/60 animate-spin-slow" />
            <p className="mt-2 text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <ScrollArea style={maxHeightStyle} className="pr-4 -mr-4">
            <div className="space-y-3 pt-1">
              {transactions.map((transaction, index) => (
                <TransactionItem 
                  key={transaction.hash || `tx-${index}`} 
                  transaction={transaction} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
