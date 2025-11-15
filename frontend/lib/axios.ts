import { refreshAccessToken } from "@/app/auth/api/auth";
import { useAuthStore } from "@/store/auth-store";
import axios, { AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Get user's timezone (runs in browser)
const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn("Could not detect timezone, falling back to UTC:", error);
    return "UTC";
  }
};

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  paramsSerializer: {
    indexes: null, // ✅ This fixes array serialization
  },
});

// Create a separate instance for retries (no interceptors)
const apiRetry = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  paramsSerializer: {
    indexes: null, // ✅ This fixes array serialization
  },
});

let isRefreshing = false;

interface QueuedRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (error: Error) => void;
  originalRequest: any; // eslint-disable-line
}

let failedQueue: QueuedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (error) {
      reject(error);
    } else if (token) {
      // Use apiRetry to avoid triggering interceptor again
      originalRequest.headers.Authorization = `Bearer ${token}`;
      apiRetry(originalRequest).then(resolve).catch(reject);
    } else {
      reject(new Error("No token available"));
    }
  });
  failedQueue = [];
};

// Request interceptor with automatic timezone
api.interceptors.request.use(
  (config) => {
    const { user, token: accessToken } = useAuthStore.getState();

    // Only add auth if user exists and has token
    if (user && accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Automatically add timezone to all requests
    const timezone = getUserTimezone();

    if (config.method === "get" || !config.method) {
      // For GET requests, add to query params
      config.params = {
        ...config.params,
        timezone,
      };
    } else {
      // For POST/PUT/PATCH requests, add to data
      if (Array.isArray(config.data)) {
        // leave it as-is, add timezone to query instead
        config.params = {
          ...config.params,
          timezone,
        };
      } else if (config.data && typeof config.data === "object") {
        config.data = {
          ...config.data,
          timezone,
        };
      } else if (!config.data) {
        config.data = { timezone };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Also add timezone to retry instance
apiRetry.interceptors.request.use(
  (config) => {
    // Add timezone to retry requests too
    const timezone = getUserTimezone();

    if (config.method === "get" || !config.method) {
      config.params = {
        ...config.params,
        timezone,
      };
    } else {
      if (config.data && typeof config.data === "object") {
        config.data = {
          ...config.data,
          timezone,
        };
      } else if (!config.data) {
        config.data = { timezone };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    const { user, clearAuth, updateAccessToken } = useAuthStore.getState();

    // Only handle 401s that aren't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If no user is logged in, don't try to refresh
      if (!user) {
        console.log("📝 No user logged in - 401 expected");
        return Promise.reject(new Error("Authentication required"));
      }

      // Don't try to refresh if this IS the refresh token request
      if (originalRequest.url?.includes("/login/refresh-token")) {
        console.log("🚫 Refresh token request failed - clearing auth");
        clearAuth();

        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }

        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        console.log("⏳ Token refresh in progress - queueing request");
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            originalRequest,
          });
        });
      }

      console.log("🔄 Starting token refresh...");
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshAccessToken();

        if (refreshResponse?.access_token) {
          console.log("✅ Token refreshed successfully");
          updateAccessToken(refreshResponse.access_token);

          // Process all queued requests
          processQueue(null, refreshResponse.access_token);

          // Retry original request with apiRetry to avoid interceptor loop
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.access_token}`;
          return apiRetry(originalRequest); // ← Use apiRetry instead of api
        } else {
          throw new Error("No access token in refresh response");
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        const error =
          refreshError instanceof Error
            ? refreshError
            : new Error("Token refresh failed");
        processQueue(error, null);

        clearAuth();

        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
