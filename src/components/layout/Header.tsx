'use client';

import React from 'react';
import Link from 'next/link';
import { Beaker, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden">
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <Beaker className="w-6 h-6" />
            <span>Lucerna</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-4">
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            このサイトについて
          </Link>
          <Link href="/guide" className="text-sm font-medium hover:text-primary">
            使い方ガイド
          </Link>
          <Link href="/for-teachers" className="text-sm font-medium hover:text-primary">
            教師用ツール
          </Link>
        </nav>
      </div>
    </header>
  );
}