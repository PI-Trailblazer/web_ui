import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const CleanLayout = () => {
    return (
        <div className="relative flex min-h-screen flex-col justify-between">
            <Outlet />
        </div>
    )
}

export { CleanLayout }


