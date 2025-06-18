import type { Visit } from "@/types/Visit";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { NumberTicker } from "@/components/ui/number-ticker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DateTimeRange = {
  start: string;
  end: string;
};

type DeviceStats = {
  mobile: number;
  tablet: number;
  desktop: number;
};

type DeviceVists = {
  device: "Desktop" | "Tablet" | "Mobile";
  visits: number;
};

type VisitsOfDate = {
  date: string;
  mobile: number;
  tablet: number;
  desktop: number;
};


const WebsiteVisits = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);

  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>({
    start: "",
    end: "",
  });

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

  function getDeviceCount(visits: Visit[]): DeviceStats {
    return {
      mobile: visits.filter((visit) => visit.deviceType === "Mobile").length,
      tablet: visits.filter((visit) => visit.deviceType === "Tablet").length,
      desktop: visits.filter((visit) => visit.deviceType === "Desktop").length,
    };
  }

  const deviceStats: DeviceVists[] = useMemo(() => {
    return [
      {
        device: "Mobile",
        visits: filteredVists.filter((visit) => visit.deviceType === "Mobile")
          .length,
      },
      {
        device: "Tablet",
        visits: filteredVists.filter((visit) => visit.deviceType === "Tablet")
          .length,
      },
      {
        device: "Desktop",
        visits: filteredVists.filter((visit) => visit.deviceType === "Desktop")
          .length,
      },
    ];
  }, [filteredVists]);

  const visitOfDate: VisitsOfDate[] = useMemo(() => {
    const visitMap = new Map<string, Visit[]>();

    for (const visit of visits) {
      const date = visit.visitedTime.split("T")[0];

      if (!visitMap.has(date)) {
        visitMap.set(date, []);
      }

      visitMap.get(date)!.push(visit);
    }

    return Array.from(visitMap.entries())
      .map(([date, visitList]) => {
        let deviceStats = getDeviceCount(visitList);

        return {
          date: date,
          mobile: deviceStats.mobile,
          tablet: deviceStats.tablet,
          desktop: deviceStats.desktop,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending (old to new)
  }, [visits]);

  const activeUsers = useMemo(() => {
    return filteredVists.filter((visit) => visit.isActive).length;
  }, [filteredVists]);

  const allCoordinates = useMemo(() => {
    return filteredVists.map((visit) => [
      visit.location.coordinates[1],
      visit.location.coordinates[0],
    ]);
  }, [filteredVists]);

  useEffect(() => {
    console.log(allCoordinates);
  }, [allCoordinates]);

  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = useMemo(() => {
    if (visitOfDate.length === 0) return [];

    // Get the current date or the latest date from your data
    const today = new Date();

    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    // Calculate the start date based on current date
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return visitOfDate
      .filter((item) => {
        const date = new Date(item.date);
        return date >= startDate && date <= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [visitOfDate, timeRange]);

  const visitsOfDifferntDeviceConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "Desktop",
      color: "#2563eb", // Blue-600
    },
    tablet: {
      label: "Tablet",
      color: "#7c3aed", // Violet-600
    },
    mobile: {
      label: "Mobile",
      color: "#dc2626", // Red-600
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full md:max-w-6xl mx-auto mb-10 space-y-4 flex flex-col items-center">
      <p className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-black dark:text-white">
        {activeUsers > 0 ? <NumberTicker value={activeUsers} /> : "0"}
      </p>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Active Users
      </h3>

      <Card className="pt-0 w-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Specific device Visits</CardTitle>
            <CardDescription>
              {`Showing total visitors for the last ${
                timeRange === "7d"
                  ? "7 Days"
                  : timeRange === "30d"
                  ? "1 Month"
                  : "3 Months"
              } using different
              devices`}
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={visitsOfDifferntDeviceConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillTablet" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-tablet)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-tablet)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="tablet"
                type="natural"
                fill="url(#fillTablet)"
                stroke="var(--color-tablet)"
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

     
    </div>
  );
};

export default WebsiteVisits;
