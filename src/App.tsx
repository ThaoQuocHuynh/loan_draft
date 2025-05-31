// react + libraries
import { RouterProvider } from 'react-router-dom';
// application components
import { ContextProvider } from './ContextProvider.tsx';
import { router } from './Routing.tsx';

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  );
}

export default App;
