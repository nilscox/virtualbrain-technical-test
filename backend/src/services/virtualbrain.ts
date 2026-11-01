import type { Readable } from 'stream';

import axios, { type AxiosError } from 'axios';

import { requireEnv } from '../utils.ts';

const client = axios.create({ baseURL: 'https://chatbot-api.getvirtualbrain.com/v1' });

/** Axios errors hold the request config: rethrow without it to keep the credentials out of the logs */
client.interceptors.response.use(undefined, (error: AxiosError) => {
  throw new Error(`VirtualBrain request failed: ${error.response?.status ?? error.code}`);
});

/** Renew the access token a bit before it expires */
const EXPIRATION_MARGIN = 60 * 1000;

/**
 * Send a query to the chatbot, its answer is streamed as plain text
 */
export async function queryChatbot(query: string): Promise<Readable> {
  const { accessToken, chatbotId } = await getToken();

  const { data } = await client.post<Readable>(
    `/open-completion/${chatbotId}/query`,
    { query },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'stream',
    },
  );

  return data;
}

type ApiKeyTokenResponse = {
  accessToken: string;
  /** Access token TTL in seconds */
  expiresIn: number;
  chatbotId: string;
};

type Token = {
  accessToken: string;
  chatbotId: string;
  expiresAt: number;
};

let token: Token | undefined;

/**
 * Exchange the API key for an access token, reused until it expires
 */
async function getToken() {
  if (token && Date.now() < token.expiresAt) {
    return token;
  }

  // Read on demand: the server must start without a key, to export the pokemons the chatbot is built from
  const apiKey = requireEnv('VB_API_KEY');

  const { data } = await client.post<ApiKeyTokenResponse>('/auth/api-key/token', { apiKey });

  token = {
    accessToken: data.accessToken,
    chatbotId: data.chatbotId,
    expiresAt: Date.now() + data.expiresIn * 1000 - EXPIRATION_MARGIN,
  };

  return token;
}
