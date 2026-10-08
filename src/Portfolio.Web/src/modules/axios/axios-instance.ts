import { configuration } from '@config';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { enqueueSnackbar, VariantType } from 'notistack';
import { TranslationKey } from '@types';
import i18n from '../i18n/i18n';

type ApiNotificationOptions = {
  success?: boolean,
  error?: boolean,
  successMessage?: string,
  errorMessage?: string,
};

declare module 'axios' {
  export interface AxiosRequestConfig {
    apiNotifications?: boolean | ApiNotificationOptions,
  }

  export interface InternalAxiosRequestConfig {
    apiNotifications?: boolean | ApiNotificationOptions,
  }
}

const notificationsEnabled = (
  config: InternalAxiosRequestConfig | undefined,
  type: 'success' | 'error',
) => {
  const options = config?.apiNotifications;
  if (options === false) return false;
  if (typeof options === 'object' && options[type] === false) return false;
  return true;
};

const configuredMessage = (
  config: InternalAxiosRequestConfig | undefined,
  type: 'success' | 'error',
) => {
  const options = config?.apiNotifications;
  if (typeof options !== 'object') return undefined;
  return type === 'success' ? options.successMessage : options.errorMessage;
};

const extractApiMessage = (data: unknown): string | undefined => {
  if (typeof data === 'string') return data.trim() || undefined;
  if (!data || typeof data !== 'object') return undefined;

  const value = data as Record<string, unknown>;
  if (typeof value.messageKey === 'string' && i18n.exists(value.messageKey)) {
    return i18n.t(value.messageKey as TranslationKey);
  }

  for (const key of ['message', 'Message', 'detail', 'title']) {
    if (typeof value[key] === 'string' && value[key].trim()) {
      return value[key].trim();
    }
  }

  if (value.errors && typeof value.errors === 'object') {
    const messages = Object.values(value.errors as Record<string, unknown>)
      .flatMap((item) => Array.isArray(item) ? item : [item])
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    if (messages.length) return messages.join(' ');
  }

  return undefined;
};

const requestLabel = (config: InternalAxiosRequestConfig | undefined) => {
  const method = config?.method?.toUpperCase() ?? 'API';
  return `${method} ${config?.url ?? ''}`.trim();
};

const showNotification = (message: string, variant: VariantType, key: string) => {
  enqueueSnackbar(message, {
    variant,
    key,
    preventDuplicate: true,
    autoHideDuration: variant === 'error' ? 8000 : 4500,
  });
};

const successMessage = (response: AxiosResponse) =>
  configuredMessage(response.config, 'success')
  ?? extractApiMessage(response.data)
  ?? i18n.t('api.success', {
    request: requestLabel(response.config),
    status: response.status,
  });

const errorMessage = (error: AxiosError) => {
  const status = error.response?.status;
  return configuredMessage(error.config, 'error')
    ?? extractApiMessage(error.response?.data)
    ?? (status
      ? i18n.t('api.httpError', {
        request: requestLabel(error.config),
        status,
      })
      : i18n.t('api.networkError'));
};

export const axiosInstance = axios.create({
  baseURL: configuration.serverUrl,
  timeout: 30000,
  withCredentials: true,
  // The antiforgery cookie and the request token are different values.
  // Axios would replace the header below with the cookie and the API would reject the call.
  withXSRFToken: false,
});

let csrfInitialization: Promise<string> | undefined;
let csrfToken: string | undefined;
axiosInstance.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase() ?? 'GET';
  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)
      && typeof document !== 'undefined') {
    if (!csrfToken) {
      csrfInitialization ??= axios.get<{ token: string }>(
        `${configuration.serverUrl}/api/security/csrf`,
        { withCredentials: true },
      ).then((response) => response.data.token)
        .finally(() => {
          csrfInitialization = undefined;
        });
      csrfToken = await csrfInitialization;
    }

    config.headers.set('X-XSRF-TOKEN', csrfToken);
  }
  window.dispatchEvent(new CustomEvent('portfolio:api-start'));
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    window.dispatchEvent(new CustomEvent('portfolio:api-end'));
    if (notificationsEnabled(response.config, 'success')) {
      const message = successMessage(response);
      showNotification(
        message,
        'success',
        `api-success:${requestLabel(response.config)}:${response.status}:${message}`,
      );
    }
    return response;
  },
  (error: AxiosError) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio:api-end'));
    }
    if (notificationsEnabled(error.config, 'error')) {
      const message = errorMessage(error);
      const status = error.response?.status;
      const variant: VariantType = status === 401 || status === 403 ? 'warning' : 'error';
      showNotification(
        message,
        variant,
        `api-error:${requestLabel(error.config)}:${status ?? 'network'}:${message}`,
      );
    }

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio:session-expired'));
    }
    return Promise.reject(error);
  },
);
