
import { Badge } from "@/components/ui/badge";
import { Bell, ExternalLink, HelpCircle, Menu, RefreshCw, Search, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader({ connectionStatus }: { connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' }) {
  return (
    <header className="sticky top-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <div className="h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
          <div className="flex-1 flex items-center md:w-64 lg:w-72">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search transactions..." 
                className="pl-9 bg-muted/40 border-muted focus-visible:bg-background h-9" 
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-3">
          <div className="hidden md:flex items-center gap-1">
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
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
              )}
              <span className="font-medium">
                {connectionStatus === 'connected' ? 'Live' : 
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 'Offline'}
              </span>
            </Badge>
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
              Network: <span className="font-medium text-foreground">Mainnet</span>
            </span>
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
              Last Block: <span className="font-medium text-green-600">76542810</span>
            </span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Help & Resources</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>Documentation</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>About XRPL</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-ripple-400 animate-pulse-gentle"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 p-1.5 rounded-full dark:bg-blue-900/30">
                      <RefreshCw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Connection Established</p>
                      <p className="text-xs text-muted-foreground">Successfully connected to XRPL</p>
                    </div>
                    <span className="text-xs text-muted-foreground">5m ago</span>
                  </div>
                </div>
                <div className="p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 p-1.5 rounded-full dark:bg-green-900/30">
                      <RefreshCw className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Large Transaction Detected</p>
                      <p className="text-xs text-muted-foreground">10,000 XRP payment processed</p>
                    </div>
                    <span className="text-xs text-muted-foreground">15m ago</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 p-1.5 rounded-full dark:bg-amber-900/30">
                      <RefreshCw className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System Update</p>
                      <p className="text-xs text-muted-foreground">Dashboard updated to v2.0</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1h ago</span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" className="w-full">View All</Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 hidden md:flex text-xs h-8">
                <User className="h-3.5 w-3.5" />
                <span>Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
