import { CleanLayout } from "./layouts/Layout";
import { lazy } from 'react';

const LandingPage = lazy(() => import("./pages/LandingPage"));
const ComponentsPage = lazy(() => import("./pages/ComponentsPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const routes = [
    {
        path: "/",
        element: <CleanLayout />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
                exact: true
            },
            {
                path: "/component",
                element: <ComponentsPage />,
                exact: true
            },
            {
                path: "/register",
                element: <RegisterPage />,
                exact: true
            },
            {
                path: "/login",
                element: <LoginPage />,
                exact: true
            }
        ]
    }
];

export { routes };
