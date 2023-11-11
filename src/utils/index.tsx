import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { iconError, iconSuccess } from './icon';
export const API_URL = `http://localhost:3000`;
export const API_URL_AUTH = `${API_URL}/auth`;

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
  description?: string,
  icon: IconError = IconError.ERROR
) => {
  toast[type](message, {
    description: description,
    // position: 'top-center',
    icon: ICON[icon],
  });
};

export const handleErrorResponse = (
  error: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  callback?: () => void,
  errorMessage?: string
) => {
  console.error(error);

  if (!errorMessage) {
    errorMessage = 'Something went wrong';

    if (typeof error === 'string') {
      try {
        error = JSON.parse(error);
      } catch (error) {
        // do nothing
      }
    }

    if (error instanceof AxiosError && error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
  }

  showNotification(
    errorMessage &&
      errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
    NotificationType.ERROR
  );

  if (callback) {
    return callback();
  }
};
