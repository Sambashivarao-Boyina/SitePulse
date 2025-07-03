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
import { AlertTriangle, Loader2Icon, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from "@/components/ui/code-block";
import { useTheme } from "@/components/theme-provider";

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
  logo: z.string(),
  enableAlerts: z.boolean(),
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

  const currentOrigin = window.location.origin;
  const {theme} = useTheme();

  const url = form.watch("url");
  const logoUrl = form.watch("logo");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [scriptCode, setScriptCode] = useState("");
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scriptCode);
      setCopied(true);
      toast("Script code copied to clipboard!");

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast("Failed to copy to clipboard");
    }
  };

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
      const code = `<script src="${currentOrigin}/api/cdn/${data.website._id}"></script>`;

      // Set the script code and show dialog
      setScriptCode(code);
      setShowSuccessDialog(true);

      toast(data.message);
      form.reset();
    } catch (error) {
      toast("Failed to create website");
    }
    setIsSubmitting(false);
  };

  function onSubmit() {
    createNewWebsite(form.getValues());
  }

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    setCopied(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-2 w-full flex flex-col items-center">
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

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-300/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              Website Added Successfully!
            </DialogTitle>
            <DialogDescription>
              Copy the script below and paste it in the{" "}
              <code className="bg-gray-100/10 px-1 py-0.5 rounded text-sm">
                &lt;head&gt;
              </code>{" "}
              section of your website's root HTML file to start tracking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="w-[80vw]  sm:w-[400px]">
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
                        onClick={copyToClipboard}
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
                            <span className="ml-1 hidden sm:inline">Copy</span>
                          </>
                        )}
                      </Button>
                    </CodeBlockGroup>
                    <div className="w-full overflow-hidden">
                      <CodeBlockCode
                        code={scriptCode}
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
            <div className="bg-blue-200/5 border border-blue-200/10 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>Important:</strong> Make sure to place this script tag
                  in the{" "}
                  <code className="bg-blue-100/10 px-1 py-0.5 rounded">
                    &lt;head&gt;
                  </code>{" "}
                  section of your HTML file for proper tracking functionality.
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleDialogClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddSite;
