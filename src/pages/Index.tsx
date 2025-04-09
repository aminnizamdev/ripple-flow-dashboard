
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TransactionList } from "@/components/TransactionList";
import { StatCard } from "@/components/StatCard";
import { TransactionChart } from "@/components/TransactionChart";
import { CurrencyPieChart } from "@/components/CurrencyPieChart";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Activity, DollarSign, TrendingUp, WalletCards } from "lucide-react";
import { initializeRippleWebsocket } from "@/lib/ripple-websocket";
import { formatAmount } from "@/lib/ripple-websocket";
import { toast } from "sonner";

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
  
  // State for connection status
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  
  // State for currency data
  const [currencies, setCurrencies] = useState<Map<string, number>>(new Map());
  
  // Calculate transactions per minute
  useEffect(() => {
    const interval = setInterval(() => {
      const minuteAgo = Date.now() - 60000;
      
      const recentPayments = paymentTxs.filter(tx => 
        tx.date && ((tx.date + 946684800) * 1000) > minuteAgo
      ).length;
      
      const recentOffers = offerTxs.filter(tx => 
        tx.date && ((tx.date + 946684800) * 1000) > minuteAgo
      ).length;
      
      setTransactionsPerMinute(recentPayments + recentOffers);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [paymentTxs, offerTxs]);
  
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
      
      // Update XRP volume if applicable
      if (tx.Amount) {
        try {
          let xrpAmount = 0;
          if (typeof tx.Amount === 'string') {
            xrpAmount = parseInt(tx.Amount) / 1000000.0;
          } else if (tx.Amount.currency === 'XRP') {
            xrpAmount = parseFloat(tx.Amount.value);
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
  }, []);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1">
          <DashboardHeader />
          
          <main className="container px-4 py-6 md:px-6 md:py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Ripple Flow Dashboard</h1>
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
                value={totalPaymentCount}
                description="Total payments recorded"
                icon={DollarSign}
                trend={{ value: 3.2, isPositive: true }}
              />
              <StatCard
                title="Offer Transactions"
                value={totalOfferCount}
                description="Total offers created"
                icon={TrendingUp}
                trend={{ value: 1.5, isPositive: true }}
              />
              <StatCard
                title="Transaction Rate"
                value={`${transactionsPerMinute}/min`}
                description="Transactions in the last minute"
                icon={Activity}
                trend={transactionsPerMinute > 0 ? { value: 2.8, isPositive: true } : undefined}
              />
              <StatCard
                title="XRP Volume"
                value={`${totalXRPVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })} XRP`}
                description="Total XRP transferred"
                icon={WalletCards}
                trend={{ value: 4.3, isPositive: true }}
              />
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <TransactionChart 
                paymentCount={totalPaymentCount} 
                offerCount={totalOfferCount} 
              />
              <CurrencyPieChart currencies={currencies} />
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
