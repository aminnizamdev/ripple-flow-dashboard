
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart4, PieChart, TrendingUp } from "lucide-react";

interface TransactionStatsProps {
  totalPaymentCount: number;
  totalOfferCount: number;
  totalXRPVolume: number;
  uniqueAccounts: number;
  currencies: Map<string, number>;
  largestTransaction: { amount: number; hash: string } | null;
}

export function TransactionStats({
  totalPaymentCount,
  totalOfferCount,
  totalXRPVolume,
  uniqueAccounts,
  currencies,
  largestTransaction
}: TransactionStatsProps) {
  // Calculate percentages for transaction types
  const totalTx = totalPaymentCount + totalOfferCount;
  const paymentPercentage = totalTx > 0 ? (totalPaymentCount / totalTx) * 100 : 0;
  const offerPercentage = totalTx > 0 ? (totalOfferCount / totalTx) * 100 : 0;
  
  // Sort currencies by transaction count for top currencies
  const sortedCurrencies = Array.from(currencies.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Calculate XRP vs non-XRP transactions
  const xrpTx = currencies.get('XRP') || 0;
  const nonXrpTx = totalTx - xrpTx;
  const xrpPercentage = totalTx > 0 ? (xrpTx / totalTx) * 100 : 0;
  const nonXrpPercentage = totalTx > 0 ? (nonXrpTx / totalTx) * 100 : 0;
  
  return (
    <Card className="h-full shadow-sm animate-in fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-primary" />
            <span>Transaction Analytics</span>
          </div>
          <Badge variant="outline" className="text-xs bg-muted">
            {totalTx.toLocaleString()} Transactions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <Tabs defaultValue="breakdown">
          <TabsList className="w-full mb-3 bg-muted/60">
            <TabsTrigger value="breakdown" className="text-xs">
              <PieChart className="h-3.5 w-3.5 mr-1" />
              Breakdown
            </TabsTrigger>
            <TabsTrigger value="currencies" className="text-xs">
              <BarChart4 className="h-3.5 w-3.5 mr-1" />
              Top Currencies
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              Key Metrics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="breakdown" className="mt-0 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium">Transaction Types</h3>
                <span className="text-xs text-muted-foreground">{totalTx.toLocaleString()} total</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-400"></span>
                      Payments
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{totalPaymentCount.toLocaleString()}</span>
                      <Badge variant="outline" className="text-[10px] px-1 h-4 bg-primary/5">
                        {paymentPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={paymentPercentage} className="h-1.5" indicatorClass="bg-green-400" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                      Offers
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{totalOfferCount.toLocaleString()}</span>
                      <Badge variant="outline" className="text-[10px] px-1 h-4 bg-primary/5">
                        {offerPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={offerPercentage} className="h-1.5" indicatorClass="bg-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium">XRP vs. Other Currencies</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-ripple-400"></span>
                      XRP
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{xrpTx.toLocaleString()}</span>
                      <Badge variant="outline" className="text-[10px] px-1 h-4 bg-primary/5">
                        {xrpPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={xrpPercentage} className="h-1.5" indicatorClass="bg-ripple-400" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                      Other
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{nonXrpTx.toLocaleString()}</span>
                      <Badge variant="outline" className="text-[10px] px-1 h-4 bg-primary/5">
                        {nonXrpPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={nonXrpPercentage} className="h-1.5" indicatorClass="bg-purple-400" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="currencies" className="mt-0">
            <ScrollArea className="h-[240px] pr-2 -mr-2">
              {sortedCurrencies.length > 0 ? (
                <div className="space-y-4">
                  {sortedCurrencies.map(([currency, count], index) => {
                    const percentage = (count / totalTx) * 100;
                    const colors = [
                      "bg-ripple-400", "bg-blue-400", "bg-green-400", 
                      "bg-amber-400", "bg-red-400", "bg-purple-400"
                    ];
                    const colorIndex = index % colors.length;
                    
                    return (
                      <div key={currency} className="space-y-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <span className={`h-2 w-2 rounded-full ${colors[colorIndex]}`}></span>
                            {currency}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">{count.toLocaleString()}</span>
                            <Badge variant="outline" className="text-[10px] px-1 h-4 bg-primary/5">
                              {percentage.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress 
                          value={percentage} 
                          className="h-1.5" 
                          indicatorClass={colors[colorIndex]} 
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Waiting for currency data...
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Total XRP Volume</p>
                <p className="text-lg font-semibold">
                  {totalXRPVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })} XRP
                </p>
              </div>
              
              <div className="space-y-1 bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Active Accounts</p>
                <p className="text-lg font-semibold">{uniqueAccounts.toLocaleString()}</p>
              </div>
              
              <div className="space-y-1 bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Average XRP/TX</p>
                <p className="text-lg font-semibold">
                  {totalPaymentCount > 0 
                    ? (totalXRPVolume / totalPaymentCount).toFixed(2) 
                    : "0.00"} XRP
                </p>
              </div>
              
              <div className="space-y-1 bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Currencies</p>
                <p className="text-lg font-semibold">{currencies.size}</p>
              </div>
              
              <div className="col-span-2 space-y-1 bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-700 dark:text-green-300">Largest Transaction</p>
                {largestTransaction ? (
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-base font-semibold text-green-700 dark:text-green-300">
                      {largestTransaction.amount.toLocaleString()} XRP
                    </p>
                    <p className="text-xs font-mono truncate self-end text-right">
                      {largestTransaction.hash.substring(0, 8)}...
                    </p>
                  </div>
                ) : (
                  <p className="text-base font-semibold text-green-700 dark:text-green-300">N/A</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
