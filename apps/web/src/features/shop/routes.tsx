import type { RouteObject } from 'react-router-dom';
import ShopPage from './pages/ShopPage';

/** FE2 소유 */
export const shopRoutes: RouteObject[] = [{ path: '/shop', element: <ShopPage /> }];
