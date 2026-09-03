import type { ApiResponse } from '../../shared/types';

const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export async function requestApi<T>(
  path: string,
  init?: RequestInit,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_ORIGIN}${path}`, {
      ...init,
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiRequestError(
      'We could not reach PayFlex. Check your connection and try again.',
      0,
      'NETWORK_ERROR',
    );
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !payload?.success) {
    const failure = payload && !payload.success ? payload.error : null;
    throw new ApiRequestError(
      failure?.message ?? 'Something unexpected happened. Please try again.',
      response.status,
      failure?.code ?? 'UNKNOWN_ERROR',
    );
  }

  return payload.data;
}
