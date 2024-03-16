import { CleanLayout } from "./layouts/Layout";
import { lazy } from 'react';

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Test2Page = lazy(() => import("./pages/test2"));
const TestPage = lazy(() => import("./pages/test"));
    
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
                path: "/contact",
                element: <TestPage />,
                exact: true
            }
        ]
    }
];

export { routes };
