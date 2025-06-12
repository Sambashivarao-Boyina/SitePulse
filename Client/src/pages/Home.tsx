import React, { useState } from "react";
import {
  Menu,
  Globe,
  BarChart3,
  Plus,
  Eye,
  BookOpen,
  TrendingUp,
  Shield,
  Zap,
  Users,
  X,
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

const HomePage = () => {
  

  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description:
        "Monitor your website performance with live data updates and comprehensive metrics.",
    },
    {
      icon: Shield,
      title: "Security Monitoring",
      description:
        "Keep your websites secure with continuous security scanning and threat detection.",
    },
    {
      icon: Zap,
      title: "Performance Insights",
      description:
        "Get detailed performance reports and optimization recommendations.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Share insights with your team and collaborate on website improvements.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Websites Tracked" },
    { number: "99.9%", label: "Uptime Monitoring" },
    { number: "24/7", label: "Support Available" },
    { number: "50+", label: "Countries Served" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
     

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-background dark:from-blue-950/20 dark:via-purple-950/20 dark:to-background">
        <div className="container px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-6 text-sm font-medium">
              🚀 New: Advanced Analytics Dashboard
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Monitor Your Websites Like Never Before
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Track performance, uptime, and security across all your websites
              with our comprehensive monitoring platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                asChild
              >
                <a href="/add-website">
                  <Plus className="mr-2 h-5 w-5" />
                  Start Tracking Now
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/dashboard">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Dashboard
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50 py-16">
        <div className="container px-4">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold md:text-4xl">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything You Need to Monitor Your Websites
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools and insights to keep your websites running
              smoothly and efficiently.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 py-20">
        <div className="container px-4">
          <Card className="mx-auto max-w-4xl border-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
            <CardContent className="p-12 text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Ready to Start Monitoring?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of developers and businesses who trust WebTracker
                to keep their websites running smoothly.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                asChild
              >
                <a href="/add-website">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Website
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      
      
    </div>
  );
};

export default HomePage;
