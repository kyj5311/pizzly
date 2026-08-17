import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { PhoneFrame } from './shared/ui';

export default function App() {
  return (
    <PhoneFrame>
      <RouterProvider router={router} />
    </PhoneFrame>
  );
}
