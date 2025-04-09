
import { Bell, Menu, Search, User, HelpCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
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
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
              Network: <span className="font-medium text-foreground">Mainnet</span>
            </span>
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
              Last Block: <span className="font-medium text-green-600">76542810</span>
            </span>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-ripple-400 animate-pulse-gentle"></span>
          </Button>
          <ThemeToggle />
          <Button variant="outline" size="sm" className="gap-2 hidden md:flex text-xs h-8">
            <User className="h-3.5 w-3.5" />
            <span>Account</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
