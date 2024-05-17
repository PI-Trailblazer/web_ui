import { CleanLayout } from './layouts/Layout';
import { lazy, Suspense, ReactNode } from 'react';
import { useUserStore } from './stores/useUserStore';
import { Navigate } from 'react-router-dom';
import { AccountLayout } from './layouts/AccountLayout';


function ProtectedRoute({
    children,
    loggedIn = true,
    redirect = '/login',
}: {
    children: ReactNode;
    loggedIn?: boolean;
    redirect?: string;
}) {
    const { token } = useUserStore((state: any) => state);
    console.log('token', token);
    if (!!token === loggedIn) return children;
    else return <Navigate to={redirect} />;
}

function ProviderRoute({ children }: { children: ReactNode }) {
    const { token, scopes } = useUserStore((state: any) => ({ token: state.token, scopes: state.scopes }));
    const isProvider = scopes.includes('provider');
    if (token && isProvider) return children;
    else if (token && !isProvider) return <div>You do not have permission to view this page.</div>;
    else return <Navigate to='/login' />;
}


const LandingPage = lazy(() => import("./pages/LandingPage"));
const ComponentsPage = lazy(() => import("./pages/ComponentsPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OfferListPage = lazy(() => import("./pages/OfferListPage"));
const OfferDetailsPage = lazy(() => import("./pages/OfferDetailsPage"));
const YourOfferPage = lazy(() => import("./pages/YourOffersPage"));
const AccountSettingsPage = lazy(() => import("./pages/AccountSettingsPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotFoundError = lazy(() => import("./pages/ErrorPages/NotFoundError"));
const GeneralError = lazy(() => import("./pages/ErrorPages/GeneralError"));
const MaintenanceError = lazy(() => import("./pages/ErrorPages/MaintenanceError"));

const routes = [
    {
        path: '/',
        element: <CleanLayout />,
        children: [
            {
                path: '/',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <LandingPage />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: '/component',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ComponentsPage />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: '/register',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <RegisterPage />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: '/login',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <LoginPage />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: "/offer-list",
                element:(
                    <Suspense fallback={<div>Loading...</div>}>
                        <OfferListPage />
                    </Suspense>
                ),
                exact: true
            },
            {
                path: "/offer/:id",
                element:
                <Suspense fallback={<div>Loading...</div>}>
                    <OfferDetailsPage />
                </Suspense>,
                exact: true
            },
            {
                path: '/error',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <GeneralError />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: '/maintenance',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <MaintenanceError />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: '/404',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <NotFoundError />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: '*',
                element: <Navigate to='/404' />,
            }
        ]
    },
    {
        path: '/account',
        element: <AccountLayout />,
        children: [
            {
                path: '',
                element: (
                    <ProviderRoute>
                        <Suspense fallback={<div>Loading...</div>}>
                            <AccountSettingsPage />
                        </Suspense>
                    </ProviderRoute>
                ),
                exact: true,
            },
            {
                path: 'your-offers',
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<div>Loading...</div>}>
                            <YourOfferPage />
                        </Suspense>
                    </ProtectedRoute>
                ),
                exact: true,
            },
            {
                path: 'dashboard',
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<div>Loading...</div>}>
                            <DashboardPage />
                        </Suspense>
                    </ProtectedRoute>
                ),
                exact: true,
            },
        ],
    }
];

export { routes };
