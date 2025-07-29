import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { headers } from "next/headers";

interface AnalyticsData {
  // User Information
  userId: string;
  sessionId: string;
  timestamp: Date;
  pageId: string; // Unique identifier for this page view

  // Page Information
  url: string;
  path: string;
  referrer: string | null;
  title: string;

  // Device Information
  userAgent: string;
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  device: string;

  // Screen Information
  screenResolution: string;
  viewportSize: string;
  colorDepth: number;

  // Location Information
  ipAddress: string | null;
  country: string | null;

  // Performance Metrics
  pageLoadTime: number | null;
  timeOnPage: number | null;
  lastUpdated?: Date;

  // Additional Context
  language: string;
  timezone: string;
  isDarkMode: boolean;
}

function parseUserAgent(ua: string) {
  // Browser detection
  const browser = { name: "Unknown", version: "Unknown" };
  if (ua.includes("Chrome")) {
    browser.name = "Chrome";
    const match = ua.match(/Chrome\/(\d+)/);
    if (match) browser.version = match[1];
  } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
    browser.name = "Safari";
    const match = ua.match(/Version\/(\d+)/);
    if (match) browser.version = match[1];
  } else if (ua.includes("Firefox")) {
    browser.name = "Firefox";
    const match = ua.match(/Firefox\/(\d+)/);
    if (match) browser.version = match[1];
  } else if (ua.includes("Edge")) {
    browser.name = "Edge";
    const match = ua.match(/Edge\/(\d+)/);
    if (match) browser.version = match[1];
  }

  // OS detection
  const os = { name: "Unknown", version: "Unknown" };
  if (ua.includes("Windows")) {
    os.name = "Windows";
    if (ua.includes("Windows NT 10.0")) os.version = "10";
    else if (ua.includes("Windows NT 6.3")) os.version = "8.1";
    else if (ua.includes("Windows NT 6.2")) os.version = "8";
  } else if (ua.includes("Mac OS X")) {
    os.name = "macOS";
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    if (match) os.version = match[1].replace("_", ".");
  } else if (ua.includes("Linux")) {
    os.name = "Linux";
  } else if (ua.includes("Android")) {
    os.name = "Android";
    const match = ua.match(/Android (\d+)/);
    if (match) os.version = match[1];
  } else if (ua.includes("iOS")) {
    os.name = "iOS";
    const match = ua.match(/OS (\d+)/);
    if (match) os.version = match[1];
  }

  // Device type detection
  let device = "Desktop"; // Default to Desktop
  if (ua.includes("Mobile")) {
    device = "Mobile";
  } else if (ua.includes("Tablet")) {
    device = "Tablet";
  }

  return { browser, os, device };
}

