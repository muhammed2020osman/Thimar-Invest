
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  DollarSign,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { adminService } from "@/services/admin.service"

export default async function AdminDashboardPage() {
  const [dashboardStats, growthStats] = await Promise.all([
    adminService.getDashboardStats(),
    adminService.getGrowthStats()
  ]);

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('SAR', 'ريال');
  };

  // Helper function to format date
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Calculate growth percentages
  const investmentGrowthPercentage = dashboardStats.totalInvestmentAmount > 0 
    ? ((growthStats.monthlyInvestmentGrowth / dashboardStats.totalInvestmentAmount) * 100).toFixed(1)
    : '0';
  
  const userGrowthPercentage = dashboardStats.activeUsers > 0
    ? ((growthStats.monthlyUserGrowth / dashboardStats.activeUsers) * 100).toFixed(1) 
    : '0';

  return (
    <>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              إجمالي الاستثمارات
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-right" dir="ltr">
              {formatCurrency(dashboardStats.totalInvestmentAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{investmentGrowthPercentage}% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              المستخدمون النشطون
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">+{dashboardStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{userGrowthPercentage}% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">الفرص المتاحة</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">+{dashboardStats.availableOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              +{growthStats.weeklyOpportunityGrowth} منذ الأسبوع الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              النشاط الحالي
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">+{dashboardStats.currentActivity}</div>
            <p className="text-xs text-muted-foreground">
              +{growthStats.hourlyActivityGrowth} منذ الساعة الماضية
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-6 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center pb-3">
            <div className="grid gap-2">
              <CardTitle className="text-lg lg:text-xl">آخر الاستثمارات</CardTitle>
              <CardDescription className="text-sm">
                آخر الاستثمارات التي تمت في المنصة.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="mr-auto gap-1 text-xs sm:text-sm">
              <Link href="/admin/opportunities">
                عرض الكل
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[250px] sm:h-[300px] w-full overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">المستثمر</TableHead>
                    <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                      الفرصة
                    </TableHead>
                    <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                      الحالة
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-center text-xs sm:text-sm">
                      التاريخ
                    </TableHead>
                    <TableHead className="text-left text-xs sm:text-sm">المبلغ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardStats.recentInvestments.length > 0 ? (
                    dashboardStats.recentInvestments.map((investment) => (
                      <TableRow key={investment.id} className="odd:bg-muted/50">
                        <TableCell className="text-xs sm:text-sm">
                          <div className="font-medium">{investment.User?.name || 'مستخدم محذوف'}</div>
                          <div className="hidden text-xs text-muted-foreground md:inline">
                            {investment.User?.email || investment.User?.phone || 'غير متوفر'}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {investment.InvestmentOpportunity.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge 
                            className="text-xs" 
                            variant={investment.status === 'مكتمل' ? 'outline' : 'secondary'}
                          >
                            {investment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center text-xs sm:text-sm">
                          {new Date().toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </TableCell>
                        <TableCell className="text-left text-xs sm:text-sm" dir="ltr">
                          {formatCurrency(investment.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-xs sm:text-sm text-muted-foreground py-8">
                        لا توجد استثمارات حديثة
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg lg:text-xl">آخر المستخدمين المسجلين</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:gap-6 lg:gap-8">
            {dashboardStats.recentUsers.length > 0 ? (
              dashboardStats.recentUsers.map((user) => {
                const totalInvestment = user.UserInvestment?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
                return (
                  <div key={user.id} className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="hidden h-8 w-8 sm:h-9 sm:w-9 sm:flex">
                      <AvatarImage src={user.avatar || `https://picsum.photos/seed/${user.id}/50/50`} alt="Avatar" />
                      <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-xs sm:text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {user.email || user.phone}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-xs sm:text-sm" dir="ltr">
                      {formatCurrency(totalInvestment)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-xs sm:text-sm text-muted-foreground py-8">
                لا توجد مستخدمين جدد
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
