import type { Visit } from "@/types/Visit";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type {
  ChartConfig
} from "@/components/ui/chart"
import { NumberTicker } from "@/components/ui/number-ticker";
import { TrendingUp } from "lucide-react";


type DateTimeRange = {
  start: string;
  end: string;
};

type DeviceStats = {
  mobile: number;
  tablet: number;
  desktop: number;
};

type VisitsOfDate = {
  date: string,
  visits: number
}

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

  const handleClearFilters = () => {
    setDateTimeRange({
      start: "",
      end: "",
    });
  };

  useEffect(() => {
    handleGetVisitsOfData();
  }, []);

  const filteredVists = useMemo(() => {
    return visits.filter((visit) => {
      const visitCreatedDate = new Date(visit.visitedTime);
      const visitCloseDate = new Date(visit.closeTime);

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

  const deviceStats: DeviceStats = useMemo(() => {
    return {
      mobile: filteredVists.filter((visit) => visit.deviceType === "Mobile")
        .length,
      tablet: filteredVists.filter((visit) => visit.deviceType === "Tablet")
        .length,
      desktop: filteredVists.filter((visit) => visit.deviceType === "Desktop")
        .length,
    };
  }, [filteredVists]);

  const visitOfDate: VisitsOfDate[] = useMemo(() => {
    const visitMap = new Map<string, number>();

    for (const visit of visits) {
      // Parse ISO string and extract YYYY-MM-DD
      const date = visit.visitedTime.split("T")[0];
      visitMap.set(date, (visitMap.get(date) || 0) + 1);
    }

    return Array.from(visitMap.entries()).map(([date, count]) => ({
      date,
      visits: count,
    }));
  },[filteredVists])

  const activeUsers = useMemo(() => {
    return filteredVists.filter((visit) => visit.isActive).length;
  }, [filteredVists]);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full md:max-w-6xl mx-auto mb-10 space-y-4 flex flex-col items-center">
      <p className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-black dark:text-white">
        <NumberTicker value={activeUsers} />
      </p>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Active Users
      </h3>

      <Card>
        <CardHeader>
          <CardTitle>Line Chart</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={visitOfDate}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="date"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      
      </Card>
    </div>
  );
};

export default WebsiteVisits;
