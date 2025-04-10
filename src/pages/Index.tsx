
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TransactionList } from "@/components/TransactionList";
import { StatCard } from "@/components/StatCard";
import { TransactionChart } from "@/components/TransactionChart";
import { CurrencyPieChart } from "@/components/CurrencyPieChart";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Activity, ArrowUpRight, BarChart3, Clock, DollarSign, ExternalLink, Filter, Globe, LayoutDashboard, LineChart, Network, RefreshCw, Search, Shield, TrendingUp, WalletCards, Zap } from "lucide-react";
import { initializeRippleWebsocket, formatAmount } from "@/lib/ripple-websocket";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionStats } from "@/components/TransactionStats";
import { NetworkStatusPanel } from "@/components/NetworkStatusPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
      
      // Set connection status to disconnected if no transactions in the last minute
      if (connectionStatus === 'connected' && recentPayments === 0 && recentOffers === 0) {
        setConnectionStatus('disconnected');
        setStatusMessage('No recent transactions received');
      }
      
    }, 3000); // Update more frequently for a smoother experience
    
    return () => clearInterval(interval);
  }, [paymentTxs, offerTxs, peakTPS, connectionStatus]);
  
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
      
      // Set connection status to connected since we received a transaction
      if (connectionStatus !== 'connected') {
        setConnectionStatus('connected');
        setStatusMessage(undefined);
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
      
      // Set connection status to connected since we received a transaction
      if (connectionStatus !== 'connected') {
        setConnectionStatus('connected');
        setStatusMessage(undefined);
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
  }, [largestTransaction, connectionStatus]);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader connectionStatus={connectionStatus} />
          
          <main className="flex-1 container px-4 py-6 md:px-6 md:py-8 overflow-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <div className="inline-flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">Ripple Flow Dashboard</h1>
                  <Badge variant="outline" className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-md flex items-center gap-1",
                    connectionStatus === 'connected' ? "bg-ripple-400/10 text-ripple-500" : 
                    connectionStatus === 'connecting' ? "bg-amber-400/10 text-amber-500" : 
                    "bg-red-400/10 text-red-500"
                  )}>
                    {connectionStatus === 'connected' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-ripple-500 animate-pulse"></span>
                    )}
                    {connectionStatus === 'connecting' && (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    )}
                    {connectionStatus === 'connected' ? 'LIVE' : 
                     connectionStatus === 'connecting' ? 'CONNECTING' : 
                     'OFFLINE'}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Real-time transaction monitoring for the XRP Ledger 
                  <a 
                    href="https://xrpl.org/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary ml-1.5 inline-flex items-center hover:underline"
                  >
                    <span className="text-xs">Learn more</span>
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
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
                description={`Peak TPS: ${peakTPS.toFixed(2)}`}
                icon={Activity}
                trend={transactionsPerMinute > 0 ? { value: 3.7, isPositive: true } : undefined}
              />
              <StatCard
                title="XRP Volume"
                value={`${totalXRPVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })} XRP`}
                description={largestTransaction ? `Largest: ${largestTransaction.amount.toLocaleString()} XRP` : "Tracking largest transaction"}
                icon={WalletCards}
                trend={{ value: 5.2, isPositive: true }}
              />
            </div>
            
            {/* Network Status Panel */}
            <div className="mb-6">
              <NetworkStatusPanel 
                connectionStatus={connectionStatus}
                transactionsPerMinute={transactionsPerMinute}
                uniqueAccounts={uniqueAccounts.size}
                currencies={currencies.size}
                peakTPS={peakTPS}
              />
            </div>
            
            {/* Tabs with Charts */}
            <div className="mb-6 border rounded-lg bg-card overflow-hidden">
              <Tabs defaultValue="overview" className="w-full">
                <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                  <TabsList className="bg-muted/60">
                    <TabsTrigger value="overview" className="flex items-center gap-1">
                      <LayoutDashboard className="h-3.5 w-3.5 md:mr-1" />
                      <span className="hidden md:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="volume" className="flex items-center gap-1">
                      <LineChart className="h-3.5 w-3.5 md:mr-1" />
                      <span className="hidden md:inline">Activity</span>
                    </TabsTrigger>
                    <TabsTrigger value="network" className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 md:mr-1" />
                      <span className="hidden md:inline">Network</span>
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="hidden md:flex px-2 py-1 bg-muted rounded items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Real-time</span>
                    </span>
                    <Badge variant="outline" className="h-6 bg-ripple-400/10 text-ripple-500 border-ripple-200 dark:border-ripple-800 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span>Auto-refresh</span>
                    </Badge>
                  </div>
                </div>
                
                <TabsContent value="overview" className="p-4 pt-6 m-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card className="h-full shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Transaction Activity
                          </CardTitle>
                          <CardDescription>
                            Volume analysis over the last {Math.ceil(totalPaymentCount / 10) * 10} transactions
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 h-[350px]">
                          <TransactionChart 
                            paymentCount={totalPaymentCount} 
                            offerCount={totalOfferCount} 
                          />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <TransactionStats 
                      totalPaymentCount={totalPaymentCount}
                      totalOfferCount={totalOfferCount}
                      totalXRPVolume={totalXRPVolume}
                      uniqueAccounts={uniqueAccounts.size}
                      currencies={currencies}
                      largestTransaction={largestTransaction}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="volume" className="p-4 pt-6 m-0">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Card className="lg:col-span-3 shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Volume Analysis
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                              <Filter className="h-3 w-3" />
                              <span>Filter</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                              <ArrowUpRight className="h-3 w-3" />
                              <span>Export</span>
                            </Button>
                          </div>
                        </div>
                        <CardDescription>
                          Daily transaction volume with moving averages
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground animate-pulse-gentle">
                        <div className="text-center">
                          <LineChart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                          <p>Collecting data for enhanced volume analysis...</p>
                          <p className="text-xs text-muted-foreground/70 mt-2">
                            Charts will display once sufficient data is available
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="lg:col-span-2 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Currency Distribution
                        </CardTitle>
                        <CardDescription>
                          Transaction distribution by currency
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4 h-[400px]">
                        <CurrencyPieChart currencies={currencies} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="network" className="p-4 pt-6 m-0">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Network className="h-5 w-5 text-primary" />
                          XRP Ledger Network Metrics
                        </CardTitle>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <RefreshCw className="h-3 w-3" />
                          <span>Refresh</span>
                        </Button>
                      </div>
                      <CardDescription>
                        Comprehensive overview of the XRPL Network status
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground animate-pulse-gentle">
                      <div className="text-center">
                        <Network className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <p>Network metrics visualization coming soon...</p>
                        <p className="text-xs text-muted-foreground/70 mt-2">
                          This feature is currently in development
                        </p>
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
                totalCount={totalPaymentCount}
                onRefresh={() => toast.info("Refreshing payment transactions...")}
              />
              <TransactionList
                transactions={offerTxs}
                title="Latest Offers"
                emptyMessage="No offers received yet. Waiting for data..."
                totalCount={totalOfferCount}
                onRefresh={() => toast.info("Refreshing offer transactions...")}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
