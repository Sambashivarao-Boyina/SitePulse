import type { WebsiteInterface } from "@/interfaces/Website";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { ChartBar, Edit2, Home, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  CustomSidebarProvider,
} from "./WebisteDashBoardSidebar";
import WebsiteDashBoardSidebar from "./WebisteDashBoardSidebar";
import WebsiteDetails from "./WebsiteDetails";
import { Skeleton } from "@/components/ui/skeleton";



const WebsiteDashBoard = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [websiteDetails, setWebsiteDetails] = useState<WebsiteInterface | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Menu items data
  const menuItems = [
    { title: "Details", href: "details", icon: Home },
    { title: "Edit", href: "edit", icon: Edit2 },
    { title: "Visitors", href: "visitors", icon: Users },
    { title: "Analytics", href: "analytics", icon: ChartBar },
    { title: "Delete", href: "delete", icon: Trash2 },
  ];

  const getDataOfWebsite = async () => {
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
      toast.error("Cannot able to load data");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getDataOfWebsite();
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
    // Parent container with specific height - sidebar will take only this height
    <div className="w-full h-[calc(100vh-4rem)]">
      {" "}
      {/* Adjust height as needed */}
      <CustomSidebarProvider>
        <WebsiteDashBoardSidebar
          name={websiteDetails.name}
          logo={websiteDetails.logo}
          menuItems={menuItems}
        />
        <Routes>
          {/* 👇 Default route when user visits /websites/:id */}
          <Route index element={<WebsiteDetails/>} />

          {/* 👇 Relative paths (no leading slash) */}
          <Route path="details" element={<WebsiteDetails/>} />
          <Route path="edit" element={<p>edit</p>} />
          <Route path="visitors" element={<p>visitors</p>} />
          <Route path="analytics" element={<p>analytics</p>} />
          <Route path="delete" element={<p>delete</p>} />
        </Routes>
      </CustomSidebarProvider>
    </div>
  );
};

export default WebsiteDashBoard;
