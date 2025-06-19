import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Website } from "@/types/Website";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  Check,
  Copy,
  Edit2,
  Loader2,
  Globe,
  Settings,
  Bell,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockGroup,
} from "@/components/ui/code-block";
import { useTheme } from "@/components/theme-provider";
import { Switch } from "@/components/ui/switch";

const WebsiteDetails = () => {
  const { id } = useParams();

  const { theme } = useTheme();
  const { getToken } = useAuth();
  const [websiteDetails, setWebsiteDetails] = useState<Website | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingAlerts, setIsUpdatingAlerts] = useState(false);

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

  const [editedName, setEditedName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [copied, setCopied] = useState(false);

  const currentOrigin = window.location.origin;

  const code = `<script src="${currentOrigin}/api/cdn/${id}"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("CDN copied");
  };

  const handleUpdateName = async () => {
    if (editedName.trim().length == 0) {
      return;
    }

    setIsUpdatingName(true);
    try {
      const token = await getToken();
      const response = await axios.patch(
        `/api/website/${id}/editName`,
        {
          name: editedName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setWebsiteDetails(data);
      toast.success("Name is Updated");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Cannot able to edit Name";
      toast.error(message);
    }
    setIsUpdatingName(false);
  };

  const handleStatusToggle = async () => {
    if (!websiteDetails) return;

    setIsUpdatingStatus(true);
    const newStatus = websiteDetails.status === "Enable" ? "Disable" : "Enable";

    try {
      const token = await getToken();
      const response = await axios.patch(
        `/api/website/${id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setWebsiteDetails(data);
      toast.success(`Website ${newStatus.toLowerCase()} successfully`);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Cannot able to update status";
      toast.error(message);
    }
    setIsUpdatingStatus(false);
  };

  const handleToggleAlerts = async () => {
    if (!websiteDetails) return;

    const newStatus = !websiteDetails.enableAlerts;
    setIsUpdatingAlerts(true);
    try {
      const token = await getToken();
      const response = await axios.patch(
        `/api/website/${id}/enableAlerts`,
        {
          enableAlerts: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setWebsiteDetails(data);
      toast.success(
        `Website Alerts ${newStatus ? "Enabled" : "Diabled"} successfully`
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Cannot able to update Alerts";
      toast.error(message);
    }
    setIsUpdatingAlerts(false);
  };

  useEffect(() => {
    if (websiteDetails) {
      setEditedName(websiteDetails.name);
    }
  }, [websiteDetails]);

  useEffect(() => {
    getDataOfWebsite();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Skeleton className="w-full h-full m-2" />
      </div>
    );
  }

  if (websiteDetails == null) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Data is not loaded</p>
      </div>
    );
  }

  return (
    <div
      className="h-full   flex justify-center p-2"
    >
      <div className=" w-full md:max-w-4xl mx-auto mb-10">
        <Card className="relative overflow-hidden ">
          {/* Status Badge - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStatusToggle}
              disabled={isUpdatingStatus}
              className="p-0 h-auto hover:bg-transparent"
            >
              <Badge
                variant="outline"
                className={`
                  px-3 py-1.5 font-medium transition-all duration-300 cursor-pointer border-2
                  ${
                    websiteDetails.status === "Enable"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900"
                      : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 dark:bg-red-950 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900"
                  }
                  ${
                    isUpdatingStatus
                      ? "opacity-50 cursor-not-allowed"
                      : "shadow-lg"
                  }
                `}
              >
                {isUpdatingStatus ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        websiteDetails.status === "Enable"
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    />
                    {websiteDetails.status}
                  </>
                )}
              </Badge>
            </Button>
          </div>

          <CardHeader className="text-center space-y-6 pt-8 pb-4">
            {/* Logo Section */}
            <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-20 blur-xl"></div>
              <img
                src={websiteDetails.logo}
                className="relative w-full h-full rounded-2xl shadow-xl border-2 border-white/50 dark:border-slate-700/50 object-cover"
                alt="website logo"
              />
            </div>

            {/* Title Section */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 max-w-md">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-blue-300 dark:to-violet-300 bg-clip-text text-transparent leading-tight">
                  {websiteDetails.name}
                </h1>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mt-3"></div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      Edit Website Name
                    </DialogTitle>
                    <DialogDescription>
                      Update the display name for your website
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-input">Website Name</Label>
                      <Input
                        id="name-input"
                        placeholder="Enter website name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleUpdateName}
                      disabled={isUpdatingName}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isUpdatingName ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 px-4 md:px-8">
            {/* URL Section */}
            <div className="space-y-3">
              <Label
                htmlFor="url"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Globe className="h-4 w-4 text-indigo-600" />
                Website URL
              </Label>
              <Input
                id="url"
                value={websiteDetails.url}
                readOnly
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono text-sm"
              />
            </div>

            {/* Code Section */}
            <div className="space-y-4 max-w-[76vw] md:max-w-full">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Integration Code
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Add this script to the &lt;head&gt; section of your HTML file
                  or framework's root template.
                </p>
              </div>

              <div className="w-full">
                <div className="relative group w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-full">
                    <CodeBlock className="w-full">
                      <CodeBlockGroup className="border-slate-200 dark:border-slate-700 border-b px-3 py-3 bg-slate-50 dark:bg-slate-800 flex items-center justify-between w-full min-w-0">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded px-2 py-1 text-xs font-medium">
                            Javascript
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopy}
                          className="h-8 px-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="ml-1 hidden sm:inline">
                                Copied!
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span className="ml-1 hidden sm:inline">
                                Copy
                              </span>
                            </>
                          )}
                        </Button>
                      </CodeBlockGroup>
                      <div className="w-full overflow-hidden">
                        <CodeBlockCode
                          code={code}
                          language="html"
                          theme={
                            theme === "dark" || theme == "system"
                              ? "github-dark"
                              : "github-light"
                          }
                          className="overflow-x-auto w-full text-sm"
                          style={{ maxWidth: "100%", wordBreak: "break-all" }}
                        />
                      </div>
                    </CodeBlock>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Bell className="h-5 w-5 text-indigo-600" /> Alerts for
                  Website Status
                </Label>
                <p>You can receive email alert when your website is down.</p>
              </div>
              <Switch
                disabled={isUpdatingAlerts}
                checked={websiteDetails.enableAlerts}
                onCheckedChange={handleToggleAlerts}
              />
            </div>

            {websiteDetails.status != null && <div></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteDetails;
