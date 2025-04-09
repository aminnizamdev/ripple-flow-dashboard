
import { TransactionItem } from "./TransactionItem";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="h-[1px] bg-border my-2"></div>
        
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <ScrollArea className={`pr-4 -mr-4 max-h-[${maxHeight}]`}>
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
