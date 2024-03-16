import './index.css'
import { NextUIProvider } from '@nextui-org/react'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

const App = () => {
  const router = createBrowserRouter(routes);

  return (
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  )
}

export default App