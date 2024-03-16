import { CleanLayout } from "./layouts/Layout";
import { lazy } from 'react';

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Test2Page = lazy(() => import("./pages/test2"));
const ComponentsPage = lazy(() => import("./pages/ComponentsPage"));
    
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
                path: "/about",
                element: <Test2Page />,

                exact: true
            },
            {
                path: "/component",
                element: <ComponentsPage />,
                exact: true
            }
        ]
    }
];

export { routes };
