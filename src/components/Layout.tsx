import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen relative p-4 lg:p-6 overflow-hidden flex gap-6 z-10 w-full max-w-full">
      <div className="particles-bg"></div>
      
      {/* LEFT COLUMN: Sidebar */}
      <aside className="hidden lg:flex flex-col w-[20%] min-w-[260px] max-w-[300px]">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <Outlet />
    </div>
  );
};

export default Layout;
