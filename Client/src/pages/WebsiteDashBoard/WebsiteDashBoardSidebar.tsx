import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type WebsiteDashBoardProps = {
  name: string;
  logo: string;
  menuItems: MenuItem[];
};

const WebsiteDashBoardSidebar: React.FC<WebsiteDashBoardProps> = ({
  name,
  logo,
  menuItems,
}) => {
  return (
    <Sidebar className="mt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center gap-2 px-3 py-8">
              <img className="h-6 w-6" src={logo} />
              <p className="text-lg capitalize">{name}</p>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item: MenuItem) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <item.icon className="text-blue-600" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default WebsiteDashBoardSidebar;
