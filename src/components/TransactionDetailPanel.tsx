
import { formatAmount, formatDate, truncateAddress } from "@/lib/ripple-websocket";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TransactionDetailPanelProps {
  transaction: any;
  onClose: () => void;
}

export function TransactionDetailPanel({ transaction, onClose }: TransactionDetailPanelProps) {
  const { toast } = useToast();
  
  if (!transaction) return null;
  
  const isPayment = transaction.TransactionType === "Payment";
  const isOffer = transaction.TransactionType === "OfferCreate";
  
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied`,
      duration: 2000,
    });
  };
  
  return (
    <div className="bg-background border rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(
            "font-medium",
            isPayment ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
            isOffer ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : 
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          )}>
            {transaction.TransactionType}
          </Badge>
          <h2 className="text-xl font-semibold">Transaction Details</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="p-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Transaction Hash</h3>
              <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
                <span className="text-sm font-mono flex-1 break-all">{transaction.hash}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => handleCopy(transaction.hash || '', 'Transaction hash')}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <a 
                  href={`https://xrpscan.com/tx/${transaction.hash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
                  <span className="text-sm font-mono flex-1 truncate">{transaction.Account}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => handleCopy(transaction.Account || '', 'Account address')}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <a 
                    href={`https://xrpscan.com/account/${transaction.Account}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </div>
              </div>
              
              {isPayment && transaction.Destination && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">To</h3>
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
                    <span className="text-sm font-mono flex-1 truncate">{transaction.Destination}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => handleCopy(transaction.Destination || '', 'Destination address')}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <a 
                      href={`https://xrpscan.com/account/${transaction.Destination}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {isPayment && transaction.Amount && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                  <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                    {formatAmount(transaction.Amount)}
                  </span>
                </div>
              </div>
            )}
            
            {isOffer && transaction.TakerPays && transaction.TakerGets && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Taker Pays</h3>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                    <span className="text-lg font-semibold text-red-700 dark:text-red-300">
                      {formatAmount(transaction.TakerPays)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Taker Gets</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                    <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                      {formatAmount(transaction.TakerGets)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Transaction Details</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Date</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fee</TableCell>
                    <TableCell>{transaction.Fee ? `${parseInt(transaction.Fee) / 1000000} XRP` : 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sequence</TableCell>
                    <TableCell>{transaction.Sequence || 'N/A'}</TableCell>
                  </TableRow>
                  {transaction.DestinationTag !== undefined && (
                    <TableRow>
                      <TableCell className="font-medium">Destination Tag</TableCell>
                      <TableCell>{transaction.DestinationTag}</TableCell>
                    </TableRow>
                  )}
                  {transaction.SourceTag !== undefined && (
                    <TableRow>
                      <TableCell className="font-medium">Source Tag</TableCell>
                      <TableCell>{transaction.SourceTag}</TableCell>
                    </TableRow>
                  )}
                  {transaction.Flags !== undefined && (
                    <TableRow>
                      <TableCell className="font-medium">Flags</TableCell>
                      <TableCell>{transaction.Flags}</TableCell>
                    </TableRow>
                  )}
                  {transaction.LastLedgerSequence !== undefined && (
                    <TableRow>
                      <TableCell className="font-medium">Last Ledger Sequence</TableCell>
                      <TableCell>{transaction.LastLedgerSequence}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Raw Transaction</h3>
              <div className="bg-muted/40 p-3 rounded-md border overflow-auto max-h-60">
                <pre className="text-xs font-mono">{JSON.stringify(transaction, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
