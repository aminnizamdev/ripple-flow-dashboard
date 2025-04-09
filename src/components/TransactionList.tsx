
import { TransactionItem } from "./TransactionItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ExternalLink, Filter, MoreHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onRefresh?: () => void;
  totalCount?: number;
}

export function TransactionList({
  transactions,
  title,
  emptyMessage = "No transactions yet",
  maxHeight = "500px",
  onRefresh,
  totalCount = 0,
}: TransactionListProps) {
  const maxHeightStyle = { maxHeight };

  return (
    <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            {totalCount > 0 && (
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs font-normal">
                {totalCount.toLocaleString()}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter Transactions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Show All</DropdownMenuItem>
                <DropdownMenuItem>XRP Only</DropdownMenuItem>
                <DropdownMenuItem>Non-XRP Only</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Large Transactions</DropdownMenuItem>
                <DropdownMenuItem>Small Transactions</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Export CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset Counter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="h-[1px] bg-border my-2"></div>
        
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            <RefreshCw className="h-6 w-6 text-muted-foreground/60 animate-spin-slow mb-3" />
            <p className="text-sm">{emptyMessage}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Waiting for real-time data...</p>
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
