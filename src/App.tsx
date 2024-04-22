import './index.css'

import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { ThemeProvider } from "@/components/theme-provider"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { refreshToken } from "@/services/Client/client";

const App = () => {
  const router = createBrowserRouter(routes);
  const queryClient = new QueryClient()
  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
          <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App