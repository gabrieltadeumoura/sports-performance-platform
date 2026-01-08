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
} from '@/components/ui/sidebar';
import {
  Activity,
  Eye,
  Gauge,
  HeartPlus,
  Home,
  Settings,
  Users,
} from 'lucide-react';

import Link from 'next/link';

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Athletes',
    url: '/athletes',
    icon: Users,
  },
  {
    title: 'Injury Records',
    url: '/injury-records',
    icon: HeartPlus,
  },
  {
    title: 'ProScout AI',
    url: '/proscout',
    icon: Eye,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-green-500">
                  <Activity className="text-black h-4 w-4" />
                </div>
                <span className="font-semibold text-base">Fisio Dev</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Performance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
