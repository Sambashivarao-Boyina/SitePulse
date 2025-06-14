import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { WebsiteInterface } from "@/interfaces/Website";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Edit2, Loader2 } from "lucide-react";
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

const WebsiteDetails = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [websiteDetails, setWebsiteDetails] = useState<WebsiteInterface | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="w-full h-full flex justify-center p-2 md:py-4">
      <Card className="md:w-2/3 lg:w-1/2 ">
        <CardHeader>
          <div>
            <img
              src={websiteDetails.logo}
              className="mx-auto md:h-20 md:w-20"
              alt="website logo"
            />
            <div className="flex items-center">
              <h2 className="scroll-m-20 flex-1 text-center mt-2 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {websiteDetails.name}
              </h2>

              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <Button className="bg-transparent hover:bg-transparent ">
                      <Edit2 className="text-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Name</DialogTitle>
                      <DialogDescription>
                        Change the Name of your site
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input
                          id="name-1"
                          name="name"
                          placeholder="Name of the site"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleUpdateName} type="button">
                        {isUpdatingName ? <Loader2 /> : "Submit"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="url ml-4">Url </Label>
            <Input readOnly id="url" value={websiteDetails.url} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteDetails;
