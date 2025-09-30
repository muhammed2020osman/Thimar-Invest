'use client';

import Link from 'next/link';
import { Bell, PanelRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThimarLogo } from '@/components/icons/thimar-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminSidebarNav } from './_components/admin-sidebar-nav';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  
  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'A';
  };
  
  return (
    <div dir="rtl" className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-l bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-4">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ThimarLogo className="h-8 w-8 text-primary" />
              <span className="text-xl font-headline">ثمار | الإدارة</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="mr-auto h-8 w-8 relative">
                  <Bell className="h-4 w-4" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">3</Badge>
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>يوجد طلب استثمار جديد</DropdownMenuItem>
                <DropdownMenuItem>تم اكتمال تمويل مشروع</DropdownMenuItem>
                <DropdownMenuItem>مستخدم جديد سجل</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1">
            <AdminSidebarNav />
          </div>
          <div className="mt-auto p-4 border-t">
            <Link href="/login">
                <Button variant="ghost" className="w-full justify-start">تسجيل الخروج</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelRight className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <ThimarLogo className="h-8 w-8" />
                    <span className="sr-only">Thimar Admin</span>
                  </Link>
                  <AdminSidebarNav isMobile={true} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add a search bar here */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                 <Avatar>
                    <AvatarImage src={user?.avatar || "https://picsum.photos/seed/111/200/200"} alt={user?.name || "Admin"} data-ai-hint="man portrait"/>
                    <AvatarFallback>{getUserInitials(user?.name || "Admin")}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "مدير النظام"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || user?.phone || "admin@thimar.sa"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem>
                    <User className="ml-2 h-4 w-4"/>
                    الملف الشخصي
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/settings">
                <DropdownMenuItem>الإعدادات</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>الدعم</DropdownMenuItem>
              <DropdownMenuSeparator />
               <Link href="/login">
                <DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
