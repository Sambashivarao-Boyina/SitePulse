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
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Mail,
  Plus,
  Trash2,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSocket } from "../../hooks/socket";

const WebsiteDetails = () => {
  const { id } = useParams();

  const { theme } = useTheme();
  const { getToken } = useAuth();
  const [websiteDetails, setWebsiteDetails] = useState<Website | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Alert emails state
  const [alertEmails, setAlertEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isUpdatingEmails, setIsUpdatingEmails] = useState(false);
  const [emailError, setEmailError] = useState("");

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
      // Set alert emails from the response (assuming they're in data.alertEmails)
      if (data.alertEmails) {
        setAlertEmails(data.alertEmails);
      }
    } catch (error) {
      toast.error("Cannot able to load data");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("websiteUpdate", (data) => {
        setWebsiteDetails(data);
      })
    }
    return () => {
      socket?.off("websiteUpdate");
    };
  },[])

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
  }

  const getAlertEmailsSection = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          Alert Emails
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Add up to 5 email addresses to receive notifications when your website
          goes down.
        </p>

        {/* Add New Email */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter email address"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setEmailError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddEmail();
                  }
                }}
                className="focus:ring-2 focus:ring-blue-500"
                disabled={isUpdatingEmails || alertEmails.length >= 5}
              />
            </div>
            <Button
              onClick={handleAddEmail}
              disabled={
                isUpdatingEmails || alertEmails.length >= 5 || !newEmail.trim()
              }
              className="bg-blue-600 hover:bg-blue-700 px-4 text-white"
            >
              {isUpdatingEmails ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>

          {/* Email Error */}
          {emailError && (
            <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {emailError}
            </div>
          )}

          {/* Email Count */}
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {alertEmails.length}/5 emails added
          </div>
        </div>

        {/* Current Emails List */}
        {alertEmails.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Alert Emails:</Label>
            <div className="space-y-2">
              {alertEmails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                      {email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmail(email)}
                    disabled={isUpdatingEmails}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {alertEmails.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            <Mail className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No alert emails configured
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Add email addresses to receive downtime notifications
            </p>
          </div>
        )}

        <Alert className="border-yellow-100 bg-yellow-500/20 text-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="ml-2">
            After 3 consecutive alerts when your website is down, your website
            will be automatically disabled. You can enable it again once the
            server is back up.
          </AlertDescription>
        </Alert>
      </div>
    );

     
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

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add email function
  const handleAddEmail = async () => {
    setEmailError("");
    
    if (!newEmail.trim()) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!isValidEmail(newEmail.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (alertEmails.includes(newEmail.trim())) {
      setEmailError("This email is already added");
      return;
    }

    if (alertEmails.length >= 5) {
      setEmailError("Maximum 5 emails allowed");
      return;
    }

    setIsUpdatingEmails(true);
    try {
      const token = await getToken();
      const updatedEmails = [...alertEmails, newEmail.trim()];
      console.log("sending request");
      await axios.patch(
        `/api/website/${id}/alertEmails`,
        {
          alertEmails: updatedEmails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlertEmails(updatedEmails);
      setNewEmail("");
      toast.success("Email added successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to add email";
      toast.error(message);
      setEmailError(message);
    }
    setIsUpdatingEmails(false);
  };

  // Remove email function
  const handleRemoveEmail = async (emailToRemove: string) => {
    setIsUpdatingEmails(true);
    try {
      const token = await getToken();
      const updatedEmails = alertEmails.filter(email => email !== emailToRemove);
      
      await axios.patch(
        `/api/website/${id}/alertEmails`,
        {
          alertEmails: updatedEmails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlertEmails(updatedEmails);
      toast.success("Email removed successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to remove email";
      toast.error(message);
    }
    setIsUpdatingEmails(false);
  };

  const formatResponseTime = (responseTime: number) => {
    if (responseTime < 1000) {
      return `${responseTime}ms`;
    }
    return `${(responseTime / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getWebsiteStatusDisplay = () => {
    if (!websiteDetails?.lastWebsiteStatus) return null;

    const { websiteStatus, statusCode, responseTime, errorMessage, createdAt } = websiteDetails.lastWebsiteStatus;

    const isUp = websiteStatus === 'up';

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Website Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              {isUp ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Status</p>
                <p className={`font-semibold ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isUp ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Response Time</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {responseTime ? formatResponseTime(responseTime) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Code */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Status Code</p>
                <p className={`font-semibold ${statusCode >= 200 && statusCode < 300 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {statusCode || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-red-800 dark:text-red-200 text-sm">
                <strong>Error:</strong> {errorMessage}
              </div>
            </div>
          </div>
        )}

        {/* Last Check Time */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Last checked: {formatDate(createdAt)}
        </div>
      </div>
    );
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
        <div className="w-full h-full mt-10 md:max-w-4xl mx-auto mb-10 flex flex-col items-center gap-3">
          <Skeleton className="w-40 h-40 rounded-full" />

          <div className="flex flex-row flex-wrap w-full gap-3 items-center justify-center">
            {Array.from({ length: 3 }).map((_, index) => {
              return <Skeleton key={index} className="h-20 w-40 rounded-md" />;
            })}
          </div>

          <Skeleton className="w-full h-4 mt-4" />

          <Skeleton className="w-full my-10 h-20" />

          <Skeleton className="w-full mb-10 h-10" />
        </div>
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
    <div className="h-full flex justify-center p-2">
      <div className="w-full md:max-w-4xl mx-auto mb-10">
        <Card className="relative overflow-hidden">
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
            {/* Website Status Section */}
            {websiteDetails.lastWebsiteStatus && getWebsiteStatusDisplay()}

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

            {/* Alert Emails Section */}
            {getAlertEmailsSection()}


          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteDetails;