import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "@/layouts/Layout/NavBar";

const CleanLayout = () => {
    return (
        <>
            <header>
                <NavBar />
            </header>
            <div className="relative flex min-h-screen flex-col justify-between">
                <Outlet />
            </div>
        </>
    )
}

export { CleanLayout }


