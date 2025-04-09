
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, CheckCircle, Clock, Database, HardDrive, 
  Layers, Network, RefreshCw, Server, Shield, Terminal, WifiOff 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NetworkStatusPanelProps {
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  transactionsPerMinute: number;
  uniqueAccounts: number;
  currencies: number;
  peakTPS: number;
}

export function NetworkStatusPanel({
  connectionStatus,
  transactionsPerMinute,
  uniqueAccounts,
  currencies,
  peakTPS
}: NetworkStatusPanelProps) {
  // Mock server data for the visualization
  const servers = [
    { id: 1, name: "s1.ripple.com", status: "online", version: "1.9.4", uptime: "99.8%", load: "moderate" },
    { id: 2, name: "s2.ripple.com", status: "online", version: "1.9.4", uptime: "99.9%", load: "high" },
    { id: 3, name: "validator1.ripple.com", status: "online", version: "1.9.4", uptime: "100%", load: "low" },
    { id: 4, name: "xrplcluster.com", status: "online", version: "1.9.3", uptime: "99.7%", load: "moderate" },
  ];
  
  // Generate random ledger data
  const ledgers = Array.from({ length: 5 }).map((_, i) => ({
    id: 76540000 + i,
    hash: `${Math.random().toString(36).substring(2, 10)}...`,
    txCount: Math.floor(Math.random() * 50) + 5,
    time: new Date(Date.now() - (i * 4000)).toLocaleTimeString(),
    size: `${(Math.random() * 0.5 + 0.1).toFixed(2)} MB`,
  })).reverse();
  
  // Mock validator data
  const validators = [
    { name: "Ripple", validations: "99.8%", agreement: "100%", status: "trusted" },
    { name: "Gatehub", validations: "99.7%", agreement: "99.9%", status: "trusted" },
    { name: "Coinbase", validations: "99.9%", agreement: "99.8%", status: "trusted" },
    { name: "Bitso", validations: "99.5%", agreement: "99.7%", status: "trusted" },
  ];
  
  return (
    <Card className="overflow-hidden animate-in fade-in duration-500">
      <CardHeader className="bg-muted/30 pb-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              XRP Ledger Network Status
            </CardTitle>
            <CardDescription>
              Real-time status of the XRP Ledger network
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`px-2.5 py-1 text-xs flex items-center gap-1 ${
              connectionStatus === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
              connectionStatus === 'connecting' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {connectionStatus === 'connected' && (
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              )}
              {connectionStatus === 'connecting' && (
                <RefreshCw className="h-3 w-3 animate-spin" />
              )}
              {(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
                <WifiOff className="h-3 w-3" />
              )}
              <span className="font-medium">
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 'Disconnected'}
              </span>
            </Badge>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-3">
        <Tabs defaultValue="overview">
          <TabsList className="mb-2 bg-muted/60">
            <TabsTrigger value="overview" className="text-xs">
              <Activity className="h-3.5 w-3.5 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="servers" className="text-xs">
              <Server className="h-3.5 w-3.5 mr-1" />
              Servers
            </TabsTrigger>
            <TabsTrigger value="ledgers" className="text-xs">
              <Database className="h-3.5 w-3.5 mr-1" />
              Recent Ledgers
            </TabsTrigger>
            <TabsTrigger value="validators" className="text-xs">
              <Shield className="h-3.5 w-3.5 mr-1" />
              Validators
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" />
                  Network Activity
                </h3>
                <div className="space-y-2 bg-muted/30 rounded-md p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-card rounded-md p-2 text-center shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">TPS</p>
                      <p className="text-lg font-semibold">{(transactionsPerMinute / 60).toFixed(2)}</p>
                    </div>
                    <div className="bg-card rounded-md p-2 text-center shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">Peak TPS</p>
                      <p className="text-lg font-semibold">{peakTPS.toFixed(2)}</p>
                    </div>
                    <div className="bg-card rounded-md p-2 text-center shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">TX/min</p>
                      <p className="text-lg font-semibold">{transactionsPerMinute}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-card rounded-md p-2 text-center shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">Accounts</p>
                      <p className="text-lg font-semibold">{uniqueAccounts.toLocaleString()}</p>
                    </div>
                    <div className="bg-card rounded-md p-2 text-center shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">Currencies</p>
                      <p className="text-lg font-semibold">{currencies}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-1.5">
                  <HardDrive className="h-4 w-4 text-primary" />
                  Network Health
                </h3>
                <div className="bg-muted/30 rounded-md p-3">
                  <div className="space-y-2">
                    <div className="bg-card rounded-md p-2 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Network Status</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Operational
                      </Badge>
                    </div>
                    
                    <div className="bg-card rounded-md p-2 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Current Ledger</span>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        76542810
                      </Badge>
                    </div>
                    
                    <div className="bg-card rounded-md p-2 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Last Close Time</span>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        3.98s
                      </Badge>
                    </div>
                    
                    <div className="bg-card rounded-md p-2 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Version</span>
                      </div>
                      <Badge variant="outline">
                        1.9.4
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="servers" className="m-0">
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Server</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Load</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell className="font-medium">{server.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          {server.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{server.version}</TableCell>
                      <TableCell>{server.uptime}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          server.load === "low" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                          server.load === "moderate" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }>
                          {server.load}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="ledgers" className="m-0">
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ledger</TableHead>
                    <TableHead>Hash</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgers.map((ledger) => (
                    <TableRow key={ledger.id}>
                      <TableCell className="font-medium">{ledger.id}</TableCell>
                      <TableCell className="font-mono text-xs">{ledger.hash}</TableCell>
                      <TableCell>{ledger.txCount}</TableCell>
                      <TableCell>{ledger.time}</TableCell>
                      <TableCell>{ledger.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="validators" className="m-0">
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Validator</TableHead>
                    <TableHead>Validations</TableHead>
                    <TableHead>UNL Agreement</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validators.map((validator, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{validator.name}</TableCell>
                      <TableCell>{validator.validations}</TableCell>
                      <TableCell>{validator.agreement}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          {validator.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
