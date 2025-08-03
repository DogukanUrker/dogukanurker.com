"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RefreshCw,
  Lock,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Zap,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  MousePointer,
  Timer,
  Gauge,
  Moon,
  Sun,
  ExternalLink,
  MapPin,
  Languages,
  Maximize2,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    todayViews: number;
    weekViews: number;
    monthViews: number;
    avgTimeOnPage: number;
    avgPageLoadTime: number;
    minPageLoadTime: number;
    maxPageLoadTime: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    avgTimeOnPage: number;
  }>;
  devices: {
    types: Array<{ _id: string; count: number }>;
    browsers: Array<{ _id: { name: string; version: string }; count: number }>;
    os: Array<{ _id: { name: string; version: string }; count: number }>;
    screenResolutions: Array<{ _id: string; count: number }>;
  };
  traffic: {
    referrers: Array<{ _id: string; count: number }>;
    languages: Array<{ _id: string; count: number }>;
    hourlyPattern: Array<{ _id: number; count: number }>;
    darkModeUsers: Array<{ _id: boolean; count: number }>;
    countries: Array<{ _id: string; count: number }>;
  };
  recentVisits: Array<{
    timestamp: string;
    path: string;
    timeOnPage: number;
    browser: { name: string; version: string };
    device: string;
  }>;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatLoadTime(ms: number): string {
  const absMs = Math.abs(ms);
  if (absMs < 1000) return `${Math.round(absMs)}ms`;
  return `${(absMs / 1000).toFixed(2)}s`;
}

