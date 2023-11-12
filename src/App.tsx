import { Toaster } from 'sonner';
import { RouterProvider } from 'react-router-dom';
import { browserRouter } from './routes/browserRouter';

function App() {
  return (
    <div className="fade-in">
      <RouterProvider router={browserRouter} />
      <Toaster
        expand={true}
        position="top-center"
        closeButton
        offset={'15px'}
        richColors
      />
    </div>
  );
}

export default App;