async function getCountryFromIP(ip: string | null): Promise<string | null> {
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return null; // Skip local/private IPs
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.country || null;
  } catch (error) {
    console.warn("Failed to get country from IP:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headersList = await headers();

    // Check if this is an update request
    const isUpdate = body.isUpdate === true;
    const pageId = body.pageId;

    // Get IP address (in production, this would come from x-forwarded-for or x-real-ip)
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      null;

    // Connect to MongoDB
    const client = await getClientPromise();
    const db = client.db(process.env.MONGODB_DB_NAME || "personal-website");
    const collection = db.collection(
      process.env.MONGODB_COLLECTION_NAME || "analytics",
    );

    if (isUpdate && pageId) {
      // Update existing document with timeOnPage
      await collection.updateOne(
        { pageId },
        {
          $set: {
            timeOnPage: body.timeOnPage,
            lastUpdated: new Date(),
          },
        },
      );

      return NextResponse.json(
        { success: true, action: "updated" },
        { status: 200 },
      );
    } else {
      // Parse user agent
      const userAgent = body.userAgent || headersList.get("user-agent") || "";
      const { browser, os, device } = parseUserAgent(userAgent);

      // Get country from IP address
      const country = await getCountryFromIP(ipAddress);

      // Prepare analytics data for new entry
      const analyticsData: AnalyticsData = {
        userId: body.userId,
        sessionId: body.sessionId,
        timestamp: new Date(),
        pageId: body.pageId,

        // Page Information
        url: body.url,
        path: body.path,
        referrer: body.referrer,
        title: body.title,

        // Device Information
        userAgent,
        browser,
        os,
        device,

        // Screen Information
        screenResolution: body.screenResolution,
        viewportSize: body.viewportSize,
        colorDepth: body.colorDepth,

        // Location Information
        ipAddress,
        country,

        // Performance Metrics
        pageLoadTime: body.pageLoadTime,
        timeOnPage: null, // Will be updated when user leaves

        // Additional Context
        language: body.language,
        timezone: body.timezone,
        isDarkMode: body.isDarkMode,
      };

      // Insert new document
      await collection.insertOne(analyticsData);

      return NextResponse.json(
        { success: true, action: "created" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Analytics error:", error);
    // Don't return error details to client for security
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

// GET endpoint for fetching analytics with password protection
export async function GET(req: NextRequest) {
  try {
    // Check for password in Authorization header
    const authHeader = req.headers.get("authorization");
    const expectedPassword = process.env.ANALYTICS_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: "Analytics password not configured" },
        { status: 500 },
      );
    }

    if (!authHeader || authHeader !== `Bearer ${expectedPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await getClientPromise();
    const db = client.db(process.env.MONGODB_DB_NAME || "personal-website");
    const collection = db.collection(
      process.env.MONGODB_COLLECTION_NAME || "analytics",
    );

    // Get date ranges
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    const monthAgo = new Date(now.setDate(now.getDate() - 30));

    // Fetch comprehensive analytics data
    const [
      totalViews,
      uniqueVisitors,
      todayViews,
      weekViews,
      monthViews,
      topPages,
      deviceStats,
      browserStats,
      osStats,
      languageStats,
      screenResolutions,
      referrerStats,
      avgTimeOnPage,
      pageLoadTimes,
      hourlyTraffic,
      darkModeStats,
      recentVisits,
    ] = await Promise.all([
      // Total views (all time)
      collection.countDocuments({}),

      // Unique visitors (all time)
      collection.distinct("userId"),

      // Views today
      collection.countDocuments({ timestamp: { $gte: todayStart } }),

      // Views this week
      collection.countDocuments({ timestamp: { $gte: weekAgo } }),

      // Views this month
      collection.countDocuments({ timestamp: { $gte: monthAgo } }),

      // Top pages
      collection
        .aggregate([
          {
            $group: {
              _id: "$path",
              count: { $sum: 1 },
              avgTime: { $avg: "$timeOnPage" },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),

      // Device type stats
      collection
        .aggregate([
          { $group: { _id: "$device", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),

      // Browser stats
      collection
        .aggregate([
          {
            $group: {
              _id: { name: "$browser.name", version: "$browser.version" },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),

      // OS stats
      collection
        .aggregate([
          {
            $group: {
              _id: { name: "$os.name", version: "$os.version" },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),

      // Language stats
      collection
        .aggregate([
          { $group: { _id: "$language", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),

      // Screen resolution stats
      collection
        .aggregate([
          { $group: { _id: "$screenResolution", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),

      // Referrer stats
      collection
        .aggregate([
          {
            $match: {
              referrer: {
                $exists: true,
                $nin: [null, ""],
                $not: { $regex: /^https?:\/\/localhost/ },
              },
            },
          },
          { $group: { _id: "$referrer", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),

      // Average time on page (in seconds)
      collection
        .aggregate([
          { $match: { timeOnPage: { $ne: null, $gt: 0 } } },
          { $group: { _id: null, avgTime: { $avg: "$timeOnPage" } } },
        ])
        .toArray(),

      // Page load time stats
      collection
        .aggregate([
          { $match: { pageLoadTime: { $ne: null, $gt: 0 } } },
          {
            $group: {
              _id: null,
              avgLoadTime: { $avg: "$pageLoadTime" },
              minLoadTime: { $min: "$pageLoadTime" },
              maxLoadTime: { $max: "$pageLoadTime" },
            },
          },
        ])
        .toArray(),

      // Hourly traffic pattern (last 7 days)
      collection
        .aggregate([
          { $match: { timestamp: { $gte: weekAgo } } },
          { $project: { hour: { $hour: "$timestamp" } } },
          { $group: { _id: "$hour", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      // Dark mode preference
      collection
        .aggregate([
          { $group: { _id: "$isDarkMode", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
        ])
        .toArray(),

      // Recent visits (last 20)
      collection
        .find({})
        .sort({ timestamp: -1 })
        .limit(20)
        .project({
          timestamp: 1,
          path: 1,
          timeOnPage: 1,
          browser: 1,
          device: 1,
        })
        .toArray(),
    ]);

    // Country stats - separate query to keep it simple
    const countryStats = await collection
      .aggregate([
        {
          $match: {
            country: { $exists: true, $ne: null },
          },
        },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    return NextResponse.json({
      overview: {
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        todayViews,
        weekViews,
        monthViews,
        avgTimeOnPage: avgTimeOnPage[0]?.avgTime || 0,
        avgPageLoadTime: pageLoadTimes[0]?.avgLoadTime || 0,
        minPageLoadTime: pageLoadTimes[0]?.minLoadTime || 0,
        maxPageLoadTime: pageLoadTimes[0]?.maxLoadTime || 0,
      },
      topPages: topPages.map((p) => ({
        path: p._id,
        views: p.count,
        avgTimeOnPage: Math.round(p.avgTime || 0),
      })),
      devices: {
        types: deviceStats,
        browsers: browserStats,
        os: osStats,
        screenResolutions,
      },
      traffic: {
        referrers: referrerStats,
        languages: languageStats,
        hourlyPattern: hourlyTraffic,
        darkModeUsers: darkModeStats,
        countries: countryStats,
      },
      recentVisits: recentVisits.map((v) => ({
        ...v,
        timeOnPage: v.timeOnPage || 0,
      })),
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
