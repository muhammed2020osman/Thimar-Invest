
"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';
import { ThimarLogo } from './icons/thimar-logo';
import { LayoutGrid, Briefcase, Wallet, MoreHorizontal, LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { InstallPwaButton } from './install-pwa-button';

const publicPaths = ['/', '/login'];
const navItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'اكتشف' },
  { href: '/portfolio', icon: Briefcase, label: 'محفظتي' },
  { href: '/wallet', icon: Wallet, label: 'المحفظة' },
];

function PublicHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <ThimarLogo className="h-8 w-8 text-primary" />
        <span className="ml-2 font-bold text-lg font-headline">Thimar</span>
      </Link>
      <nav className="mr-auto flex items-center gap-2 sm:gap-4">
        <InstallPwaButton />
        <Link href="/login">
          <Button variant="default">تسجيل الدخول</Button>
        </Link>
      </nav>
    </header>
  );
}

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h2>
          <p className="text-muted-foreground mb-4">يجب عليك تسجيل الدخول للوصول إلى التطبيق.</p>
          <Button onClick={() => {
            try {
              window.location.href = '/login';
            } catch (error) {
              console.error('Navigation error:', error);
              // Fallback navigation
              window.location.replace('/login');
            }
          }}>
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-20">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <nav className="container mx-auto grid grid-cols-4 h-16 items-center">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.label} href={item.href} prefetch={false} className="flex flex-col items-center justify-center gap-1">
                <item.icon className={`h-6 w-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                    <MoreHorizontal className={`h-6 w-6 transition-colors ${pathname.startsWith('/more') || pathname.startsWith('/admin') || pathname.startsWith('/profile') || pathname.startsWith('/settings') ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-medium transition-colors ${pathname.startsWith('/more') || pathname.startsWith('/admin') || pathname.startsWith('/profile') || pathname.startsWith('/settings') ? 'text-primary' : 'text-muted-foreground'}`}>
                        المزيد
                    </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="top" className="mb-2 w-56">
                <Link href="/profile" prefetch={false}>
                    <DropdownMenuItem>
                        <User className="ml-2 h-4 w-4" />
                        <span>الملف الشخصي</span>
                    </DropdownMenuItem>
                </Link>
                <Link href="/settings" prefetch={false}>
                    <DropdownMenuItem>
                        <Settings className="ml-2 h-4 w-4" />
                        <span>الإعدادات</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                 <Link href="/admin" prefetch={false}>
                    <DropdownMenuItem>
                        <LayoutDashboard className="ml-2 h-4 w-4" />
                        <span>لوحة التحكم</span>
                    </DropdownMenuItem>
                </Link>
                 <Link href="/more" prefetch={false}>
                    <DropdownMenuItem>
                        <MoreHorizontal className="ml-2 h-4 w-4" />
                        <span>كل الخيارات</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center text-red-600">
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </nav>
      </footer>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = publicPaths.includes(pathname);
  
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
          .catch((error) => console.error('Service Worker registration failed:', error));
      });
    }
  }, []);
  
  if (pathname.startsWith('/admin')) {
      return <>{children}</>;
  }

  if (isPublic) {
    return (
      <>
        <PublicHeader />
        {children}
      </>
    );
  }

  return <PrivateLayout>{children}</PrivateLayout>;
}
