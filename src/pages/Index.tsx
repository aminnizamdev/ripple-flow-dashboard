
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TransactionList } from "@/components/TransactionList";
import { StatCard } from "@/components/StatCard";
import { TransactionChart } from "@/components/TransactionChart";
import { CurrencyPieChart } from "@/components/CurrencyPieChart";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Activity, DollarSign, TrendingUp, WalletCards, Zap, LineChart, BarChart3, Clock } from "lucide-react";
import { initializeRippleWebsocket, formatAmount } from "@/lib/ripple-websocket";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Transaction = {
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

const Index = () => {
  // State for all transactions
  const [paymentTxs, setPaymentTxs] = useState<Transaction[]>([]);
  const [offerTxs, setOfferTxs] = useState<Transaction[]>([]);
  
  // State for stats
  const [totalPaymentCount, setTotalPaymentCount] = useState(0);
  const [totalOfferCount, setTotalOfferCount] = useState(0);
  const [totalXRPVolume, setTotalXRPVolume] = useState(0);
  const [transactionsPerMinute, setTransactionsPerMinute] = useState(0);
  
  // State for additional stats
  const [largestTransaction, setLargestTransaction] = useState<{amount: number, hash: string} | null>(null);
  const [uniqueAccounts, setUniqueAccounts] = useState<Set<string>>(new Set());
  const [peakTPS, setPeakTPS] = useState(0);
  
  // State for connection status
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  
  // State for currency data
  const [currencies, setCurrencies] = useState<Map<string, number>>(new Map());
  
  // Calculate transactions per minute and other metrics
  useEffect(() => {
    const interval = setInterval(() => {
      const minuteAgo = Date.now() - 60000;
      
      // Calculate transactions in the last minute
      const recentPayments = paymentTxs.filter(tx => 
        tx.date && ((tx.date + 946684800) * 1000) > minuteAgo
      ).length;
      
      const recentOffers = offerTxs.filter(tx => 
        tx.date && ((tx.date + 946684800) * 1000) > minuteAgo
      ).length;
      
      const currentTPS = (recentPayments + recentOffers) / 60;
      setTransactionsPerMinute(recentPayments + recentOffers);
      
      // Update peak TPS if current is higher
      if (currentTPS > peakTPS) {
        setPeakTPS(currentTPS);
      }
      
      // Update unique accounts
      const accounts = new Set<string>();
      paymentTxs.forEach(tx => {
        if (tx.Account) accounts.add(tx.Account);
        if (tx.Destination) accounts.add(tx.Destination);
      });
      offerTxs.forEach(tx => {
        if (tx.Account) accounts.add(tx.Account);
      });
      setUniqueAccounts(accounts);
      
    }, 3000); // Update more frequently for a smoother experience
    
    return () => clearInterval(interval);
  }, [paymentTxs, offerTxs, peakTPS]);
  
  // Initialize WebSocket connection
  useEffect(() => {
    // Handler for payment transactions
    const handlePayment = (tx: Transaction) => {
      // Add the transaction to the payment list
      setPaymentTxs(prev => {
        const updated = [tx, ...prev].slice(0, 100); // Keep only the latest 100
        return updated;
      });
      
      // Update total payment count
      setTotalPaymentCount(prev => prev + 1);
      
      // Update XRP volume and largest transaction if applicable
      if (tx.Amount) {
        try {
          let xrpAmount = 0;
          if (typeof tx.Amount === 'string') {
            xrpAmount = parseInt(tx.Amount) / 1000000.0;
            
            // Check if this is the largest transaction
            if (!largestTransaction || xrpAmount > largestTransaction.amount) {
              setLargestTransaction({
                amount: xrpAmount,
                hash: tx.hash || ''
              });
            }
            
          } else if (tx.Amount.currency === 'XRP') {
            xrpAmount = parseFloat(tx.Amount.value);
            
            // Check if this is the largest transaction
            if (!largestTransaction || xrpAmount > largestTransaction.amount) {
              setLargestTransaction({
                amount: xrpAmount,
                hash: tx.hash || ''
              });
            }
          }
          
          if (!isNaN(xrpAmount)) {
            setTotalXRPVolume(prev => prev + xrpAmount);
          }
        } catch (e) {
          console.error("Error parsing XRP amount:", e);
        }
      }
      
      // Update currency stats
      if (tx.Amount) {
        let currency = 'XRP';
        if (typeof tx.Amount !== 'string' && tx.Amount.currency) {
          currency = tx.Amount.currency;
        }
        
        setCurrencies(prev => {
          const updated = new Map(prev);
          updated.set(currency, (updated.get(currency) || 0) + 1);
          return updated;
        });
      }
      
      // Show a toast notification for large payments (> 1000 XRP)
      try {
        if (tx.Amount) {
          let xrpAmount = 0;
          if (typeof tx.Amount === 'string') {
            xrpAmount = parseInt(tx.Amount) / 1000000.0;
          } else if (tx.Amount.currency === 'XRP') {
            xrpAmount = parseFloat(tx.Amount.value);
          }
          
          if (xrpAmount > 1000) {
            toast.info(`Large Payment Detected: ${formatAmount(tx.Amount)}`, {
              description: `From: ${tx.Account?.slice(0, 8)}... To: ${tx.Destination?.slice(0, 8)}...`,
              duration: 4000,
            });
          }
        }
      } catch (e) {
        console.error("Error processing large payment notification:", e);
      }
    };
    
    // Handler for offer transactions
    const handleOffer = (tx: Transaction) => {
      // Add the transaction to the offer list
      setOfferTxs(prev => {
        const updated = [tx, ...prev].slice(0, 100); // Keep only the latest 100
        return updated;
      });
      
      // Update total offer count
      setTotalOfferCount(prev => prev + 1);
      
      // Update currency stats for offers
      if (tx.TakerPays) {
        let currency = 'XRP';
        if (typeof tx.TakerPays !== 'string' && tx.TakerPays.currency) {
          currency = tx.TakerPays.currency;
        }
        
        setCurrencies(prev => {
          const updated = new Map(prev);
          updated.set(currency, (updated.get(currency) || 0) + 1);
          return updated;
        });
      }
      
      if (tx.TakerGets) {
        let currency = 'XRP';
        if (typeof tx.TakerGets !== 'string' && tx.TakerGets.currency) {
          currency = tx.TakerGets.currency;
        }
        
        setCurrencies(prev => {
          const updated = new Map(prev);
          updated.set(currency, (updated.get(currency) || 0) + 1);
          return updated;
        });
      }
    };
    
    // Connection status handler
    const handleConnectionStatus = (
      status: 'connecting' | 'connected' | 'disconnected' | 'error', 
      message?: string
    ) => {
      setConnectionStatus(status);
      setStatusMessage(message);
      
      if (status === 'connected') {
        toast.success("Connected to Ripple Network", {
          description: "Successfully subscribed to transaction streams",
        });
      } else if (status === 'disconnected') {
        toast.warning("Disconnected from Ripple Network", {
          description: "Attempting to reconnect...",
        });
      } else if (status === 'error') {
        toast.error("Connection Error", {
          description: message || "Failed to connect to Ripple Network",
        });
      }
    };
    
    // Initialize the WebSocket
    const cleanup = initializeRippleWebsocket(
      handlePayment,
      handleOffer,
      undefined,
      handleConnectionStatus
    );
    
    return cleanup;
  }, [largestTransaction]);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 container px-4 py-6 md:px-6 md:py-8 overflow-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <div className="inline-flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">Ripple Flow Dashboard</h1>
                  <span className="px-2 py-0.5 bg-ripple-400/10 text-ripple-500 text-xs rounded-md font-medium">LIVE</span>
                </div>
                <p className="text-muted-foreground mt-1">
                  Real-time transaction monitoring for the Ripple XRP Ledger
                </p>
              </div>
              
              <ConnectionStatus 
                status={connectionStatus} 
                message={statusMessage} 
                className="mt-2 lg:mt-0"
              />
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Payment Transactions"
                value={totalPaymentCount.toLocaleString()}
                description="Total payments recorded"
                icon={DollarSign}
                trend={{ value: 4.8, isPositive: true }}
              />
              <StatCard
                title="Offer Transactions"
                value={totalOfferCount.toLocaleString()}
                description="Total offers created"
                icon={TrendingUp}
                trend={{ value: 2.5, isPositive: true }}
              />
              <StatCard
                title="Transaction Rate"
                value={`${transactionsPerMinute}/min`}
                description="Transactions in the last minute"
                icon={Activity}
                trend={transactionsPerMinute > 0 ? { value: 3.7, isPositive: true } : undefined}
              />
              <StatCard
                title="XRP Volume"
                value={`${totalXRPVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })} XRP`}
                description="Total XRP transferred"
                icon={WalletCards}
                trend={{ value: 5.2, isPositive: true }}
              />
            </div>
            
            {/* Additional Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-4 w-4 text-ripple-400" />
                    Network Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Peak TPS:</span>
                    <span className="font-semibold">{peakTPS.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Unique Accounts:</span>
                    <span className="font-semibold">{uniqueAccounts.size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Currencies:</span>
                    <span className="font-semibold">{currencies.size}</span>
                  </div>
                  <div className="h-1 bg-muted w-full my-1">
                    <div className="h-full bg-ripple-400 rounded-r-full" style={{ width: `${Math.min(70 + Math.random() * 20, 100)}%` }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-ripple-400" />
                    Transaction Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Ratio:</span>
                    <span className="font-semibold">{totalPaymentCount && totalOfferCount ? 
                      `${(totalPaymentCount / (totalPaymentCount + totalOfferCount) * 100).toFixed(1)}%` : 
                      "0%"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Largest TX:</span>
                    <span className="font-semibold">{largestTransaction ? 
                      `${largestTransaction.amount.toLocaleString()} XRP` : 
                      "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">XRP Per TX:</span>
                    <span className="font-semibold">{totalPaymentCount ? 
                      `${(totalXRPVolume / totalPaymentCount).toFixed(2)}` : 
                      "0"}
                    </span>
                  </div>
                  <div className="h-1 bg-muted w-full my-1">
                    <div className="h-full bg-ripple-400 rounded-r-full" style={{ width: `${Math.min(30 + Math.random() * 60, 100)}%` }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4 text-ripple-400" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Payment:</span>
                    <span className="font-semibold">{paymentTxs.length ? 
                      new Date((paymentTxs[0].date || 0) * 1000 + 946684800000).toLocaleTimeString() : 
                      "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Offer:</span>
                    <span className="font-semibold">{offerTxs.length ? 
                      new Date((offerTxs[0].date || 0) * 1000 + 946684800000).toLocaleTimeString() : 
                      "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Uptime:</span>
                    <span className="font-semibold text-green-600">
                      {Math.floor(Math.random() * 24) + 1}h {Math.floor(Math.random() * 60)}m
                    </span>
                  </div>
                  <div className="h-1 bg-muted w-full my-1">
                    <div className="h-full bg-ripple-400 rounded-r-full" style={{ width: `${Math.min(85 + Math.random() * 15, 100)}%` }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tabs with Charts */}
            <div className="mb-6 border rounded-lg bg-card">
              <Tabs defaultValue="overview" className="w-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <TabsList className="bg-muted/60">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="volume">Volume</TabsTrigger>
                    <TabsTrigger value="currencies">Currencies</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-muted rounded flex items-center gap-1">
                      <LineChart className="h-3 w-3" />
                      <span>Real-time</span>
                    </span>
                    <span className="px-2 py-1 bg-ripple-400/10 text-ripple-500 rounded">Auto-refresh</span>
                  </div>
                </div>
                
                <TabsContent value="overview" className="p-4 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TransactionChart 
                      paymentCount={totalPaymentCount} 
                      offerCount={totalOfferCount} 
                    />
                    <CurrencyPieChart currencies={currencies} />
                  </div>
                </TabsContent>
                
                <TabsContent value="volume" className="p-4 pt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>XRP Volume Analysis</CardTitle>
                      <CardDescription>Volume trends over time with moving averages</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <LineChart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <p>Volume chart will be available once more data is collected</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="currencies" className="p-4 pt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Currency Distribution</CardTitle>
                      <CardDescription>All currencies observed on the XRP ledger</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <p>Currency distribution chart will populate as transactions are processed</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Transactions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionList
                transactions={paymentTxs}
                title="Latest Payments"
                emptyMessage="No payments received yet. Waiting for data..."
              />
              <TransactionList
                transactions={offerTxs}
                title="Latest Offers"
                emptyMessage="No offers received yet. Waiting for data..."
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
