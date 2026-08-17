import type { RouteObject } from 'react-router-dom';
import HomePage from './pages/HomePage';

/** FE2 소유 */
export const homeRoutes: RouteObject[] = [{ path: '/', element: <HomePage /> }];
