
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
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
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import type { Visit } from "@/types/Visit";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";
import { getSocket } from "@/hooks/socket";
import { Skeleton } from "@/components/ui/skeleton";
// Helper functions to replace date-fns
const formatDate = (date: Date, formatStr: string) => {
  const options: Intl.DateTimeFormatOptions = {};
  if (formatStr.includes("MMM")) {
    options.month = "short";
  }
  if (formatStr.includes("dd")) {
    options.day = "2-digit";
  }
  if (formatStr.includes("y")) {
    options.year = "numeric";
  }
  return date.toLocaleDateString("en-US", options);
};

const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const parseISO = (dateString: string) => new Date(dateString);

const isWithinInterval = (date: Date, interval: { start: Date; end: Date }) => {
  return date >= interval.start && date <= interval.end;
};

const WebsiteVisits = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const { id } = useParams();
  const { getToken } = useAuth();
  
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [timeRange, setTimeRange] = useState("7d");

  const handleGetVisitsOfData = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetVisitsOfData();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("visitAdded", (data) => {
        setVisits((prev) => [...prev, data]);

        const visitDate = parseISO(data.visitedTime);
        setDateRange((prevRange) => {
          const from = prevRange.from ?? visitDate;
          const to = prevRange.to ?? visitDate;
          return {
            from: visitDate < from ? visitDate : from,
            to: visitDate > to ? visitDate : to,
          };
        });
      });

      socket.on("visitUpdated", (data) => {
        console.log("visitUpdated");
        console.log(data);
        setVisits((prev) => prev.map((visit) => {
          if (visit._id === data._id) {
            return data;
          } else {
            return visit;
          }
        }))
      })
    }

    return () => {
      socket?.off("visitAdded");
      socket?.off("visitUpdated");
    };
  }, []);

  // Filter visits based on date range
  const filteredVisits = useMemo(() => {
    if (dateRange == null) {
      return visits;
    }
    if (!dateRange.from || !dateRange.to) return visits;

    return visits.filter((visit) => {
      const visitDate = parseISO(visit.visitedTime);
      return isWithinInterval(visitDate, {
        start: dateRange.from!,
        end: dateRange.to!,
      });
    });
  }, [visits, dateRange]);

  // Update date range when timeRange changes
  useEffect(() => {
    const now = new Date();
    let from: Date;

    switch (timeRange) {
      case "7d":
        from = subDays(now, 7);
        break;
      case "30d":
        from = subDays(now, 30);
        break;
      case "90d":
        from = subDays(now, 90);
        break;
      default:
        from = subDays(now, 7);
    }

    setDateRange({ from, to: now });
  }, [timeRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalVisits = filteredVisits.length;
    const activeUsers = filteredVisits.filter((v) => v.isActive).length;
    const bounceRate =
      (filteredVisits.filter((v) => v.routes.length === 1).length /
        totalVisits) *
      100;

    const avgDuration =
      filteredVisits.reduce((acc, visit) => {
        const duration =
          new Date(visit.closedTime).getTime() -
          new Date(visit.visitedTime).getTime();
        return acc + duration;
      }, 0) /
      filteredVisits.length /
      1000 /
      60; // in minutes

    return {
      totalVisits,
      activeUsers,
      bounceRate: isNaN(bounceRate) ? 0 : bounceRate,
      avgDuration: isNaN(avgDuration) ? 0 : avgDuration,
    };
  }, [filteredVisits]);

  // Visits over time data
  const visitsOverTime = useMemo(() => {
    const visitMap = new Map<string, number>();

    filteredVisits.forEach((visit) => {
      const date = new Date(visit.visitedTime).toISOString().split("T")[0];
      visitMap.set(date, (visitMap.get(date) || 0) + 1);
    });

    return Array.from(visitMap.entries())
      .map(([date, visits]) => ({ date, visits }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredVisits]);

  // Device distribution data
  const deviceData = useMemo(() => {
    const deviceMap = new Map<string, number>();

    filteredVisits.forEach((visit) => {
      deviceMap.set(
        visit.deviceType,
        (deviceMap.get(visit.deviceType) || 0) + 1
      );
    });

    const colors = {
      Desktop: "#3b82f6",
      Mobile: "#ef4444",
      Tablet: "#8b5cf6",
    };

    return Array.from(deviceMap.entries()).map(([device, count]) => ({
      device,
      count,
      fill: colors[device as keyof typeof colors],
    }));
  }, [filteredVisits]);

  // Visit duration histogram
  const durationData = useMemo(() => {
    const durations = filteredVisits.map((visit) => {
      const duration =
        new Date(visit.closedTime).getTime() -
        new Date(visit.visitedTime).getTime();
      return Math.floor(duration / 1000 / 60); // in minutes
    });

    const buckets = [
      { range: "0-1 min", min: 0, max: 1 },
      { range: "1-5 min", min: 1, max: 5 },
      { range: "5-15 min", min: 5, max: 15 },
      { range: "15-30 min", min: 15, max: 30 },
      { range: "30+ min", min: 30, max: Infinity },
    ];

    return buckets.map((bucket) => ({
      range: bucket.range,
      count: durations.filter((d) => d >= bucket.min && d < bucket.max).length,
    }));
  }, [filteredVisits]);

  // Popular routes data
  const routesData = useMemo(() => {
    const routeMap = new Map<string, number>();

    filteredVisits.forEach((visit) => {
      visit.routes.forEach((route) => {
        routeMap.set(route, (routeMap.get(route) || 0) + 1);
      });
    });

    return Array.from(routeMap.entries())
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredVisits]);


  useEffect(() => {
    console.log("Route", routesData);
  },[routesData])

  const chartConfig = {
    visits: { label: "Visits", color: "#3b82f6" },
    desktop: { label: "Desktop", color: "#3b82f6" },
    mobile: { label: "Mobile", color: "#ef4444" },
    tablet: { label: "Tablet", color: "#8b5cf6" },
    count: { label: "Count", color: "#3b82f6" },
  };

  const devicesPieChartConfig = {
    device: { label: "Device Type", color: "#8884d8" }, // used for tooltip/legend
    count: { label: "Count", color: "#3b82f6" }, // used as value
  };

  const routesBarChatConfig = {
    count: { label: "Visits", color: "#3b82f6" },
  };


  if (isLoading) {
    return (
      <div className="w-full md:max-w-7xl mx-auto md:p-6 space-y-6">
        <Skeleton className="w-3/5 h-6" />
        <Skeleton className="w-4/6 h-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="w-full h-20" />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Visits Over Time */}
          <Skeleton className="col-span-1 lg:col-span-2 w-full h-60" />

          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />

          {/* Popular Routes */}
          <Skeleton className="col-span-1 lg:col-span-2 w-full h-60" />
        </div>
      </div>
    );
  }


  return (
    <div className="w-full md:max-w-7xl mx-auto md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Website Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your website visits and user behavior
          </p>
          <p className="text-muted-foreground">
            Your website visits data will be deleted automatically after 3 months of it created.
          </p>
        </div>

        {/* Time Range Controls */}
        <div className="flex flex-col items-start md:flex-row  md:items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {formatDate(dateRange.from, "MMM dd, yyyy")} -{" "}
                      {formatDate(dateRange.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    formatDate(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (!range?.from || !range?.to) return;
                  setDateRange({ from: range.from, to: range.to });
                }}
                numberOfMonths={2}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={stats.totalVisits} />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(dateRange.from || new Date(), "MMM dd")} -{" "}
              {formatDate(dateRange.to || new Date(), "MMM dd")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <NumberTicker value={stats.activeUsers} />
            </div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgDuration.toFixed(1)}m
            </div>
            <p className="text-xs text-muted-foreground">
              Average session time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.bounceRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Single page visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits Over Time */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Visits Over Time</CardTitle>
            <CardDescription>
              Daily visit trends for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={visitsOverTime}>
                <defs>
                  <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-visits)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-visits)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    formatDate(new Date(value), "MMM dd")
                  }
                />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) =>
                    formatDate(new Date(value), "MMM dd, yyyy")
                  }
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="var(--color-visits)"
                  fillOpacity={1}
                  fill="url(#fillVisits)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Visits by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={devicesPieChartConfig}
              className="h-[300px] w-full"
            >
              <PieChart>
                <Pie
                  data={deviceData}
                  dataKey="count" // value
                  nameKey="device" // label
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              {deviceData.map((item) => (
                <div key={item.device} className="flex items-center gap-2">
                  {item.device === "Desktop" && <Monitor className="h-4 w-4" />}
                  {item.device === "Mobile" && (
                    <Smartphone className="h-4 w-4" />
                  )}
                  {item.device === "Tablet" && <Tablet className="h-4 w-4" />}
                  <Badge variant="secondary">
                    {item.device}: {item.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visit Duration */}
        <Card>
          <CardHeader>
            <CardTitle>Visit Duration</CardTitle>
            <CardDescription>Distribution of session lengths</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Popular Routes */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Popular Routes (Line Chart)</CardTitle>
            <CardDescription>
              Most visited pages on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={routesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="route"
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={70}
                  stroke="#94a3b8"
                  className="hidden"
                />
                <YAxis stroke="#94a3b8" />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `Route: ${label}`}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteVisits;


