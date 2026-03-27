const API_BASE_URL = 'https://known-ignored-delays-par.trycloudflare.com';

export interface QueryResponse {
  answer?: string;
  reasoning?: string;
  error?: string;
  agent?: string;
  language?: string;
  image_base64?: string;
  video_base64?: string;
}

export async function sendMessage(query: string): Promise<QueryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {
      error: error instanceof Error ? error.message : 'Nastala chyba pri komunikácii s AI.',
    };
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
