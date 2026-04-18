export interface ExpandDescriptionPayload {
  description: string;
}

export interface ExpandDescriptionResponse {
  expandedDescription: string;
}

export class ApiServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiServiceError';
    this.status = status;
  }
}

export async function expandDescription(
  payload: ExpandDescriptionPayload,
  signal?: AbortSignal
): Promise<ExpandDescriptionResponse> {
  const response = await fetch('/api/expand-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new ApiServiceError('Expand description request failed', response.status);
  }

  const data: unknown = await response.json();

  if (!isExpandDescriptionResponse(data)) {
    throw new Error('INVALID_AI_RESPONSE');
  }

  return data;
}

function isExpandDescriptionResponse(value: unknown): value is ExpandDescriptionResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const result = value as Partial<ExpandDescriptionResponse>;
  return typeof result.expandedDescription === 'string' && result.expandedDescription.trim().length > 0;
}
