import { SemanticTokensParserResult } from '@anche/semantic-tokens-utilities';

import { BACKEND_URL } from '~/constants';

class APIService {
    private _baseUrl = BACKEND_URL;
    private _active = false;

    constructor() {
        this.ping();
    }

    public async ping(): Promise<boolean> {
        const res = await this._fetch('/ping');

        const json = await res.json();

        if (json?.success) {
            this._active = true;
        } else {
            this._active = false;
        }

        return this._active;
    }

    public isBackendActive(): boolean {
        return this._active;
    }

    public get<T>(endpoint: string, options?: RequestInit): Promise<T | undefined> {
        return this._request(endpoint, {
            ...options,
            method: 'get',
        });
    }

    public post<T>(endpoint: string, options?: RequestInit): Promise<T | undefined> {
        return this._request(endpoint, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        });
    }

    private _fetch(endpoint: string, options: RequestInit = {}): ReturnType<typeof window.fetch> {
        return window.fetch(`${this._baseUrl}${endpoint}`, {
            ...options,
        });
    }

    private async _request<T>(endpoint: string, options: RequestInit = {}): Promise<T | undefined> {
        if (!this._isActive()) {
            throw new Error('Backend is not available.');
        }

        const response = await this._fetch(endpoint, options);

        const json = await response.json();
        return json;
    }

    private _isActive(): boolean {
        if (!this._active) {
            console.warn('Backend is not active. Start the server and refresh the page.');
        }

        return this._active;
    }
}

const api = new APIService();

/* eslint-disable @typescript-eslint/explicit-function-return-type */

const API = {
    semanticTokensState: (body: { code: string; language: 'tsx' | 'ts' }) =>
        api.post<SemanticTokensParserResult>('/sh', {
            body: JSON.stringify(body),
        }),

    ping: () => api.get<boolean>('/ping'),
};

/* eslint-enable @typescript-eslint/explicit-function-return-type */
export default API;
