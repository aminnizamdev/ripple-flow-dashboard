
type RippleTransaction = {
  type: string;
  transaction: {
    TransactionType: string;
    hash?: string;
    Account?: string;
    Destination?: string;
    Amount?: string | { value: string; currency: string; issuer?: string };
    TakerPays?: string | { value: string; currency: string; issuer?: string };
    TakerGets?: string | { value: string; currency: string; issuer?: string };
    Fee?: string;
    date?: number;
    [key: string]: any;
  };
  [key: string]: any;
};

type RippleResponse = {
  status?: string;
  type?: string;
  [key: string]: any;
};

type WebSocketMessage = RippleTransaction | RippleResponse;

type TransactionCallback = (transaction: RippleTransaction["transaction"]) => void;

const WS_URL = "wss://s1.ripple.com:443";

const SUBSCRIBE_CMD = {
  command: "subscribe",
  streams: ["transactions"]
};

export function formatAmount(amount: string | { value: string; currency: string; issuer?: string }): string {
  if (typeof amount === "string") {
    try {
      return `${parseInt(amount) / 1000000.0} XRP`;
    } catch (error) {
      return "Invalid XRP amount";
    }
  } else if (amount && typeof amount === "object") {
    return `${amount.value || "Unknown"} ${amount.currency || "Unknown"}`;
  }
  return "Unknown amount";
}

export function formatDate(rippleTimestamp?: number): string {
  if (!rippleTimestamp) return "Unknown date";
  // Ripple timestamps are seconds since the Ripple Epoch (Jan 1, 2000 UTC)
  // Need to add Ripple epoch offset to convert to Unix timestamp (seconds since Jan 1, 1970)
  const RIPPLE_EPOCH_OFFSET = 946684800;
  const date = new Date((rippleTimestamp + RIPPLE_EPOCH_OFFSET) * 1000);
  return date.toLocaleString();
}

export function initializeRippleWebsocket(
  onPayment: TransactionCallback,
  onOfferCreate: TransactionCallback,
  onOtherTransaction?: TransactionCallback
): () => void {
  let ws: WebSocket | null = null;
  let isConnected = false;
  let reconnectTimeout: number | null = null;
  
  const connect = () => {
    try {
      ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        isConnected = true;
        ws?.send(JSON.stringify(SUBSCRIBE_CMD));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          
          // Handle subscription confirmation
          if (data.status === "success" && data.type === "response") {
            console.log("Successfully subscribed to Ripple transactions");
            return;
          }
          
          // Handle transaction data
          if (data.type === "transaction") {
            const transaction = data.transaction;
            const txType = transaction.TransactionType;
            
            if (txType === "Payment") {
              onPayment(transaction);
            } else if (txType === "OfferCreate") {
              onOfferCreate(transaction);
            } else if (onOtherTransaction) {
              onOtherTransaction(transaction);
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      ws.onclose = () => {
        isConnected = false;
        // Reconnect after 5 seconds
        reconnectTimeout = window.setTimeout(() => {
          connect();
        }, 5000);
      };
    } catch (error) {
      console.error("Error initializing WebSocket:", error);
      
      // Reconnect after 5 seconds
      reconnectTimeout = window.setTimeout(() => {
        connect();
      }, 5000);
    }
  };
  
  // Initialize connection
  connect();
  
  // Return cleanup function
  return () => {
    if (ws) {
      ws.close();
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
  };
}

// Helper function to truncate addresses for display
export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
