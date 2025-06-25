import { useState, useEffect } from "react";
import {
  BarChart3,
  Plus,
  Shield,
  Users,
  MapPin,
  Activity,
  Globe,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [animatedStats, setAnimatedStats] = useState({
    websites: 0,
    uptime: 0,
    visitors: 0,
    countries: 0,
  });

  const [currentFeature, setCurrentFeature] = useState(0);

  // Animate stats on mount
  useEffect(() => {
    const targets = {
      websites: 2547,
      uptime: 99.9,
      visitors: 156420,
      countries: 67,
    };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        websites: Math.floor(targets.websites * easeOut),
        uptime: Math.min(targets.uptime, targets.uptime * easeOut),
        visitors: Math.floor(targets.visitors * easeOut),
        countries: Math.floor(targets.countries * easeOut),
      });

      if (step >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Activity,
      title: "Real-time Performance Monitoring",
      description:
        "Track your website's response time every 5 minutes with instant alerts when your site goes down. Get detailed performance metrics and uptime statistics.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Advanced User Analytics",
      description:
        "Monitor visitor count, session duration, and user behavior patterns. Track which pages users visit most and how long they stay.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: MapPin,
      title: "Location & Heatmap Insights",
      description:
        "Visualize your visitors' approximate locations with interactive heatmaps. Understand your global audience distribution.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Comprehensive Dashboard",
      description:
        "Access all your website metrics in one beautiful dashboard. Export data, set custom alerts, and track performance trends.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Shield,
      title: "Smart Integrations",
      description:
        "Embed visitor stats badges directly into your projects. Easy integration with APIs and webhook support for custom workflows.",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const stats = [
    {
      number: `${animatedStats.websites.toLocaleString()}+`,
      label: "Websites Monitored",
      icon: Globe,
      description: "Active websites being tracked",
    },
    {
      number: `${animatedStats.uptime.toFixed(1)}%`,
      label: "Average Uptime",
      icon: CheckCircle,
      description: "Reliability across all monitored sites",
    },
    {
      number: `${animatedStats.visitors.toLocaleString()}+`,
      label: "Visitors Tracked",
      icon: Eye,
      description: "Monthly unique visitors monitored",
    },
    {
      number: `${animatedStats.countries}+`,
      label: "Countries Covered",
      icon: MapPin,
      description: "Global monitoring locations",
    },
  ];

  const deviceTypes = [
    { icon: Monitor, label: "Desktop", percentage: 65 },
    { icon: Smartphone, label: "Mobile", percentage: 28 },
    { icon: Tablet, label: "Tablet", percentage: 7 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <Badge
              variant="outline"
              className="mb-6 text-sm font-medium border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 animate-fade-in"
            >
              <Activity className="w-3 h-3 mr-1" />
              Live Website Monitoring Platform
            </Badge>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl animate-fade-in-up">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Monitor, Analyze & Optimize
              </span>
              <br />
              <span className="text-slate-900 dark:text-slate-100">
                Your Websites
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-600 dark:text-slate-300 md:text-xl animate-fade-in-up delay-200">
              Track performance every 5 minutes, monitor user behavior, analyze
              visitor locations with heatmaps, and get instant alerts when your
              website goes down. Everything you need in one powerful dashboard.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up delay-300">
              <Link to={"/add-website"}>
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                  Start Monitoring Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-y border-blue-100 dark:border-blue-900/50">
        <div className="container px-4">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-2 flex justify-center">
                    <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                      <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 md:text-base">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stat.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-slate-900 dark:text-slate-100">
              Complete Website Monitoring Solution
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              From performance tracking to user analytics, get comprehensive
              insights into your website's health and visitor behavior.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 p-2 sm:p-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isActive = index === currentFeature;

              return (
                <Card
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-500 transform hover:scale-105 border-2 ${
                    isActive
                      ? "border-blue-200 shadow-lg scale-105 dark:border-blue-800"
                      : "border-transparent hover:border-blue-100 dark:hover:border-blue-900"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 bg-gradient-to-r ${
                          feature.color
                        }/10 rounded-lg group-hover:${
                          feature.color
                        }/20 transition-all duration-300 ${
                          isActive ? "animate-pulse" : ""
                        }`}
                      >
                        <IconComponent
                          className={`h-6 w-6 text-blue-600 dark:text-blue-400 ${
                            isActive ? "animate-bounce" : ""
                          }`}
                        />
                      </div>
                      <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Device Analytics Preview */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                Track Visitors Across All Devices
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                See how your visitors interact with your website across
                different devices and platforms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deviceTypes.map((device, index) => {
                const IconComponent = device.icon;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex justify-center">
                        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full">
                          <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">
                        {device.label}
                      </h4>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {device.percentage}%
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10">
        <div className="container px-4">
          <Card className="mx-auto max-w-4xl border-2 border-blue-100 dark:border-blue-900 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-pulse">
                  <Activity className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <h2 className="mb-6 text-3xl font-bold md:text-4xl text-slate-900 dark:text-slate-100">
                Ready to Monitor Your Website?
              </h2>

              <p className="mb-8 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Join thousands of developers who trust our platform to monitor
                their websites' performance, track user behavior, and get
                instant alerts when issues arise.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={"/add-website"}>
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                    Start Free Monitoring
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
               
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Stop service anytime
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;