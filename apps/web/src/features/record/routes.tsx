import type { RouteObject } from 'react-router-dom';
import RecordPage from './pages/RecordPage';

/** FE2 소유 */
export const recordRoutes: RouteObject[] = [{ path: '/record', element: <RecordPage /> }];
