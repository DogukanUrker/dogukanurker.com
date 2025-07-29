"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Eye,
  Monitor,
  Users,
  Lock,
  Clock,
  Globe,
  Smartphone,
  TrendingUp,
  BarChart,
  Moon,
  Sun,
  ExternalLink,
  Timer,
  RefreshCw,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      // Silently fail for auto refresh
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
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter analytics password"
                  autoFocus
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data)
    return <div className="container mx-auto py-10">No data available</div>;

  const darkModePercentage =
    data.traffic.darkModeUsers.find((d) => d._id === true)?.count || 0;
  const lightModePercentage =
    data.traffic.darkModeUsers.find((d) => d._id === false)?.count || 0;
  const totalModeUsers = darkModePercentage + lightModePercentage;

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem("analytics_auth");
              setPassword("");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.uniqueVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Time on Page
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(Math.round(data.overview.avgTimeOnPage))}
            </div>
            <p className="text-xs text-muted-foreground">Per page view</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Load Time
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatLoadTime(data.overview.avgPageLoadTime)}
            </div>
            <p className="text-xs text-muted-foreground">
              Min: {formatLoadTime(data.overview.minPageLoadTime)} / Max:{" "}
              {formatLoadTime(data.overview.maxPageLoadTime)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.todayViews}</div>
            <p className="text-xs text-muted-foreground">views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.weekViews}</div>
            <p className="text-xs text-muted-foreground">views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.monthViews}</div>
            <p className="text-xs text-muted-foreground">views</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topPages.length === 0 ? (
                <p className="text-muted-foreground">No page data available</p>
              ) : (
                data.topPages.map((page, index) => (
                  <div key={page.path} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-mono text-sm">
                          {index + 1}.
                        </span>
                        <span className="font-medium truncate max-w-[200px]">
                          {page.path === "/" ? "Home" : page.path}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {formatDuration(page.avgTimeOnPage)} avg
                        </span>
                        <Badge variant="secondary">{page.views} views</Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Browsers */}
        <Card>
          <CardHeader>
            <CardTitle>Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.devices.browsers.slice(0, 5).map((browser) => {
                const total = data.devices.browsers.reduce(
                  (sum, b) => sum + b.count,
                  0,
                );
                const percentage = ((browser.count / total) * 100).toFixed(1);
                return (
                  <div
                    key={`${browser._id.name}-${browser._id.version}`}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {browser._id.name} {browser._id.version}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.devices.types.map((device) => {
                const total = data.devices.types.reduce(
                  (sum, d) => sum + d.count,
                  0,
                );
                const percentage = ((device.count / total) * 100).toFixed(1);
                return (
                  <div
                    key={device._id}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{device._id}</span>
                    <Badge>{percentage}%</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Operating Systems */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Operating Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.devices.os.slice(0, 5).map((os) => {
                const total = data.devices.os.reduce(
                  (sum, o) => sum + o.count,
                  0,
                );
                const percentage = ((os.count / total) * 100).toFixed(1);
                return (
                  <div
                    key={`${os._id.name}-${os._id.version}`}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium text-sm">
                      {os._id.name} {os._id.version}
                    </span>
                    <Badge variant="outline">{percentage}%</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dark Mode Preference */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </div>
                <span className="font-semibold">
                  {totalModeUsers > 0
                    ? `${((darkModePercentage / totalModeUsers) * 100).toFixed(0)}%`
                    : "0%"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span>Light Mode</span>
                </div>
                <span className="font-semibold">
                  {totalModeUsers > 0
                    ? `${((lightModePercentage / totalModeUsers) * 100).toFixed(0)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Screen Resolutions */}
        <Card>
          <CardHeader>
            <CardTitle>Screen Resolutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.devices.screenResolutions.slice(0, 5).map((res) => (
                <div
                  key={res._id}
                  className="flex items-center justify-between"
                >
                  <span className="font-mono text-sm">{res._id}</span>
                  <Badge variant="secondary">{res.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.traffic.languages.slice(0, 5).map((lang) => (
                <div
                  key={lang._id}
                  className="flex items-center justify-between"
                >
                  <span className="font-medium">{lang._id}</span>
                  <Badge variant="secondary">{lang.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Countries */}
      {data.traffic.countries && data.traffic.countries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.traffic.countries.slice(0, 10).map((country) => (
                <div
                  key={country._id}
                  className="flex items-center justify-between"
                >
                  <span className="font-medium">{country._id}</span>
                  <Badge variant="secondary">{country.count} visits</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referrers */}
      {data.traffic.referrers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.traffic.referrers.map((ref) => {
                let displayName = ref._id;
                let isValidUrl = false;

                try {
                  const url = new URL(ref._id);
                  displayName = url.hostname;
                  isValidUrl = true;
                } catch {
                  displayName = ref._id || "Direct";
                }

                return (
                  <div
                    key={ref._id}
                    className="flex items-center justify-between"
                  >
                    {isValidUrl ? (
                      <a
                        href={ref._id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sm hover:underline truncate max-w-[300px]"
                      >
                        {displayName}
                      </a>
                    ) : (
                      <span className="font-medium text-sm truncate max-w-[300px]">
                        {displayName}
                      </span>
                    )}
                    <Badge>{ref.count} visits</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hourly Traffic Pattern */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Traffic Pattern (Last 7 Days) (GMT)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 24 }, (_, hour) => {
              const hourData = data.traffic.hourlyPattern.find(
                (h) => h._id === hour,
              );
              const count = hourData?.count || 0;
              const maxCount = Math.max(
                ...data.traffic.hourlyPattern.map((h) => h.count),
              );
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

              return (
                <div key={hour} className="flex items-center gap-3">
                  <span className="text-sm font-mono w-12">
                    {hour.toString().padStart(2, "0")}:00
                  </span>
                  <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentVisits.map((visit, index) => {
              const visitDate = new Date(visit.timestamp);
              const visitKey = `${visit.timestamp}-${index}`;
              return (
                <div
                  key={visitKey}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {visit.path === "/" ? "Home" : visit.path}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {visit.device}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {visit.browser.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {visitDate.toLocaleString()} •{" "}
                      {formatDuration(visit.timeOnPage)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
