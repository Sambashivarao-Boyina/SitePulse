import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockGroup,
} from "@/components/ui/code-block";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  Check,
  Copy,
  Gauge,
  Globe,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nextjs from "../../assets/nextjs.png";
import Html from "../../assets/html.png";
import React from "../../assets/react.png";
import Vuejs from "../../assets/vuejs.png";
import Angular from "../../assets/angular.png";
import WordPress from "../../assets/wordpress.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WebsiteLiveStatsBadge = () => {
  const { id } = useParams();
  const currentOrigin = window.location.origin;
  const { theme } = useTheme();

  // Fix TypeScript types for copiedStates
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const integrations = [
    {
      id: "html",
      icon: Html,
      title: "HTML",
      description:
        "For plain HTML websites, static sites, and vanilla JavaScript projects",
      language: "html",
      badge: "HTML",
      badgeColor:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      code: `<!-- Add this script where you want the badge to appear -->
<script
  src="${currentOrigin}/api/cdn/metrics/${id}"
  async
></script>`,
    },
    {
      id: "react",
      icon: React,
      title: "React",
      description:
        "For React, Vite, Create React App, and other React-based applications",
      language: "tsx",
      badge: "React",
      badgeColor:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      code: `import { useEffect } from 'react';

function LiveStatsBadge() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${currentOrigin}/api/cdn/metrics/${id}';
    script.async = true;

    const container = document.getElementById('live-stats-badge');
    if (container) {
      // Clear existing content
      container.innerHTML = '';
      container.appendChild(script);
    }

    // Cleanup function
    return () => {
      const existingScript = container?.querySelector('script');
      if (existingScript) {
        container.removeChild(existingScript);
      }
    };
  }, []);

  return <div id="live-stats-badge" className="my-4" />;
}

export default LiveStatsBadge;`,
    },
    {
      id: "nextjs",
      icon: Nextjs,
      title: "Next.js",
      description: "SSR-safe implementation for Next.js applications",
      language: "tsx",
      badge: "Next.js",
      badgeColor: "bg-black text-white dark:bg-white dark:text-black",
      code: `'use client';

import { useEffect } from 'react';

export default function LiveStatsBadge() {
  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = '${currentOrigin}/api/cdn/metrics/${id}';
    script.async = true;

    const container = document.getElementById('live-stats-badge');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }

    return () => {
      const existingScript = container?.querySelector('script');
      if (existingScript) {
        container.removeChild(existingScript);
      }
    };
  }, []);

  return <div id="live-stats-badge" className="my-4" />;
}`,
    },
    {
      id: "vue",
      icon: Vuejs,
      title: "Vue.js",
      description: "For Vue.js applications with composition or options API",
      language: "vue",
      badge: "Vue.js",
      badgeColor:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      code: `<template>
  <div id="live-stats-badge" class="my-4"></div>
</template>

<script>
export default {
  name: 'LiveStatsBadge',
  mounted() {
    this.loadStatsBadge();
  },
  methods: {
    loadStatsBadge() {
      const script = document.createElement('script');
      script.src = '${currentOrigin}/api/cdn/metrics/${id}';
      script.async = true;

      const container = document.getElementById('live-stats-badge');
      if (container) {
        container.innerHTML = '';
        container.appendChild(script);
      }
    }
  },
  beforeUnmount() {
    const container = document.getElementById('live-stats-badge');
    const existingScript = container?.querySelector('script');
    if (existingScript) {
      container.removeChild(existingScript);
    }
  }
};
</script>`,
    },
    {
      id: "angular",
      icon: Angular,
      title: "Angular",
      description: "For Angular applications with proper lifecycle management",
      language: "typescript",
      badge: "Angular",
      badgeColor: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      code: `import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-live-stats-badge',
  template: '<div id="live-stats-badge" class="my-4"></div>'
})
export class LiveStatsBadgeComponent implements AfterViewInit, OnDestroy {
  
  ngAfterViewInit(): void {
    this.loadStatsBadge();
  }

  ngOnDestroy(): void {
    const container = document.getElementById('live-stats-badge');
    const existingScript = container?.querySelector('script');
    if (existingScript) {
      container.removeChild(existingScript);
    }
  }

  private loadStatsBadge(): void {
    const script = document.createElement('script');
    script.src = '${currentOrigin}/api/cdn/metrics/${id}';
    script.async = true;

    const container = document.getElementById('live-stats-badge');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }
  }
}`,
    },
    {
      id: "wordpress",
      icon: WordPress,
      title: "WordPress",
      description: "For WordPress sites, themes, and plugins",
      language: "php",
      badge: "WordPress",
      badgeColor: "bg-blue-600 text-white dark:bg-blue-400 dark:text-blue-900",
      code: `<?php
// Add to your theme's functions.php file
function add_livestats_badge() {
    $site_id = '${id}';
    $script_url = '${currentOrigin}/api/cdn/metrics/' . $site_id;
    
    echo '<script src="' . esc_url($script_url) . '"
                  data-website-id="' . esc_attr($site_id) . '"
                  async></script>';
}

// Hook to add the badge to your desired location
add_action('wp_footer', 'add_livestats_badge');
?>

<!-- Or use shortcode approach -->
<?php
function livestats_badge_shortcode() {
    $site_id = '${id}';
    $script_url = '${currentOrigin}/api/cdn/metrics/' . $site_id;
    
    return '<script src="' . esc_url($script_url) . '"
                    data-website-id="' . esc_attr($site_id) . '"
                    async></script>';
}
add_shortcode('livestats_badge', 'livestats_badge_shortcode');

// Use with: [livestats_badge]
?>`,
    },
  ];

  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Lightning Fast",
      description:
        "Async loading ensures zero impact on your site's performance",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Privacy First",
      description: "GDPR compliant with no personal data collection",
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      title: "Real-time Stats",
      description: "Live visitor count and engagement metrics",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Universal Support",
      description: "Works with any website or framework",
    },
  ];

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
    <div className="flex flex-col w-full">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-4">
        <div className="flex items-center justify-center gap-2">
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            LiveStats Badge
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Show real-time visitor statistics directly on your website with our
          lightweight, privacy-focused widget
        </p>
        

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-muted/50 hover:scale-105 hover:shadow-blue-300 transition-all duration-100 p-2"
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="mx-auto w-fit p-2 bg-blue-500/10 text-blue-600 rounded-lg ">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Integration Guides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Integration Guides
          </CardTitle>
          <CardDescription>
            Choose your framework and copy the integration code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="html">
            <div className="mb-6 w-full flex items-center justify-center">
              <ScrollArea className=" whitespace-nowrap pb-2">
                <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-lg mx-auto sm:w-auto">
                  {integrations.map((integration) => {
                    return (
                      <TabsTrigger
                        key={integration.id}
                        value={integration.id}
                        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground dark:data-[state=active]:text-white data-[state=active]:shadow-sm min-w-fit"
                      >
                        <img
                          src={integration.icon}
                          className="w-3.5 h-3.5 sm:w-6 sm:h-6"
                        />
                        <span className="hidden xs:inline md:inline">
                          {integration.title}
                        </span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </ScrollArea>
            </div>

            {integrations.map((integration) => (
              <TabsContent
                key={integration.id}
                value={integration.id}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {integration.title}
                      </h3>
                      <Badge className={integration.badgeColor}>
                        {integration.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {integration.description}
                    </p>
                  </div>
                </div>

                {/* FIXED CODE BLOCK SECTION */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <CodeBlock className=" w-[80vw] md:w-full border rounded-lg overflow-hidden">
                      <CodeBlockGroup className="border-slate-200 dark:border-slate-700 border-b px-3 py-3 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded px-2 py-1 text-xs font-medium">
                            {integration.language}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCopy(integration.code, integration.id)
                          }
                          className="h-8 px-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0"
                        >
                          {copiedStates[integration.id] ? (
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

                      {/* CRITICAL FIX: Proper scroll container */}
                      <div className="overflow-x-auto max-w-full  md:w-full">
                        <div style={{ minWidth: "max-content" }}>
                          <CodeBlockCode
                            code={integration.code}
                            language={integration.language}
                            theme={
                              theme === "dark" || theme === "system"
                                ? "github-dark"
                                : "github-light"
                            }
                            className="text-sm block"
                          />
                        </div>
                      </div>
                    </CodeBlock>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div>
        <p className="text-lg text-foreground mt-4">
          This is the Demo of the Badge of the Live Stats that you can integrate
          in your website.
        </p>
        <div id="live-stats-badge"></div>
      </div>
    </div>
  );
};

export default WebsiteLiveStatsBadge;
