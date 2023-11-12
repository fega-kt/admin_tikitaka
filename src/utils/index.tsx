import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { iconError, iconSuccess } from './icon';
export const API_URL = `http://localhost:3000`;
export const API_URL_AUTH = `${API_URL}/auth`;
import i18n from '../i18n/i18n';
export enum NotificationType {
  ERROR = 'error',
  SUCCESS = 'success',
}
export enum IconError {
  ERROR = 'error',
  SUCCESS = 'success',
}
export const setPageTitle = (title: string) => {
  window.document.title = title;
};
const ICON = {
  error: iconError,
  success: iconSuccess,
};
export const showNotification = (
  message = 'Something went wrong',
  type: NotificationType = NotificationType.ERROR,
  description?: string
) => {
  const icon: IconError = type as unknown as IconError;
  toast[type](message, {
    description: description,
    icon: ICON[icon],
    duration: 2000,
  });
};

export const handleNotiResponse = (
  error: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  callback?: () => void,
  errorMessage?: string,
  type: NotificationType = NotificationType.ERROR
) => {
  console.error(error);
  const t = i18n.t;
  if (!errorMessage) {
    errorMessage = 'Something went wrong';

    if (typeof error === 'string') {
      try {
        error = JSON.parse(error);
      } catch (error) {
        // do nothing
      }
    }

    if (error instanceof AxiosError && error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }
  }
  showNotification(t(errorMessage as string), type);

  if (callback) {
    return callback();
  }
};
