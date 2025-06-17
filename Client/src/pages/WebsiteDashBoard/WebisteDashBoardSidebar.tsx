import React, { createContext, useContext, useState } from "react";
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// Context for sidebar state
interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Custom Sidebar Provider
export function CustomSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <div className="flex h-full w-full">{children}</div>
    </SidebarContext.Provider>
  );
}

// Hook to use sidebar context
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a CustomSidebarProvider");
  }
  return context;
}

// Custom Sidebar Trigger
export function CustomSidebarTrigger() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="h-6 w-6 md:h-8 md:w-8"
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </Button>
  );
}

// Custom Sidebar Component
interface CustomSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function CustomSidebar({ children, className }: CustomSidebarProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300 ease-in-out h-full",
        isCollapsed ? "w-10 md:w-16" : "w-64",
        className
      )}
    >
      {children}
    </div>
  );
}

// Custom Sidebar Content
export function CustomSidebarContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col flex-1 overflow-hidden">{children}</div>;
}

// Custom Sidebar Header
export function CustomSidebarHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      {children}
    </div>
  );
}

// Custom Sidebar Group
interface CustomSidebarGroupProps {
  children: React.ReactNode;
  label?: string;
}

export function CustomSidebarGroup({
  children,
  label,
}: CustomSidebarGroupProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="px-3 py-2">
      {label && !isCollapsed && (
        <h4 className="mb-2 px-2 text-sm font-medium text-muted-foreground">
          {label}
        </h4>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

// Custom Sidebar Menu Item
interface CustomSidebarMenuItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  href: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function CustomSidebarMenuItem({
  icon: Icon,
  title,
  href,
  onClick,
  isActive = false,
}: CustomSidebarMenuItemProps) {
  const { isCollapsed } = useSidebar();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  const { id } = useParams();

  const content = (
    <Link to={`/websites/${id}/${href}`}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 px-3 py-2 h-auto",
          isCollapsed && "justify-center px-2"
        )}
        onClick={handleClick}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!isCollapsed && <span className="truncate">{title}</span>}
      </Button>
    </Link>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}


interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface WebisteDashBoardSidebarProps{
  logo: string,
  name: string,
  menuItems: MenuItem[]
}

// Main Custom Sidebar Component
const WebsiteDashBoardSidebar: React.FC<WebisteDashBoardSidebarProps> = ({name, logo, menuItems}) => {
  const [activeItem, setActiveItem] = useState("Home");
  const { isCollapsed } = useSidebar();

  return (
    <CustomSidebar className="h-full flex flex-col">
      <CustomSidebarContent>
        <CustomSidebarHeader>
          <div className="w-full flex flex-row items-center justify-evenly">
            <CustomSidebarTrigger />
            {!isCollapsed && (
              <div className="flex items-center gap-4">
                <div className="">{name}</div>
                <Avatar className="h-5 w-5">
                  <AvatarImage src={logo} alt="@shadcn" />
                </Avatar>
              </div>
            )}
          </div>
        </CustomSidebarHeader>

        <div className="flex-1 overflow-y-auto">
          <CustomSidebarGroup>
            {menuItems.map((item) => (
              <CustomSidebarMenuItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                href={item.href}
                isActive={activeItem === item.title}
                onClick={() => setActiveItem(item.title)}
              />
            ))}
          </CustomSidebarGroup>
        </div>
      </CustomSidebarContent>
      <div className="flex-1"></div>
    </CustomSidebar>
  );
}

export default WebsiteDashBoardSidebar;


