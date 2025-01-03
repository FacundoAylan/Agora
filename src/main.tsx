import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store} from './components/redux/store'; // Asegúrate de importar `persistor`
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Home from './components/01_home/Home.tsx';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    index: true, 
  },
  {
    path: '/room/:CHANNEL',
    element: <Home />,
  },
  {
    path: '*', // Ruta para 404
    element: <div>404 - Page Not Found</div>, // Página 404 sencilla
  },
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    {/* PersistGate asegura que el estado esté cargado antes de renderizar */}
      <RouterProvider router={router} />
  </Provider>
);
