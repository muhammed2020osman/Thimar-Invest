import { Card, CardContent } from "@/components/ui/card";
import { User, Settings, Shield, HelpCircle, ChevronLeft, LayoutDashboard, Download } from "lucide-react";
import Link from 'next/link';
import { InstallPwaButton } from '@/components/install-pwa-button';

export default function MorePage() {
  const menuItems = [
    { href: '/profile', icon: <User className="h-5 w-5" />, text: 'الملف الشخصي' },
    { href: '/settings', icon: <Settings className="h-5 w-5" />, text: 'الإعدادات' },
    { href: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, text: 'لوحة التحكم' },
    { href: '#', icon: <Shield className="h-5 w-5" />, text: 'الأمان' },
    { href: '#', icon: <HelpCircle className="h-5 w-5" />, text: 'مركز المساعدة' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2">المزيد</h1>
        <p className="text-muted-foreground">إدارة حسابك والوصول إلى المساعدة.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            <li className="p-3 sm:p-4 flex items-center justify-between hover:bg-muted cursor-pointer transition-colors">
              <div className="flex items-center gap-3 sm:gap-4">
                 <div className="text-primary"><Download className="h-4 w-4 sm:h-5 sm:w-5"/></div>
                 <span className="font-medium text-sm sm:text-base">تثبيت التطبيق</span>
              </div>
              <InstallPwaButton />
            </li>
            {menuItems.map(item => (
              <li key={item.text}>
                <Link href={item.href} prefetch={false}>
                  <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted cursor-pointer transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-primary">{item.icon}</div>
                      <span className="font-medium text-sm sm:text-base">{item.text}</span>
                    </div>
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
