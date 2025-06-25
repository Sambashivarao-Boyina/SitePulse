import React, { useState } from "react";
import {
  AlertTriangle,
  Globe,
  BarChart3,
  FileText,
  Clock,
  Users,
  Trash2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Website } from "@/types/Website";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

interface WebsiteDeleteProps {
  website: Website;
}

const WebsiteDelete: React.FC<WebsiteDeleteProps> = ({ website }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getToken } = useAuth();

  const navigate = useNavigate();

  const handleIsConfirmChange = (value: boolean) => {
    setIsConfirmed(value);
  };

  const dataToBeDeleted = [
    {
      icon: BarChart3,
      title: "Analytics Data",
      description:
        "All visitor statistics, page views, and performance metrics",
    },
    {
      icon: FileText,
      title: "Log Files",
      description: "Server logs, error logs, and monitoring events",
    },
    {
      icon: Clock,
      title: "Uptime History",
      description: "Historical uptime data and downtime incidents",
    },
    {
      icon: Users,
      title: "User Sessions",
      description: "Session data, user journeys, and interaction records",
    },
  ];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = await getToken();
        await axios.delete(`/api/website/${website._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Deleted Successfully");

      navigate("/websites");
    } catch (error: any) {
      const message = error?.respone?.data?.message || "Cannot able to delete";
      toast.error(message);
    }
    setIsDeleting(false);
    setShowConfirmDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl md:mx-auto px-6 py-8">
        {/* Warning Banner */}
        <Alert className="mb-8 border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            This action cannot be undone. All data associated with this website
            will be permanently deleted.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Website Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{website.name}</CardTitle>
                    <CardDescription>{website.url}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Data to be deleted */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Data to be Permanently Deleted
                </CardTitle>
                <CardDescription>
                  The following data will be permanently removed and cannot be
                  recovered:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataToBeDeleted.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="p-2 bg-destructive/10 rounded-lg">
                        <item.icon className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Confirmation Card */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Delete Website
                </CardTitle>
                <CardDescription>
                  Please confirm you understand the consequences of this action.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirm-delete"
                    checked={isConfirmed}
                    onCheckedChange={handleIsConfirmChange}
                    className="mt-1"
                  />
                  <label
                    htmlFor="confirm-delete"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I understand that this action is permanent and will delete
                    all website data, including analytics, logs, and monitoring
                    history. This data cannot be recovered.
                  </label>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={!isConfirmed}
                  onClick={() => setShowConfirmDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Website
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>If you're unsure about deleting this website, you can:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Pause monitoring temporarily</li>
                  <li>Export your data first</li>
                  <li>Contact support for assistance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Final Confirmation
            </DialogTitle>
            <DialogDescription>
              You are about to permanently delete{" "}
              <strong>{website.name}</strong> and all associated data.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive font-medium">
                This action is irreversible. All monitoring data will be lost
                forever.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Forever
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteDelete;
