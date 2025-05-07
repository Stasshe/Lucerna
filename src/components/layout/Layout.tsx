'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* デスクトップサイドバー (常に表示) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* モバイルサイドバー (トグルで表示/非表示) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={toggleSidebar} />
          <div className="absolute left-0 top-0 h-full w-64 bg-background">
            <Sidebar />
          </div>
        </div>
      )}

      {/* メインコンテンツエリア */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isMobileSidebarOpen} />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}