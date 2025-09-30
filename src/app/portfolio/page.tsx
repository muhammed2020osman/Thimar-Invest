
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { investmentService } from "@/services/investment.service";
import authService from "@/services/auth.service";
import type { UserInvestment } from "@/types";
import { TrendingUp, PieChart, DollarSign, CheckCircle, Clock, Loader2, ChevronsLeft } from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
// Temporarily commented out to fix build error
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartLegend,
//   ChartLegendContent,
// } from "@/components/ui/chart";
// import { Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const chartData = [
  { sector: 'سكني', value: 40000, fill: 'var(--color-residential)' },
  { sector: 'تجاري', value: 60000, fill: 'var(--color-commercial)' },
  { sector: 'صناعي', value: 25000, fill: 'var(--color-industrial)' },
];

const chartConfig = {
  value: {
    label: 'القيمة',
  },
  residential: {
    label: 'سكني',
    color: 'hsl(var(--chart-1))',
  },
  commercial: {
    label: 'تجاري',
    color: 'hsl(var(--chart-2))',
  },
  industrial: {
    label: 'صناعي',
    color: 'hsl(var(--chart-4))',
  },
};

const statusVariant: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
  "قيد التنفيذ": "default",
  "مكتمل": "secondary",
  "موزعة الأرباح": "outline"
};

const statusIcon: { [key: string]: React.ReactNode } = {
  "قيد التنفيذ": <Clock className="h-4 w-4" />,
  "مكتمل": <CheckCircle className="h-4 w-4 text-green-500" />,
  "موزعة الأرباح": <DollarSign className="h-4 w-4 text-green-500" />
};

type InvestmentWithOpportunity = UserInvestment & { InvestmentOpportunity: { name: string } };

export default function PortfolioPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [userInvestments, setUserInvestments] = useState<InvestmentWithOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchInvestments = async () => {
        try {
          setIsLoading(true);
          const investments = await investmentService.getUserInvestments({ user_id: user.id });
          // Ensure investments is always an array
          const investmentsArray = Array.isArray(investments) ? investments : [];
          setUserInvestments(investmentsArray as InvestmentWithOpportunity[]);
        } catch (error) {
          console.error('Error fetching investments:', error);
          toast({
            title: "خطأ في تحميل البيانات",
            description: "فشل في تحميل بيانات المحفظة الاستثمارية.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchInvestments();
    }
  }, [isAuthenticated, user, toast]);

  const totalInvestments = (Array.isArray(userInvestments) ? userInvestments : []).reduce((acc, inv) => acc + (inv.amount || 0), 0);
  const totalProfits = (Array.isArray(userInvestments) ? userInvestments : []).reduce((acc, inv) => acc + (inv.profit || 0), 0);
  const avgReturn = totalInvestments > 0 ? (totalProfits / totalInvestments) * 100 : 0;

  // Show loading state while checking authentication
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل بيانات المحفظة الاستثمارية...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h2>
            <p className="text-muted-foreground mb-4">يجب عليك تسجيل الدخول للوصول إلى محفظتك الاستثمارية.</p>
            <button 
              onClick={() => {
                try {
                  window.location.href = '/login';
                } catch (error) {
                  console.error('Navigation error:', error);
                  window.location.replace('/login');
                }
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2">محفظتي الاستثمارية</h1>
        <p className="text-muted-foreground">نظرة شاملة على أداء استثماراتك.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6 lg:mb-8">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">إجمالي الاستثمارات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold font-mono">{totalInvestments.toLocaleString('ar-SA')} ريال</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">إجمالي الأرباح المستلمة</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold font-mono">{totalProfits.toLocaleString('ar-SA')} ريال</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">متوسط العائد</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold font-mono">%{avgReturn.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-1">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="font-headline text-lg lg:text-xl">استثماراتي</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="block md:hidden space-y-4">
              {(Array.isArray(userInvestments) ? userInvestments : []).map((inv) => (
                <div key={inv.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Link href={`/opportunity/${inv.opportunityId || inv.opportunity_id || 'unknown'}`} className="font-bold text-primary hover:underline truncate">
                        {inv.InvestmentOpportunity?.name  }
                    </Link>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {statusIcon[inv.status] || statusIcon['pending']}
                        <span>{inv.status  }</span>
                    </div>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">المبلغ المستثمر:</span>
                        <span className="font-mono">{(inv.amount || 0).toLocaleString('ar-SA')} ريال</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">الأرباح:</span>
                        <span className="font-mono text-green-600 font-medium">{inv.profit ? `${(inv.profit || 0).toLocaleString('ar-SA')} ريال` : '-'}</span>
                    </div>
                     <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={`/opportunity/${inv.opportunityId || inv.opportunity_id || 'unknown'}`}>
                            عرض التفاصيل <ChevronsLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
              ))}
            </div>

            <ScrollArea className="h-[250px] sm:h-[300px] w-full overflow-x-auto hidden md:block">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/20">
                  <TableRow>
                    <TableHead className="text-right text-xs sm:text-sm">المشروع</TableHead>
                    <TableHead className="text-center hidden sm:table-cell text-xs sm:text-sm">المبلغ المستثمر</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">الحالة</TableHead>
                    <TableHead className="text-center hidden sm:table-cell text-xs sm:text-sm">الأرباح</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Array.isArray(userInvestments) ? userInvestments : []).map((inv: InvestmentWithOpportunity) => (
                    <TableRow key={inv.id} className="odd:bg-muted/50 hover:bg-muted/50">
                      <TableCell className="font-medium text-xs sm:text-sm">
                        <Link href={`/opportunity/${inv.opportunityId || inv.opportunity_id || 'unknown'}`} className="hover:underline truncate block">
                          {inv.investment_opportunity?.name || 'غير محدد'}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center font-mono hidden sm:table-cell text-xs sm:text-sm">{(inv.amount || 0).toLocaleString('ar-SA')} ريال</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-start gap-1 sm:gap-2 text-xs">
                          {statusIcon[inv.status] || statusIcon['pending']}
                          <span>{inv.status || 'غير محدد'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-green-600 font-medium text-center font-mono hidden sm:table-cell text-xs sm:text-sm">
                        {inv.profit ? `${(inv.profit || 0).toLocaleString('ar-SA')} ريال` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
