import React from 'react';
import NavBar from '@/layouts/Layout/NavBar'

const AccountLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
      <div className="relative flex min-h-screen flex-col justify-between pt-16">
          <NavBar />
          {children}
      </div>
    );
  }

export { AccountLayout };