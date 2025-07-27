"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getUserId(): string {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem("analytics_user_id");
  if (stored) return stored;

  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem("analytics_user_id", newId);
  return newId;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";

  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const stored = sessionStorage.getItem("analytics_session_id");
  const lastActivity = sessionStorage.getItem("analytics_last_activity");

  if (stored && lastActivity) {
    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    if (timeSinceLastActivity < SESSION_TIMEOUT) {
      sessionStorage.setItem("analytics_last_activity", Date.now().toString());
      return stored;
    }
  }

  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem("analytics_session_id", newId);
  sessionStorage.setItem("analytics_last_activity", Date.now().toString());
  return newId;
}

function generatePageId(): string {
  return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useAnalytics() {
  const pathname = usePathname();
  const pageLoadTime = useRef<number>(0);
  const pageStartTime = useRef<number>(Date.now());
  const pageId = useRef<string>(generatePageId());
  const isTracked = useRef<boolean>(false);

  useEffect(() => {
    const excludedPaths = ["/analytics"];
    if (excludedPaths.includes(pathname)) {
      return;
    }

    if (isTracked.current) return;
    isTracked.current = true;

    pageId.current = generatePageId();
    pageStartTime.current = Date.now();

    if (typeof window !== "undefined" && window.performance) {
      const perfData = window.performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (perfData && perfData.loadEventEnd > 0) {
        pageLoadTime.current = Math.max(
          0,
          perfData.loadEventEnd - perfData.fetchStart,
        );
      }
    }

    // Collect analytics data
    const analyticsData = {
      userId: getUserId(),
      sessionId: getSessionId(),
      pageId: pageId.current,

      // Page Information
      url: window.location.href,
      path: pathname,
      referrer: document.referrer || null,
      title: document.title,

      // Device Information
      userAgent: navigator.userAgent,

      // Screen Information
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: screen.colorDepth,

      // Performance Metrics
      pageLoadTime: pageLoadTime.current,

      // Additional Context
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
    };

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analyticsData),
    }).catch(() => {});

    const handleUnload = () => {
      const timeOnPageMs = Date.now() - pageStartTime.current;
      const timeOnPageSeconds = Math.round(timeOnPageMs / 1000);

      const updateData = {
        pageId: pageId.current,
        timeOnPage: timeOnPageSeconds,
        isUpdate: true,
      };

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", JSON.stringify(updateData));
      } else {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
          keepalive: true,
        }).catch(() => {});
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleUnload);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      isTracked.current = false;
    };
  }, [pathname]);
}
