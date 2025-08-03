"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Lock } from "lucide-react";

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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                placeholder="Enter password"
                autoFocus
                required
              />
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

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.uniqueVisitors.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.todayViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.weekViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.monthViews}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Time on Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatDuration(Math.round(data.overview.avgTimeOnPage))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Load Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatLoadTime(data.overview.avgPageLoadTime)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Min Load Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatLoadTime(data.overview.minPageLoadTime)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Max Load Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatLoadTime(data.overview.maxPageLoadTime)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Top Pages</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data.topPages.map((page, index) => (
                <div key={page.path} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-6">
                        {index + 1}.
                      </span>
                      <span className="font-medium">
                        {page.path === "/" ? "Home" : page.path}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(page.avgTimeOnPage)} avg
                      </span>
                      <Badge variant="secondary">{page.views} views</Badge>
                    </div>
                  </div>
                  <Progress
                    value={(page.views / data.overview.totalViews) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Devices & Browsers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Device Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.devices.types.map((device) => (
                  <div key={device._id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{device._id}</span>
                      <span className="text-sm font-medium">
                        {((device.count / totalDevices) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={(device.count / totalDevices) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Browsers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.devices.browsers.slice(0, 5).map((browser) => (
                  <div
                    key={`${browser._id.name}-${browser._id.version}`}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {browser._id.name} {browser._id.version}
                      </span>
                      <span className="text-sm font-medium">
                        {((browser.count / totalBrowsers) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={(browser.count / totalBrowsers) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Operating Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.devices.os.slice(0, 5).map((os) => (
                  <div
                    key={`${os._id.name}-${os._id.version}`}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {os._id.name} {os._id.version}
                      </span>
                      <span className="text-sm font-medium">
                        {((os.count / totalOS) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={(os.count / totalOS) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Screen Resolutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.devices.screenResolutions.slice(0, 5).map((res) => (
                  <div key={res._id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono">{res._id}</span>
                      <span className="text-sm font-medium">
                        {((res.count / totalScreens) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={(res.count / totalScreens) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.traffic.languages.slice(0, 5).map((lang) => (
                  <div key={lang._id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{lang._id}</span>
                      <span className="text-sm font-medium">
                        {((lang.count / totalLanguages) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={(lang.count / totalLanguages) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.traffic.referrers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No referrer data
                  </p>
                ) : (
                  data.traffic.referrers.slice(0, 5).map((ref) => {
                    let displayName = ref._id;
                    try {
                      const url = new URL(ref._id);
                      displayName = url.hostname;
                    } catch {
                      displayName = ref._id || "Direct";
                    }

                    return (
                      <div key={ref._id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm truncate">
                            {displayName}
                          </span>
                          <span className="text-sm font-medium">
                            {((ref.count / totalReferrers) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={(ref.count / totalReferrers) * 100}
                          className="h-2"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Theme Preference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark Mode</span>
                    <span className="text-sm font-medium">
                      {totalModeUsers > 0
                        ? `${((darkModeCount / totalModeUsers) * 100).toFixed(1)}%`
                        : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={
                      totalModeUsers > 0
                        ? (darkModeCount / totalModeUsers) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Light Mode</span>
                    <span className="text-sm font-medium">
                      {totalModeUsers > 0
                        ? `${((lightModeCount / totalModeUsers) * 100).toFixed(1)}%`
                        : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={
                      totalModeUsers > 0
                        ? (lightModeCount / totalModeUsers) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Top Countries</h2>
        <Card>
          <CardContent className="pt-6">
            {data.traffic.countries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No country data available
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {data.traffic.countries.slice(0, 10).map((country) => (
                  <div
                    key={country._id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span className="text-sm font-medium">{country._id}</span>
                    <Badge variant="secondary">{country.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Hourly Traffic Pattern (Last 7 Days, GMT)
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {Array.from({ length: 24 }, (_, hour) => {
                const hourData = data.traffic.hourlyPattern.find(
                  (h) => h._id === hour,
                );
                const count = hourData?.count || 0;
                const percentage = (count / maxHourlyTraffic) * 100;

                return (
                  <div key={hour} className="flex items-center gap-3">
                    <span className="text-xs font-mono w-10 text-muted-foreground">
                      {hour.toString().padStart(2, "0")}:00
                    </span>
                    <div className="flex-1">
                      <Progress value={percentage} className="h-3" />
                    </div>
                    <span className="text-xs w-10 text-right text-muted-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Visits</h2>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentVisits.map((visit, index) => {
                  const visitDate = new Date(visit.timestamp);
                  return (
                    <TableRow key={`${visit.timestamp}-${index}`}>
                      <TableCell className="text-sm">
                        {visitDate.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {visit.path === "/" ? "Home" : visit.path}
                      </TableCell>
                      <TableCell>{formatDuration(visit.timeOnPage)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{visit.device}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {visit.browser.name} {visit.browser.version}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
