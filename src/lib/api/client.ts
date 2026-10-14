/**
 * Modular API Client
 * 
 * Supports both Mock Mode (for early development before backend is connected)
 * and Live Mode (calls your backend REST API using fetch with Bearer token).
 * 
 * Configure via .env.local:
 * - NEXT_PUBLIC_USE_MOCK_API=true / false
 * - NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

export const IS_MOCK_MODE =
  process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ||
  process.env.NEXT_PUBLIC_USE_MOCK_API === undefined;

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Get stored auth token from localStorage (safe for client side)
 */
export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dealersocket_auth_token');
}

/**
 * Store auth token in localStorage
 */
export function setStoredAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('dealersocket_auth_token', token);
  } else {
    localStorage.removeItem('dealersocket_auth_token');
  }
}

/**
 * Core HTTP Request Wrapper for Live Backend
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getStoredAuthToken();

  const reqHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(url, {
    ...customConfig,
    headers: reqHeaders,
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    const message =
      (errorData as { message?: string })?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
