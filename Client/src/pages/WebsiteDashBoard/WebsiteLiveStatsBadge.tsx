import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockGroup,
} from "@/components/ui/code-block";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const WebsiteLiveStatsBadge = () => {
  const { id } = useParams();
  const currentOrigin = window.location.origin;
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("CDN copied");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "http://localhost:8080/api/cdn/metrics/684c02732bd394dc6579cafa";
    script.setAttribute("data-website-id", "abc123");
    script.async = true;

    const container = document.getElementById("live-stats-badge");
    if (container != null) {
      container.innerHTML = "";
    }
    container?.appendChild(script);
  }, []);

  return (
    <div className="flex flex-col">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        1. HTML (Static Sites / Plain HTML)
      </h2>
      <p className="my-2">
        Add the JS Snippet where you want to show the Stats in your website.
      </p>
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
                  onClick={() =>
                    handleCopy(
                      `<script src="${currentOrigin}/api/cdn/metrics/${id}"></script>`
                    )
                  }
                  className="h-8 px-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="ml-1 hidden sm:inline">Copied!</span>
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
                  code={`<script src="${currentOrigin}/api/cdn/metrics/${id}"></script>`}
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

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        2. React (Vite, CRA, Next.js, etc.)
      </h2>
      <p className="my-2">
        Add the JS Snippet where you want to show the Stats in your website.
      </p>
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
                  onClick={() =>
                    handleCopy(
                      `import { useEffect } from "react";

function LiveStatsBadge() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://yourplatform.com/api/cdn/metrics/${id}";
    script.async = true;

    const container = document.getElementById("live-stats-badge");
    if (container) container.appendChild(script);
  }, []);

  return <div id="live-stats-badge" />;
}
`
                    )
                  }
                  className="h-8 px-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="ml-1 hidden sm:inline">Copied!</span>
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
                  code={`import { useEffect } from "react";

function LiveStatsBadge() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://yourplatform.com/api/cdn/metrics/${id}";
    script.async = true;

    const container = document.getElementById("live-stats-badge");
    if (container) container.appendChild(script);
  }, []);

  return <div id="live-stats-badge" />;
}
`}
                  language="tsx"
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

      <div id="live-stats-badge" />
    </div>
  );
};

export default WebsiteLiveStatsBadge;

