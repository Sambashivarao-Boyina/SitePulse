// WebsiteDashBoard.tsx - Solution 1
import type { Website } from "@/types/Website";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { ChartBar, Home, Logs, Map, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { toast } from "sonner";

import WebsiteDetails from "./WebsiteDetails";
import { Skeleton } from "@/components/ui/skeleton";
import WebsiteLogs from "./WebsiteLogs";
import WebsiteVisits from "./WebsiteVisits";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import WebsiteDashBoardSidebar from "./WebsiteDashBoardSidebar";
import WebsiteHeatMap from "./WebsiteHeatMap";
import WebsiteLiveStatsBadge from "./WebsiteLiveStatsBadge";
import WebsiteDelete from "./WebsiteDelete";
import { getSocket } from "@/hooks/socket";

const WebsiteDashBoard = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [websiteDetails, setWebsiteDetails] = useState<Website | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    { title: "Details", href: `/websites/${id}/details`, icon: Home },
    { title: "Logs", href: `/websites/${id}/logs`, icon: Logs },
    { title: "Visitors", href: `/websites/${id}/visitors`, icon: Users },
    { title: "HeatMap", href: `/websites/${id}/heatmap`, icon: Map },
    {
      title: "Live Stats Badge",
      href: `/websites/${id}/badge`,
      icon: ChartBar,
    },
    { title: "Delete", href: `/websites/${id}/delete`, icon: Trash2 },
  ];

  const getDataOfWebsite = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`/api/website/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setWebsiteDetails(data);
    } catch (error) {
      console.error("Error loading website data:", error);
      toast.error("Cannot able to load data");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getDataOfWebsite();
  }, [id]);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("websiteUpdate", (data) => {
        setWebsiteDetails(data);
      });
    }
    return () => {
      socket?.off("websiteUpdate");
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2 lg:p-4 w-full h-[calc(100vh-4rem)]">
        <Skeleton className="h-full w-10 md:w-56" />
        <div className="flex-1 flex flex-col h-full p-4 gap-4">
          <Skeleton className="w-1/3 h-20" />
          <Skeleton className="w-5/6 h-20" />
          <Skeleton className="w-2/3 h-20" />
        </div>
      </div>
    );
  }

  if (websiteDetails == null) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)]">
        <p>Data is not loaded</p>
      </div>
    );
  }

  return (
    // Adjust the container to account for navbar height
    <div className="w-full h-[calc(100vh-4rem)]">
      <SidebarProvider>
        <WebsiteDashBoardSidebar
          name={websiteDetails.name}
          logo={websiteDetails.logo}
          menuItems={menuItems}
        />
        <main className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b">
            <SidebarTrigger />
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <Routes>
              <Route index element={<WebsiteDetails />} />
              <Route path="details" element={<WebsiteDetails />} />
              <Route path="logs" element={<WebsiteLogs />} />
              <Route path="visitors" element={<WebsiteVisits />} />
              <Route path="heatmap" element={<WebsiteHeatMap />} />
              <Route path="badge" element={<WebsiteLiveStatsBadge />} />
              <Route
                path="delete"
                element={<WebsiteDelete website={websiteDetails} />}
              />
            </Routes>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default WebsiteDashBoard;
