import type { WebsiteInterface } from "@/interfaces/Website";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import WebsiteCard from "./WebsiteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Globe,
  RefreshCw,
  Filter,
  Activity,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const WebsitesList = () => {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<WebsiteInterface[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<WebsiteInterface[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Active" | "Deactive"
  >("all");

  const loadWebsites = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();

      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await axios.get("/api/website", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWebsites(response.data);
      setFilteredWebsites(response.data);
    } catch (error) {
      toast.error("Unable to load websites");
    } finally {
      setIsLoading(false);
    }
  };

 

  const handleVisitWebsite = (url: string) => {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(formattedUrl, "_blank");
  };

  // Filter websites based on search and status
  useEffect(() => {
    let filtered = websites;

    if (searchQuery) {
      filtered = filtered.filter(
        (website) =>
          website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          website.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((website) => website.status === statusFilter);
    }

    setFilteredWebsites(filtered);
  }, [websites, searchQuery, statusFilter]);

  useEffect(() => {
    loadWebsites();
  }, []);

  const activeCount = websites.filter((w) => w.status === "Active").length;
  const inactiveCount = websites.filter((w) => w.status === "Deactive").length;

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EmptyState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No websites found</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {searchQuery || statusFilter !== "all"
            ? "Try adjusting your search or filter criteria"
            : "Get started by adding your first website to monitor"}
        </p>
        {!searchQuery && statusFilter === "all" && (
          <Link to="/add-website">
            <Button className="bg-violet-500 hover:bg-violet-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Website
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Website Monitor
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage your websites in one place
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadWebsites}
                disabled={isLoading}
                className="shrink-0"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Link to="/add-website">
                <Button size="sm" className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add Website</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
            
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Websites
                    </p>
                    <p className="text-2xl font-bold">{websites.length}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Active
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {activeCount}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Inactive
                    </p>
                    <p className="text-2xl font-bold">{inactiveCount}</p>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search websites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">
                          {statusFilter === "all" ? "All Status" : statusFilter}
                        </span>
                        <span className="sm:hidden">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("Active")}
                      >
                        Active Only
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("Deactive")}
                      >
                        Inactive Only
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {(searchQuery || statusFilter !== "all") && (
                    <Badge variant="secondary" className="shrink-0">
                      {filteredWebsites.length}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredWebsites.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {filteredWebsites.map((website) => (
              <WebsiteCard
                key={website._id}
                website={website}
                onVisit={handleVisitWebsite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsitesList;
