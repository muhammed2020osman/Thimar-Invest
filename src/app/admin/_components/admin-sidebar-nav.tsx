"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Home, Briefcase, Users, Settings, Building2 } from 'lucide-react'
import { cn } from "@/lib/utils"

const navItems = [
  { href: '/admin', icon: Home, label: 'لوحة التحكم' },
  { href: '/admin/opportunities', icon: Briefcase, label: 'الفرص' },
  { href: '/admin/developers', icon: Building2, label: 'المطورون' },
  { href: '/admin/users', icon: Users, label: 'المستخدمون' },
  { href: '/admin/settings', icon: Settings, label: 'الإعدادات' },
];

export function AdminSidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  
  const navClass = isMobile ? "flex flex-col gap-2" : "flex-1 px-2 text-sm font-medium lg:px-4";


  return (
     <nav className={cn("grid items-start gap-2 text-base font-medium", navClass)}>
        {navItems.map(item => {
            const isActive = (item.href === '/admin' && pathname === item.href) || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
                 <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary",
                        isActive && "bg-primary/10 text-primary font-bold"
                    )}
                    >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </Link>
            )
        })}
    </nav>
  )
}
