import type { Readable } from 'stream';

import axios, { type AxiosError } from 'axios';

import { requireEnv } from '../utils.ts';

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

export class VirtualBrainClient {
  private readonly client = axios.create({ baseURL: 'https://chatbot-api.getvirtualbrain.com/v1' });
  /** Renew the access token a bit before it expires */
  private readonly expirationMargin = 60 * 1000;
  private token: Token | undefined;

  constructor() {
    /** Axios errors hold the request config: rethrow without it to keep the credentials out of the logs */
    this.client.interceptors.response.use(undefined, (error: AxiosError) => {
      throw new Error(`VirtualBrain request failed: ${error.response?.status ?? error.code}`);
    });
  }

  /**
   * Send a query to the chatbot, its answer is streamed as plain text
   */
  async queryChatbot(query: string): Promise<Readable> {
    const { accessToken, chatbotId } = await this.getToken();

    const { data } = await this.client.post<Readable>(
      `/open-completion/${chatbotId}/query`,
      { query },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'stream',
      },
    );

    return data;
  }

  /**
   * Exchange the API key for an access token, reused until it expires
   */
  private async getToken() {
    if (this.token && Date.now() < this.token.expiresAt) {
      return this.token;
    }

    // Read on demand: the server must start without a key, to export the pokemons the chatbot is built from
    const { data } = await this.client.post<ApiKeyTokenResponse>('/auth/api-key/token', {
      apiKey: requireEnv('VB_API_KEY'),
    });

    this.token = {
      accessToken: data.accessToken,
      chatbotId: data.chatbotId,
      expiresAt: Date.now() + data.expiresIn * 1000 - this.expirationMargin,
    };

    return this.token;
  }
}
