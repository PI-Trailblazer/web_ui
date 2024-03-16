import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const CleanLayout = () => {
    return (
        <div>
            <Outlet />
        </div>
    )
}

export { CleanLayout }


