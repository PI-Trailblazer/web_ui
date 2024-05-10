import React from 'react';
import NavBar from '@/layouts/Layout/NavBar'
import Sidebar from '@/components/sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed'

const AccountLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useIsCollapsed()
    return (
      <div className="relative flex min-h-screen flex-col justify-between pt-16">
          <NavBar />
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main
                id='content'
                className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
            >
          {children}
        </main>
      </div>
    );
  }

export { AccountLayout };