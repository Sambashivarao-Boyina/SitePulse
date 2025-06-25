import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";

const FormSchema = z.object({
  url: z
    .string()
    .url({
      message: "Enter a valid url",
    })
    .min(1, {
      message: "Url is required",
    }),
  name: z.string().min(4, {
    message: "Name should minimum 4 characters",
  }),
  logo: z
    .string(),
  enableAlerts: z.boolean()
});

interface NewWebsiteSchmea {
  url: string;
  name: string;
  logo: string;
}

const AddSite = () => {
  const { getToken } = useAuth();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
      name: "",
      enableAlerts: true,
      logo: "",
    },
  });

  const url = form.watch("url");
  const logoUrl = form.watch("logo");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWebsiteLogo = async () => {
      if (!url || !/^https?:\/\/.+\..+/.test(url)) {
        return;
      }

      try {
        const domain = new URL(url).hostname;
        const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        const img = new Image();
        img.onload = () => {
          form.setValue("logo", logoUrl);
        };
        img.onerror = () => {
          toast("Unable to load logo");
        };

        img.src = logoUrl;
      } catch (error) {
        toast("Invalid URL");
      }
    };

    if (url.length > 0) {
      fetchWebsiteLogo();
    }
  }, [url]); // ✅ watch "url" specifically

  const createNewWebsite = async (newWebsite: NewWebsiteSchmea) => {
    setIsSubmitting(true);
    try {
      
      const token = await getToken();
      const response = await axios.post(
        "/api/website",
        {
          name: newWebsite.name,
          url: new URL(newWebsite.url).origin,
          logo: newWebsite.logo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.data;


      toast(data.message);
      form.reset();
    } catch (error) {
      
    }
    setIsSubmitting(false);
  }

  function onSubmit() {
    createNewWebsite(form.getValues());
  }
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full m-4 md:w-2/3 lg:w-1/2 space-y-6 mt-3"
        >
          <div className="w-full flex items-center justify-center">
            <Avatar className="h-14 md:h-24 w-14 md:w-24">
              <AvatarImage src={logoUrl} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="http://sitepulse.com" {...field} />
                </FormControl>
                <FormDescription>
                  This Url host website will be tracked.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of the Website</FormLabel>
                <FormControl>
                  <Input placeholder="Sitepulse" {...field} />
                </FormControl>
                <FormDescription>
                  This is your Website display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
         
          <Button
            className="bg-blue-600 w-full disabled:cursor-not-allowed hover:bg-blue-700 text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Add"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddSite;
