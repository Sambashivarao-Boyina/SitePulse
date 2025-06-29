import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Code,
  BarChart3,
  Shield,
  Clock,
  Globe,
  Smartphone,
  Activity,
  Mail,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Database,
  Eye,
  MousePointer,
  TrendingUp,
  ChevronRight,
  Users,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  metrics?: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  metrics,
}) => (
  <Card className="h-full border-primary/20 hover:border-primary/40 transition-colors duration-300 bg-card">
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
          {icon}
        </div>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </div>
      <CardDescription className="text-muted-foreground">
        {description}
      </CardDescription>
    </CardHeader>
    {metrics && (
      <CardContent>
        <ul className="space-y-1">
          {metrics.map((metric, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
              {metric}
            </li>
          ))}
        </ul>
      </CardContent>
    )}
  </Card>
);

const CodeBlock: React.FC<{ children: string }> = ({ children }) => (
  <div className="bg-secondary/50 dark:bg-secondary/20 rounded-lg p-4 overflow-x-auto border">
    <pre className="text-sm text-foreground">
      <code>{children}</code>
    </pre>
  </div>
);

const Docs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("integration");

  const integrationCode = `<script 
  src="https://yourdomain.com/api/cdn/dmsndfehejehehr">
</script>`;

  const features = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Visitor Analytics",
      description: "Track user interactions in real-time and over time periods",
      metrics: [
        "Total visits & unique visitors",
        "Visited pages and routes",
        "Session duration tracking",
        "Bounce rate analysis",
        "Geographic location data",
        "Device and browser insights",
      ],
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Real-Time Monitoring",
      description: "Live insights into your website's current activity",
      metrics: [
        "Current online users",
        "Active pages traffic",
        "Live device breakdown",
        "Real-time performance metrics",
      ],
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Uptime Monitoring",
      description: "Continuous monitoring with 5-minute intervals",
      metrics: [
        "HTTP status monitoring",
        "Response time tracking",
        "Uptime percentage",
        "Error logging & alerts",
        "Email/Slack notifications",
      ],
    },
    {
      icon: <MousePointer className="w-5 h-5" />,
      title: "Heatmap Analytics",
      description: "Visual representation of user interactions",
      metrics: [
        "Click tracking",
        "Scroll behavior analysis",
        "Visual interaction overlay",
        "User journey mapping",
      ],
    },
  ];

  const retentionData = [
    { type: "Visit Analytics", period: "3 months" },
    { type: "Uptime Logs", period: "1 month" },
    { type: "Website Configuration", period: "Until user deletion" },
  ];

  const tabItems = [
    { value: "integration", label: "Integration", icon: Code },
    { value: "features", label: "Features", icon: BarChart3 },
    { value: "badge", label: "Live Stats Badge", icon: Activity },
    { value: "privacy", label: "Privacy", icon: Shield },
    { value: "retention", label: "Data Policy", icon: Database },
    { value: "support", label: "Support", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white  rounded-full shadow-lg">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-semibold text-sm sm:text-base">
              Website Analytics & Monitoring
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Integration & Feature Documentation
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Complete guide for integrating our all-in-one website analytics,
            monitoring, and heatmap solution
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
            <Badge variant="secondary" className="text-xs sm:text-sm">
              🔌 Easy Integration
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">
              📈 Real-time Analytics
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">
              ⚙️ Privacy Focused
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">
              🔐 GDPR Compliant
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-first Tabs List */}
          <div className="mb-6">
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-lg w-full sm:w-auto">
                {tabItems.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm min-w-fit"
                    >
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline sm:inline">
                        {tab.label}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </ScrollArea>
          </div>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-4 sm:space-y-6">
            <Card className="border-primary/20 bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2 text-lg sm:text-xl">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 " />
                  </div>
                  Integration Instructions
                </CardTitle>
                <CardDescription>
                  Get started by adding our tracking script to your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-primary/20 bg-primary/5">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    Once you add your website to our platform, you'll receive a
                    unique JavaScript CDN link
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    Add Script to Your Website
                  </h4>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Paste the following script inside your{" "}
                    <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">
                      &lt;head&gt;
                    </code>{" "}
                    tag:
                  </p>
                  <CodeBlock>{integrationCode}</CodeBlock>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs sm:text-sm text-green-800 dark:text-green-200">
                      Lightweight (~2KB)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs sm:text-sm text-green-800 dark:text-green-200">
                      No cookies used
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs sm:text-sm text-green-800 dark:text-green-200">
                      Privacy focused
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>

            <Card className="border-primary/20 bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2 text-lg sm:text-xl">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  Dashboard Overview
                </CardTitle>
                <CardDescription>
                  What you'll see in your analytics dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    {
                      title: "Visitor Graphs",
                      desc: "Area charts showing visitors by date",
                    },
                    {
                      title: "Page Analytics",
                      desc: "Top pages and route tracking",
                    },
                    {
                      title: "Geographic Data",
                      desc: "User countries and cities map",
                    },
                    {
                      title: "Real-time Panel",
                      desc: "Current online users count",
                    },
                    {
                      title: "Uptime Timeline",
                      desc: "Response time and uptime logs",
                    },
                    {
                      title: "Heatmap Overlay",
                      desc: "Visual user click patterns",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/10"
                    >
                      <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Stats badge */}
          <TabsContent value="badge" className="space-y-4 sm:space-y-6">
            <Card className="border-primary/20 bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2 text-lg sm:text-xl">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  Live Stats Badge
                </CardTitle>
                <CardDescription>
                  Display real-time website traffic stats directly on your site
                  to build trust and show activity.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Paste the following script tag into your HTML where you want
                    the badge to appear.
                  </p>
                  <div className="rounded-md bg-muted px-4 py-2 text-sm font-mono text-muted-foreground">
                    <code>
                      &lt;script
                      src="https://yourplatform.com/api/cdn/metrics/dfhsfsf"&gt;&lt;/script&gt;
                    </code>
                  </div>
                  <p>It is applicable to all the frameworks</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    What It Shows
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { icon: Users, text: "Live Visitors on your site" },
                      { icon: BarChart3, text: "Total Visits" },
                      { icon: Clock, text: "Average Session Time" },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <li key={index} className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {item.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    No user data is tracked. The badge is anonymous and
                    privacy-friendly.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4 sm:space-y-6">
            <Card className="border-primary/20 bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2 text-lg sm:text-xl">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  Privacy & Compliance
                </CardTitle>
                <CardDescription>
                  Your users' privacy is our priority
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">
                      What We DON'T Collect
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "No Personally Identifiable Information (PII)",
                        "No cookies or local storage",
                        "No personal tracking or profiling",
                        "No sensitive user data",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">
                      What We DO Collect
                    </h4>
                    <ul className="space-y-2">
                      {[
                        {
                          icon: Globe,
                          text: "Approximate location (city/country)",
                        },
                        {
                          icon: Smartphone,
                          text: "Device type and browser info",
                        },
                        {
                          icon: BarChart3,
                          text: "Page views and session data",
                        },
                        { icon: Activity, text: "Website performance metrics" },
                      ].map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <li key={index} className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-primary" />
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {item.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>GDPR Compliant:</strong> Our tracking is anonymous
                    and doesn't require user consent for basic analytics.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Retention Tab */}
          <TabsContent value="retention" className="space-y-4 sm:space-y-6">
            <Card className="border-primary/20 bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2 text-lg sm:text-xl">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  Data Retention Policy
                </CardTitle>
                <CardDescription>
                  How long we keep your data for optimal performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {retentionData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/10"
                    >
                      <span className="font-medium text-foreground text-sm sm:text-base">
                        {item.type}
                      </span>
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        {item.period}
                      </Badge>
                    </div>
                  ))}
                </div>

                <Alert className="mt-4 sm:mt-6 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                    After retention periods, data is automatically purged and
                    cannot be recovered. This helps maintain optimal performance
                    and reduces storage costs.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-primary/20 bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2 text-lg sm:text-xl">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    Get Help
                  </CardTitle>
                  <CardDescription>
                    Multiple ways to get support when you need it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {[
                    {
                      icon: Mail,
                      title: "Email Support",
                      desc: "boyinasambashivarao@gmail.com",
                    },
                    {
                      icon: Globe,
                      title: "Knowledge Base",
                      desc: `${window.location.href}`,
                    },
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10"
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground text-sm sm:text-base">
                            {item.title}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg sm:text-xl">
                    Use Cases
                  </CardTitle>
                  <CardDescription>
                    Perfect for various types of websites
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  {[
                    "🛍 E-commerce product tracking",
                    "📰 Blog reader engagement",
                    "📱 SaaS performance monitoring",
                    "🎓 Portfolio uptime tracking",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    🚀 Ready to Get Started?
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Follow these simple steps to begin tracking your website
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                    {[
                      "Register Account",
                      "Add Website",
                      "Embed Script",
                      "View Analytics",
                    ].map((step, index) => (
                      <div key={index} className="text-center space-y-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-xs sm:text-sm">
                          {index + 1}
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-foreground">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Docs;
