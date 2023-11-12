import { Toaster } from 'sonner';
import { RouterProvider } from 'react-router-dom';
import { browserRouter } from './routes/browserRouter';
import { NotificationType, showNotification } from './utils';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ErrorPage from './components/errorPage';
function App() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState<boolean>(window.navigator.onLine);
  useEffect(() => {
    const handleChangeOnline = () => {
      const online = window.navigator.onLine;
      setIsOnline(online);
      if (online) {
        showNotification(
          t('Success'),
          NotificationType.SUCCESS,
          t('Network Connected'),
          5000
        );
      } else {
        showNotification(
          t('Error'),
          NotificationType.ERROR,
          t('Network Error'),
          5000
        );
      }
    };
    window.addEventListener('offline', handleChangeOnline);
    window.addEventListener('online', handleChangeOnline);

    return () => {
      window.removeEventListener('offline', handleChangeOnline);
      window.removeEventListener('online', handleChangeOnline);
    };
  }, []);
  return (
    <div className="fade-in">
      {isOnline ? <RouterProvider router={browserRouter} /> : <ErrorPage />}
      <Toaster
        expand={true}
        position="bottom-left"
        closeButton
        offset={'15px'}
        richColors
      />
    </div>
  );
}

export default App;
