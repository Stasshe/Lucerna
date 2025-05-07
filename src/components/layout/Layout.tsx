'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  };

  return (
    <div className="flex h-screen">
      {/* デスクトップサイドバー (常に表示だが、折りたたみ可能) */}
      <div className={`hidden md:flex transition-all duration-300 ${isDesktopSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {isDesktopSidebarCollapsed ? (
          <div className="flex flex-col items-center w-full h-full bg-card border-r pt-16">
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-4 left-4"
              onClick={toggleDesktopSidebar}
              title="サイドバーを展開"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            {/* アイコンのみのナビ表示 */}
            <div className="flex flex-col items-center space-y-6 py-4">
              <Button variant="ghost" size="icon" className="rounded-full" title="力学">
                <span className="font-bold">力</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" title="熱力学">
                <span className="font-bold">熱</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" title="波動">
                <span className="font-bold">波</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" title="電磁場・原子">
                <span className="font-bold">電</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative w-full">
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={toggleDesktopSidebar}
              title="サイドバーを折りたたむ"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Sidebar />
          </div>
        )}
      </div>

      {/* モバイルサイドバー (トグルで表示/非表示) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={toggleMobileSidebar} />
          <div className="absolute left-0 top-0 h-full w-64 bg-background">
            <Sidebar />
          </div>
        </div>
      )}

      {/* メインコンテンツエリア */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header toggleSidebar={toggleMobileSidebar} isSidebarOpen={isMobileSidebarOpen} />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}