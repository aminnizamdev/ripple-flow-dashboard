
import { Activity, BarChart2, DollarSign, Home, LifeBuoy, Settings } from "lucide-react";
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
        <div className="flex items-center gap-2 px-4 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-ripple-400"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="font-bold text-lg">Ripple Flow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild active={item.active}>
                    <a href={item.url} className={item.active ? "bg-sidebar-accent" : ""}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          <p>Ripple Flow Dashboard v1.0</p>
          <p>© 2025 All rights reserved</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
