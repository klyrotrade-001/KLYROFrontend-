import { CartItem, CategoryInfo, CustomerDetails, Product } from '@/src/types';

// Always call backend directly — works regardless of which Next.js build is deployed
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://klyroback.onrender.com/api'
).replace(/\/+$/, '');

type ApiResponse<T extends object> = {
  success: boolean;
  error?: string;
} & T;

async function requestApi<T extends object>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store', // Always fetch fresh data — no stale product cache
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`The API returned an invalid response (${response.status})`);
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('success' in payload) ||
    typeof payload.success !== 'boolean'
  ) {
    throw new Error(`The API returned an invalid response (${response.status})`);
  }

  const result = payload as ApiResponse<T>;
  if (!response.ok || !result.success) {
    throw new Error(result.error || `API request failed (${response.status})`);
  }

  return result;
}

export async function getProducts(options: {
  category?: string;
  limit?: number;
  search?: string;
  sort?: string;
} = {}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (options.category) query.set('category', options.category);
  if (options.limit !== undefined) query.set('limit', String(options.limit));
  if (options.search) query.set('search', options.search);
  if (options.sort) query.set('sort', options.sort);

  const queryString = query.toString();
  const suffix = queryString ? `?${queryString}` : '';
  const result = await requestApi<{ products: Product[] }>(`/products${suffix}`);
  return result.products;
}

export async function getProduct(idOrSlug: string): Promise<Product> {
  const result = await requestApi<{ product: Product }>(`/products/${idOrSlug}`);
  return result.product;
}

export async function getCategories(): Promise<CategoryInfo[]> {
  const result = await requestApi<{ categories: CategoryInfo[] }>('/categories');
  return result.categories;
}

export async function createOrder(customer: CustomerDetails, items: CartItem[]) {
  return requestApi<{
    orderId: string;
    whatsappUrl?: string;
  }>('/orders', {
    method: 'POST',
    body: JSON.stringify({ customer, items }),
  });
}

export async function subscribeToNewsletter(email: string) {
  return requestApi<{ message: string }>('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
