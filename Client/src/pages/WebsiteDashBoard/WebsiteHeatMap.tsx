import type { Visit } from "@/types/Visit";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDown, Filter, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type DateTimeRange = {
  start: string;
  end: string;
};

const HeatmapLayer = ({ points }: { points: number[][] }) => {
  const map = useMap();

  useEffect(() => {
    const heatLayer = (L as any).heatLayer(points, {
      radius: 40, // ⬅️ increase from 25
      blur: 25, // ⬅️ increase from 15
      maxZoom: 17,
      max: 0.8, // ⬅️ optional, controls intensity scaling
      gradient: {
        0.1: "blue",
        0.3: "lime",
        0.6: "orange",
        1.0: "red", // ⬅️ Optional custom gradient
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

const WebsiteHeatMap = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);

  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>({
    start: "",
    end: "",
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleGetVisitsOfData = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`/api/visit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setVisits(data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Cannot able to load Data";
      toast.error(message);
    }
  };

  const clearFilters = () => {
    setDateTimeRange({ start: "", end: "" });
  };

  const hasActiveFilters = dateTimeRange.start || dateTimeRange.end;

  useEffect(() => {
    handleGetVisitsOfData();
  }, []);

  const filteredVists = useMemo(() => {
    return visits.filter((visit) => {
      const visitCreatedDate = new Date(visit.visitedTime);
      const visitCloseDate = new Date(visit.closedTime);

      const startDate = dateTimeRange.start
        ? new Date(dateTimeRange.start)
        : null;
      const endDate = dateTimeRange.end ? new Date(dateTimeRange.end) : null;

      return (
        (!startDate || visitCreatedDate >= startDate) &&
        (!endDate || visitCloseDate <= endDate)
      );
    });
  }, [visits, dateTimeRange]);

  const allCoordinates = useMemo(() => {
    return filteredVists
      .filter((visit) => visit.location?.coordinates.length === 2)
      .map((visit) => [
        visit.location.coordinates[0],
        visit.location.coordinates[1],
      ]);
  }, [filteredVists, dateTimeRange]);

  return (
    <div className="w-full h-full">
      {/* Filters Section */}
      <Card className="mb-4">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Filter logs by date range and response time
                  </CardDescription>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isFiltersOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Date Time Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Date & Time Range
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="start-date"
                        className="text-xs text-muted-foreground"
                      >
                        Start Date & Time
                      </Label>
                      <Input
                        id="start-date"
                        type="datetime-local"
                        value={dateTimeRange.start}
                        onChange={(e) =>
                          setDateTimeRange((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="end-date"
                        className="text-xs text-muted-foreground"
                      >
                        End Date & Time
                      </Label>
                      <Input
                        id="end-date"
                        type="datetime-local"
                        value={dateTimeRange.end}
                        onChange={(e) =>
                          setDateTimeRange((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
                <div className="text-sm text-muted-foreground flex items-center">
                  Showing {filteredVists.length} of {visits.length} visits
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <p className="leading-7 [&:not(:first-child)]:mb-6">
        These locations are approximate and may not reflect the user's exact position, as they are derived from internet-based services.
      </p>
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <HeatmapLayer points={allCoordinates} />
      </MapContainer>
    </div>
  );
};

export default WebsiteHeatMap;
