
import { Activity, BarChart2, DollarSign, Home, LifeBuoy, Settings, Zap, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "#",
      active: true,
    },
    {
      title: "Transactions",
      icon: Activity,
      url: "#",
    },
    {
      title: "Analytics",
      icon: BarChart2,
      url: "#",
    },
    {
      title: "Currency Pairs",
      icon: DollarSign,
      url: "#",
    },
    {
      title: "Live Monitor",
      icon: Zap,
      url: "#",
      badge: "New",
    },
  ];

  const utilityItems = [
    {
      title: "Settings",
      icon: Settings,
      url: "#",
    },
    {
      title: "Help",
      icon: LifeBuoy,
      url: "#",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex justify-start">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="p-1.5 bg-ripple-400 rounded-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-md leading-tight">Ripple Flow</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">Real-time Analytics</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <a href={item.url} className={`flex justify-between ${item.active ? "bg-sidebar-accent" : ""}`}>
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-ripple-400 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {!item.badge && <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-70 transition-opacity" />}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex justify-between group">
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-70 transition-opacity" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-3 bg-sidebar-accent/50 rounded-lg mx-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-muted-foreground">Connected to Ripple Network</p>
          </div>
          <div className="text-xs mt-1.5 font-medium">
            <p className="text-ripple-500">v1.0 | Tracking: <span className="text-green-600">Active</span></p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