function getDeviceIcon(device: string) {
  switch (device.toLowerCase()) {
    case "mobile":
      return <Smartphone className="h-4 w-4" />;
    case "tablet":
      return <Tablet className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
}

function getBrowserIcon(browser: string) {
  if (browser.toLowerCase().includes("chrome")) {
    return <Chrome className="h-4 w-4" />;
  }
  return <Globe className="h-4 w-4" />;
}

function calculateTrend(
  current: number,
  previous: number,
): { value: number; isPositive: boolean } {
  if (previous === 0) return { value: 0, isPositive: true };
  const percentChange = ((current - previous) / previous) * 100;
  return { value: Math.abs(percentChange), isPositive: percentChange >= 0 };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
    if (!password) return;

    setRefreshing(true);
    try {
      const response = await fetch("/api/analytics", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch {
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analytics", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
        setIsAuthenticated(true);
        sessionStorage.setItem("analytics_auth", password);
      } else if (response.status === 401) {
        setError("Invalid password");
      } else {
        setError("Failed to fetch analytics");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("analytics_auth");
    if (storedAuth) {
      setPassword(storedAuth);
      const form = document.querySelector("form");
      if (form) {
        form.requestSubmit();
      }
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              Analytics Dashboard
            </CardTitle>
            <CardDescription className="text-center">
              Enter your password to access analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="Enter password"
                  autoFocus
                  required
                />
              </div>
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data)
    return <div className="container mx-auto py-10">No data available</div>;

  const totalDevices = data.devices.types.reduce((sum, d) => sum + d.count, 0);
  const totalBrowsers = data.devices.browsers.reduce(
    (sum, b) => sum + b.count,
    0,
  );
  const totalOS = data.devices.os.reduce((sum, o) => sum + o.count, 0);
  const totalScreens = data.devices.screenResolutions.reduce(
    (sum, s) => sum + s.count,
    0,
  );
  const totalLanguages = data.traffic.languages.reduce(
    (sum, l) => sum + l.count,
    0,
  );
  const totalReferrers = data.traffic.referrers.reduce(
    (sum, r) => sum + r.count,
    0,
  );
  const maxHourlyTraffic = Math.max(
    ...data.traffic.hourlyPattern.map((h) => h.count),
    1,
  );
  const darkModeCount =
    data.traffic.darkModeUsers.find((d) => d._id === true)?.count || 0;
  const lightModeCount =
    data.traffic.darkModeUsers.find((d) => d._id === false)?.count || 0;
  const totalModeUsers = darkModeCount + lightModeCount;

  const weekTrend = calculateTrend(
    data.overview.weekViews,
    data.overview.monthViews / 4,
  );
  const todayTrend = calculateTrend(
    data.overview.todayViews,
    data.overview.weekViews / 7,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto py-4 md:py-8 space-y-6 md:space-y-8 px-4 md:px-6 max-w-[1400px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Real-time insights and metrics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto py-2.5 sm:py-1.5"
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="sm:inline">Refresh</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto py-2.5 sm:py-1.5"
              onClick={() => {
                setIsAuthenticated(false);
                sessionStorage.removeItem("analytics_auth");
                setPassword("");
              }}
            >
              <span className="sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {data.overview.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time page views
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unique Visitors
                </CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {data.overview.uniqueVisitors.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Individual users tracked
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today&apos;s Traffic
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {data.overview.todayViews}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {todayTrend.isPositive ? (
                  <ArrowUp className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${todayTrend.isPositive ? "text-green-500" : "text-red-500"}`}
                >
                  {todayTrend.value.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs daily avg
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Time on Page
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {formatDuration(Math.round(data.overview.avgTimeOnPage))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                User engagement time
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {data.overview.weekViews}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {weekTrend.isPositive ? (
                  <ArrowUp className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs ${weekTrend.isPositive ? "text-green-500" : "text-red-500"}`}
                >
                  {weekTrend.value.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {data.overview.monthViews}
              </div>
              <p className="text-xs text-muted-foreground mt-1">30 day total</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Load Performance
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {formatLoadTime(data.overview.avgPageLoadTime)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average load time
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Performance Range
                </CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Min</span>
                  <span className="font-mono font-medium text-green-600">
                    {formatLoadTime(data.overview.minPageLoadTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Max</span>
                  <span className="font-mono font-medium text-red-600">
                    {formatLoadTime(data.overview.maxPageLoadTime)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Top Pages
                </CardTitle>
                <CardDescription>
                  Most visited pages on your site
                </CardDescription>
              </div>
              <MousePointer className="h-5 w-5 text-muted-foreground hidden sm:block" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              {data.topPages.map((page, index) => {
                const percentage =
                  (page.views / data.overview.totalViews) * 100;
                return (
                  <div key={page.path} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-bold
                          ${
                            index === 0
                              ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                              : index === 1
                                ? "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                                : index === 2
                                  ? "bg-orange-500/20 text-orange-700 dark:text-orange-400"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm md:text-base">
                            {page.path === "/" ? "Homepage" : page.path}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Average time: {formatDuration(page.avgTimeOnPage)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-10 sm:ml-0">
                        <p className="font-semibold text-sm md:text-base">
                          {page.views.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg md:text-xl font-semibold">
                    Device Distribution
                  </CardTitle>
                  <CardDescription>
                    User devices accessing your site
                  </CardDescription>
                </div>
                <Monitor className="h-5 w-5 text-muted-foreground hidden sm:block" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.devices.types.map((device) => {
                  const percentage = (device.count / totalDevices) * 100;
                  return (
                    <div key={device._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device._id)}
                          <span className="font-medium text-sm md:text-base">
                            {device._id}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-sm md:text-base">
                            {percentage.toFixed(1)}%
                          </span>
                          <span className="text-xs md:text-sm text-muted-foreground ml-2">
                            ({device.count})
                          </span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2 md:h-3" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg md:text-xl font-semibold">
                    Browser Usage
                  </CardTitle>
                  <CardDescription>Top browsers by usage</CardDescription>
                </div>
                <Globe className="h-5 w-5 text-muted-foreground hidden sm:block" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.devices.browsers.slice(0, 5).map((browser) => {
                  const percentage = (browser.count / totalBrowsers) * 100;
                  return (
                    <div
                      key={`${browser._id.name}-${browser._id.version}`}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getBrowserIcon(browser._id.name)}
                          <span className="font-medium text-sm md:text-base">
                            {browser._id.name} {browser._id.version}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-sm md:text-base">
                            {percentage.toFixed(1)}%
                          </span>
                          <span className="text-xs md:text-sm text-muted-foreground ml-2">
                            ({browser.count})
                          </span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2 md:h-3" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg font-semibold">
                  Operating Systems
                </CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.devices.os.slice(0, 5).map((os) => {
                const percentage = (os.count / totalOS) * 100;
                return (
                  <div
                    key={`${os._id.name}-${os._id.version}`}
                    className="flex items-center justify-between p-2 md:p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-xs md:text-sm font-medium">
                      {os._id.name} {os._id.version}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg font-semibold">
                  Screen Resolutions
                </CardTitle>
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.devices.screenResolutions.slice(0, 5).map((res) => {
                const percentage = (res.count / totalScreens) * 100;
                return (
                  <div
                    key={res._id}
                    className="flex items-center justify-between p-2 md:p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-xs md:text-sm font-mono">
                      {res._id}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg font-semibold">
                  Theme Preference
                </CardTitle>
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 md:p-4 bg-gray-900/5 dark:bg-gray-100/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Moon className="h-4 md:h-5 w-4 md:w-5" />
                    <span className="font-medium text-sm md:text-base">
                      Dark Mode
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg md:text-2xl font-bold">
                      {totalModeUsers > 0
                        ? `${((darkModeCount / totalModeUsers) * 100).toFixed(0)}%`
                        : "0%"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {darkModeCount} users
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 md:p-4 bg-yellow-500/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Sun className="h-4 md:h-5 w-4 md:w-5" />
                    <span className="font-medium text-sm md:text-base">
                      Light Mode
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg md:text-2xl font-bold">
                      {totalModeUsers > 0
                        ? `${((lightModeCount / totalModeUsers) * 100).toFixed(0)}%`
                        : "0%"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lightModeCount} users
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg md:text-xl font-semibold">
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>
                    Visitor locations by country
                  </CardDescription>
                </div>
                <MapPin className="h-5 w-5 text-muted-foreground hidden sm:block" />
              </div>
            </CardHeader>
            <CardContent>
              {data.traffic.countries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No geographic data available
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {data.traffic.countries.slice(0, 10).map((country, index) => (
                    <div
                      key={country._id}
                      className="flex items-center justify-between p-2 md:p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-medium">
                          {index + 1}.
                        </span>
                        <span className="font-medium text-sm md:text-base">
                          {country._id}
                        </span>
                      </div>
                      <Badge
                        variant={index < 3 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {country.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg md:text-xl font-semibold">
                    Traffic Sources
                  </CardTitle>
                  <CardDescription>
                    Where your visitors come from
                  </CardDescription>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground hidden sm:block" />
              </div>
            </CardHeader>
            <CardContent>
              {data.traffic.referrers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No referrer data available
                </p>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {data.traffic.referrers.slice(0, 6).map((ref) => {
                    let displayName = ref._id;
                    let favicon = "";
                    try {
                      const url = new URL(ref._id);
                      displayName = url.hostname;
                      favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
                    } catch {
                      displayName = ref._id || "Direct Traffic";
                    }

                    const percentage = (ref.count / totalReferrers) * 100;

                    return (
                      <div
                        key={ref._id}
                        className="flex items-center justify-between p-2 md:p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                          {favicon && (
                            <Image
                              src={favicon}
                              alt=""
                              width={16}
                              height={16}
                              className="w-4 h-4 rounded flex-shrink-0"
                            />
                          )}
                          <span className="font-medium text-xs md:text-sm truncate">
                            {displayName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs md:text-sm text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {ref.count}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Languages
                </CardTitle>
                <CardDescription>Visitor language preferences</CardDescription>
              </div>
              <Languages className="h-5 w-5 text-muted-foreground hidden sm:block" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
              {data.traffic.languages.map((lang) => {
                const percentage = (lang.count / totalLanguages) * 100;
                return (
                  <div
                    key={lang._id}
                    className="p-3 md:p-4 bg-muted/50 rounded-lg text-center hover:bg-muted/70 transition-colors"
                  >
                    <p className="font-mono font-semibold text-sm md:text-lg">
                      {lang._id}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang.count} users
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Hourly Traffic Pattern
                </CardTitle>
                <CardDescription>
                  Last 7 days activity by hour (GMT)
                </CardDescription>
              </div>
              <Timer className="h-5 w-5 text-muted-foreground hidden sm:block" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Array.from({ length: 24 }, (_, hour) => {
                const hourData = data.traffic.hourlyPattern.find(
                  (h) => h._id === hour,
                );
                const count = hourData?.count || 0;
                const percentage = (count / maxHourlyTraffic) * 100;
                const isActive = percentage > 50;
                const isPeak = percentage > 75;

                return (
                  <div
                    key={hour}
                    className="flex items-center gap-2 md:gap-3 group"
                  >
                    <span className="text-xs font-mono w-8 md:w-10 text-muted-foreground group-hover:text-foreground transition-colors">
                      {hour.toString().padStart(2, "0")}:00
                    </span>
                    <div className="flex-1 relative h-5 md:h-6 bg-muted/50 rounded overflow-hidden group-hover:bg-muted/70 transition-colors">
                      <div
                        className={`absolute inset-y-0 left-0 transition-all duration-500 rounded
                          ${
                            isPeak
                              ? "bg-red-500"
                              : isActive
                                ? "bg-blue-500"
                                : "bg-muted-foreground/30"
                          }`}
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center px-2">
                        <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {count} visits
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest visitor sessions</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground hidden sm:block" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="px-4 md:px-0 min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-xs md:text-sm">
                        Timestamp
                      </TableHead>
                      <TableHead className="font-semibold text-xs md:text-sm">
                        Page
                      </TableHead>
                      <TableHead className="font-semibold text-xs md:text-sm">
                        Duration
                      </TableHead>
                      <TableHead className="font-semibold text-xs md:text-sm">
                        Device
                      </TableHead>
                      <TableHead className="font-semibold text-xs md:text-sm">
                        Browser
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentVisits.map((visit, index) => {
                      const visitDate = new Date(visit.timestamp);
                      const timeAgo = getTimeAgo(visitDate);

                      return (
                        <TableRow
                          key={`${visit.timestamp}-${index}`}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium text-xs md:text-sm">
                                {visitDate.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {visitDate.toLocaleTimeString()} • {timeAgo}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 md:gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span className="font-medium text-xs md:text-sm">
                                {visit.path === "/" ? "Homepage" : visit.path}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="font-mono text-xs"
                            >
                              {formatDuration(visit.timeOnPage)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getDeviceIcon(visit.device)}
                              <span className="text-xs md:text-sm">
                                {visit.device}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getBrowserIcon(visit.browser.name)}
                              <span className="text-xs md:text-sm">
                                {visit.browser.name} {visit.browser.version}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
