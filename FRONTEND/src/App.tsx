// src/App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import Home from '@/screens/home/index';
import ResultPage from '@/screens/home/Result'; // Import the new ResultPage component

import '@/index.css';

const paths = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/result',
    element: <ResultPage />,  // Define the route for the result page
  },
];

const BrowserRouter = createBrowserRouter(paths);

const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={BrowserRouter} />
    </MantineProvider>
  );
};

export default App;
