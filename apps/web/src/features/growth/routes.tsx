import type { RouteObject } from 'react-router-dom';
import GrowthPage from './pages/GrowthPage';

/** FE2 소유 */
export const growthRoutes: RouteObject[] = [{ path: '/growth', element: <GrowthPage /> }];
