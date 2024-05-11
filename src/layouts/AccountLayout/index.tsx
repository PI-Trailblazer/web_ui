import React from 'react';
import NavBar from '@/layouts/Layout/NavBar'
import Sidebar from '@/components/sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { Outlet } from 'react-router-dom'


const AccountLayout = () => {
    const [isCollapsed, setIsCollapsed] = useIsCollapsed()
    return (
      <div className="relative flex min-h-screen flex-col justify-between pt-16">
          <NavBar />
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main
                id='content'
                className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
            >
            <Outlet />
        </main>
      </div>
    );
  }

export { AccountLayout };