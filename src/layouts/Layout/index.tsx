import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from '@/layouts/Layout/NavBar'

const CleanLayout = () => {
    return (
        <div className="relative flex min-h-screen flex-col justify-between pt-16">
            <NavBar />
            <Outlet />
        </div>
    )
}

export { CleanLayout }
