import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  VisibilityState,
  SortingState,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  X,
  Loader,
  Trash,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Status } from "@/types/Status";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { ChartConfig } from "@/components/ui/chart";
import { getSocket } from "@/hooks/socket";
import { Skeleton } from "@/components/ui/skeleton";
interface DateTimeRange {
  start: string;
  end: string;
}

interface ResponseTimeRange {
  min: number;
  max: number;
}

const WebsiteLogs = () => {
  const { id } = useParams();
  const { getToken } = useAuth();

  const [logs, setLogs] = useState<Status[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isDeleteingLogs, setIsDetelingLogs] = useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true }, // Default sort by createdAt in descending order (newest first)
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Filter states
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>({
    start: "",
    end: "",
  });
  const [responseTimeRange, setResponseTimeRange] = useState<ResponseTimeRange>(
    {
      min: 0,
      max: 10000,
    }
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("newStatus", (data) => {
        setLogs((prev) => [...prev, data]);
      });
    }
    return () => {
      socket?.off("newStatus");
    };
  }, []);

  function formatDateTime(isoString: string): string {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Convert 0 to 12 for 12 AM

    const formattedHours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} : ${formattedHours}:${minutes} ${ampm}`;
  }

  const handleDeleteSelectedLogs = async () => {
    setIsDetelingLogs(true);
    try {
     
      const token = await getToken();
      const response = await axios.delete(`/api/status/${id}`, {
        data: {
          ids: table.getSelectedRowModel().rows.map((row) => row.id),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response).data;

      setLogs(data);
      toast.success("Deleted Successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Something went wrong try again";
      toast.error(message);
    }
    setIsDetelingLogs(false);
  };

  // Filter logs based on date-time and response time ranges
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Date-time filter
      const logDate = new Date(log.createdAt);
      const startDate = dateTimeRange.start
        ? new Date(dateTimeRange.start)
        : null;
      const endDate = dateTimeRange.end ? new Date(dateTimeRange.end) : null;

      const isWithinDateRange =
        (!startDate || logDate >= startDate) &&
        (!endDate || logDate <= endDate);

      // Response time filter
      const isWithinResponseTimeRange =
        log.responseTime >= responseTimeRange.min &&
        log.responseTime <= responseTimeRange.max;

      return isWithinDateRange && isWithinResponseTimeRange;
    });
  }, [logs, dateTimeRange, responseTimeRange]);

  function getStatusCode(status: number): string {
    if (status < 299) {
      return "bg-green-500";
    } else if (status < 399) {
      return "bg-yellow-500";
    } else if (status < 499) {
      return "bg-orange-500";
    } else {
      return "bg-red-500";
    }
  }

  const columns: ColumnDef<Status, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "websiteStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("websiteStatus") as string;
        return (
          <Badge
            className={`text-white capitalize ${
              status === "up" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "statusCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            <span className="sr-only sm:not-sr-only">Status Code</span>
            <span className="sm:hidden">Code</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const statusCode = row.getValue("statusCode") as number;
        return (
          <Badge className={`${getStatusCode(statusCode)} text-white`}>
            {statusCode}
          </Badge>
        );
      },
    },
    {
      accessorKey: "responseTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            <span className="sr-only sm:not-sr-only">Response Time</span>
            <span className="sm:hidden">Time</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-left w-full font-medium ">
          {row.getValue("responseTime")}ms
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Checked At",
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="sm:hidden">
            {formatDateTime(row.getValue("createdAt"))
              .split(" : ")
              .map((part, index) => (
                <div
                  key={index}
                  className={
                    index === 0 ? "font-medium" : "text-muted-foreground"
                  }
                >
                  {part}
                </div>
              ))}
          </div>
          <div className="hidden sm:block">
            {formatDateTime(row.getValue("createdAt"))}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "errorMessage",
      header: "Error",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.getValue("errorMessage") ? (
            <Dialog>
              <DialogTrigger asChild>
                <AlertTriangle  className="text-red-600 cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <div className="border border-red-200 dark:border-red-800 bg-red-50 mt-4 dark:bg-red-950 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-red-800 dark:text-red-200 text-sm">
                      <strong>Error:</strong> {row.getValue("errorMessage")}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredLogs,
    columns,
    getRowId: (row) => row._id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleLoadLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const token = await getToken();
      const response = await axios.get(`/api/status/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setLogs(data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Cannot able to Load Logs";
      toast.error(message);
    }
    setIsLoadingLogs(false);
  };

  const clearFilters = () => {
    setDateTimeRange({ start: "", end: "" });
    setResponseTimeRange({ min: 0, max: 10000 });
  };

  const hasActiveFilters =
    dateTimeRange.start ||
    dateTimeRange.end ||
    responseTimeRange.min > 0 ||
    responseTimeRange.max < 10000;

  useEffect(() => {
    handleLoadLogs();
  }, []);

  //response time chat
  const responseTimeChartConfig = {
    responseTime: {
      label: "ResponseTime",
      color: "#2563eb",
    },
    createdAt: {
      label: "CreatedAt",
    },
  } satisfies ChartConfig;

  if (isLoadingLogs) {
    return (
      <div className="h-full w-full flex justify-center p-2">
        <div className="w-full md:max-w-6xl mx-auto mb-10 space-y-4 flex flex-col gap-5">
          <Skeleton className="w-full h-20 " />

          <Skeleton className="w-full h-5 " />

          <div className="w-full flex flex-col gap-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-6" />
            ))}
          </div>

          <Skeleton className="w-full h-60" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex justify-center p-2">
      <div className="w-full md:max-w-6xl mx-auto mb-10 space-y-4">
        {/* Filters Section */}
        <Card>
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

                  {/* Response Time Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Response Time Range (ms)
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="min-response"
                          className="text-xs text-muted-foreground"
                        >
                          Min Response Time
                        </Label>
                        <Input
                          id="min-response"
                          type="number"
                          min="0"
                          value={responseTimeRange.min}
                          onChange={(e) =>
                            setResponseTimeRange((prev) => ({
                              ...prev,
                              min: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="max-response"
                          className="text-xs text-muted-foreground"
                        >
                          Max Response Time
                        </Label>
                        <Input
                          id="max-response"
                          type="number"
                          min="0"
                          value={responseTimeRange.max}
                          onChange={(e) =>
                            setResponseTimeRange((prev) => ({
                              ...prev,
                              max: parseInt(e.target.value) || 10000,
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
                    Showing {filteredLogs.length} of {logs.length} logs
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="sm:hidden"
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0" />
                )}
              </Button>
            </div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We monitor your website for every 5 minutes and calcuate the
              response time.
            </p>
            <div className="flex items-center gap-2 ml-auto">
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      Delete Selected Rows
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Trash className="h-5 w-5 text-red-600" />
                        Delete the Selected Logs?
                      </DialogTitle>
                      <DialogDescription>
                        This action is cannot be undone, after deleting it you
                        lost your data
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={handleDeleteSelectedLogs}
                        disabled={isDeleteingLogs}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        {isDeleteingLogs ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <span className="sr-only sm:not-sr-only">Columns</span>
                    <span className="sm:hidden">Cols</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto max-w-[83vw] md:w-full ">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className="whitespace-nowrap"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {isLoadingLogs ? "Loading..." : "No results found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>{`${dateTimeRange.start} to ${dateTimeRange.end}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={responseTimeChartConfig}>
              <BarChart accessibilityLayer data={filteredLogs}>
                <CartesianGrid vertical={false} />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <XAxis
                  className="hidden"
                  dataKey="createdAt"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  }
                />
                <Bar
                  dataKey="responseTime"
                  fill="var(--color-responseTime)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteLogs;
