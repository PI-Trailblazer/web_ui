import { CleanLayout } from './layouts/Layout';
import { lazy, Suspense, ReactNode } from 'react';
import { useUserStore } from './stores/useUserStore';
import { Navigate } from 'react-router-dom';


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
    const { token, roles } = useUserStore((state: { token: any; roles: any; }) => ({ token: state.token, roles: state.roles }));
    const isProvider = roles.includes('PROVIDER');
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
                path: "/your-offers",
                element: (
                    <ProviderRoute>
                        <Suspense fallback={<div>Loading...</div>}>
                            <YourOfferPage />
                        </Suspense>
                    </ProviderRoute>
                ),
                exact: true
            }
        ]
    }
];

export { routes };
