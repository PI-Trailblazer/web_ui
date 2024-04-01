import { CleanLayout } from './layouts/Layout';
import { lazy, Suspense, ReactNode } from 'react';
import { useUserStore } from './stores/useUserStore';
import { Navigate } from 'react-router-dom';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const ComponentsPage = lazy(() => import('./pages/ComponentsPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OfferListPage = lazy(() => import('./pages/OfferListPage'));

function ProtectedRoute({
    children,
    loggedIn = true,
    redirect = '/login',
}: {
    children: ReactNode;
    loggedIn?: boolean;
    redirect?: string;
}) {
    const { token } = useUserStore(state => state);
    console.log('token', token);
    if (!!token === loggedIn) return children;
    else return <Navigate to={redirect} />;
}

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
                path: '/offer-list',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <OfferListPage />
                    </Suspense>
                ),
                exact: true,
            },
        ],
    },
];

export { routes };
