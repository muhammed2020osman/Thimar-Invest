
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, Plus, Minus, Loader2, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AmountFormValues } from "@/types/forms";
import { amountSchema } from "@/types/forms";
import type { Transaction } from "@/types";
import { investmentService, transactionService } from "@/services/investment.service";
import authService from "@/services/auth.service";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";


const transactionDetails = {
  'إيداع': { icon: <ArrowDownLeft className="h-4 w-4 text-green-500" />, color: 'text-green-500' },
  'سحب': { icon: <ArrowUpRight className="h-4 w-4 text-red-500" />, color: 'text-red-500' },
  'استثمار': { icon: <ArrowUpRight className="h-4 w-4 text-red-500" />, color: 'text-red-500' },
  'أرباح': { icon: <ArrowDownLeft className="h-4 w-4 text-green-500" />, color: 'text-green-500' },
  // English equivalents
  'deposit': { icon: <ArrowDownLeft className="h-4 w-4 text-green-500" />, color: 'text-green-500' },
  'withdrawal': { icon: <ArrowUpRight className="h-4 w-4 text-red-500" />, color: 'text-red-500' },
  'investment': { icon: <ArrowUpRight className="h-4 w-4 text-red-500" />, color: 'text-red-500' },
  'refund': { icon: <ArrowDownLeft className="h-4 w-4 text-green-500" />, color: 'text-green-500' },
};

const statusVariant: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
  "مكتمل": "secondary",
  "قيد المعالجة": "default",
  // English equivalents
  "completed": "secondary",
  "pending": "default",
  "failed": "destructive",
  "cancelled": "outline",
};

export default function WalletPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDepositOpen, setDepositOpen] = useState(false);
  const [isWithdrawOpen, setWithdrawOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start with false to show content immediately

  // دالة لإعادة جلب البيانات من الخادم
  const refreshData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Refreshing wallet data from database for user:', user.id);
      
      const data = await transactionService.getTransactions({ user_id: user.id });
      console.log('Transactions refreshed from database:', data.length, 'for user:', user.id);
      
      // Ensure data is an array
      const transactionsArray = Array.isArray(data) ? data : [];
      setTransactions(transactionsArray);
      
      // Calculate balance from database transactions only
      const calculatedBalance = transactionsArray.reduce((total, txn) => {
        // Handle both Arabic and English type values
        if (txn.type === 'إيداع' || txn.type === 'أرباح' || txn.type === 'deposit' || txn.type === 'refund') {
          return total + (txn.amount || 0);
        } else if (txn.type === 'سحب' || txn.type === 'استثمار' || txn.type === 'withdrawal' || txn.type === 'investment') {
          return total - (txn.amount || 0);
        }
        return total;
      }, 0);
      setBalance(calculatedBalance);
      console.log('Balance refreshed from database:', calculatedBalance);
      
      // تأكد من أن الرصيد رقم صحيح
      if (isNaN(calculatedBalance) || calculatedBalance === null || calculatedBalance === undefined) {
        console.warn('Invalid balance calculated:', calculatedBalance);
        setBalance(0);
      }
    } catch (error) {
      console.error('Error refreshing wallet data from database:', error);
      toast({
        title: "خطأ في تحديث البيانات",
        description: "فشل في تحديث بيانات المحفظة. يرجى إعادة تحميل الصفحة.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          console.log('Fetching wallet data from database for user:', user.id, 'Name:', user.name);
          
          const data = await transactionService.getTransactions({ user_id: user.id });
          console.log('Transactions loaded from database:', data.length, 'for user:', user.id);
          console.log('Sample transaction data:', data[0]); // Log first transaction to see structure
          
          // Ensure data is an array
          const transactionsArray = Array.isArray(data) ? data : [];
          setTransactions(transactionsArray);
          
          // Calculate balance from database transactions only
          const calculatedBalance = transactionsArray.reduce((total, txn) => {
            // Handle both Arabic and English type values
            if (txn.type === 'إيداع' || txn.type === 'أرباح' || txn.type === 'deposit' || txn.type === 'refund') {
              return total + (txn.amount || 0);
            } else if (txn.type === 'سحب' || txn.type === 'استثمار' || txn.type === 'withdrawal' || txn.type === 'investment') {
              return total - (txn.amount || 0);
            }
            return total;
          }, 0);
          setBalance(calculatedBalance);
          console.log('Balance calculated from database:', calculatedBalance);
          
          // تأكد من أن الرصيد رقم صحيح
          if (isNaN(calculatedBalance) || calculatedBalance === null || calculatedBalance === undefined) {
            console.warn('Invalid balance calculated:', calculatedBalance);
            setBalance(0);
          }
        } catch (error) {
          console.error('Error fetching wallet data from database:', error);
          toast({
            title: "خطأ في تحميل البيانات",
            description: "فشل في تحميل بيانات المحفظة من قاعدة البيانات.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      // Fetch data immediately from database
      fetchData();
    }
  }, [isAuthenticated, user, toast]);

  const depositForm = useForm<AmountFormValues>({
    resolver: zodResolver(amountSchema()),
    defaultValues: { amount: 100 },
  });

  const withdrawForm = useForm<AmountFormValues>({
    resolver: zodResolver(amountSchema(balance)),
    defaultValues: { amount: 100 },
  });

  const handleDeposit = async (values: AmountFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await transactionService.createTransaction({
        type: 'إيداع',
        amount: values.amount,
        status: 'مكتمل'
      });
      
      // إعادة جلب البيانات من الخادم للتأكد من التحديث
      await refreshData();
      
      setDepositOpen(false);
      depositForm.reset({ amount: 100 });
      
      toast({
        title: "تم الإيداع بنجاح",
        description: `تم إيداع ${values.amount.toLocaleString('ar-SA')} ريال في محفظتك.`,
      });
    } catch (error) {
      console.error('Error creating deposit:', error);
      toast({
        title: "خطأ في الإيداع",
        description: "فشل في إيداع المبلغ. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (values: AmountFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await transactionService.createTransaction({
        type: 'سحب',
        amount: values.amount,
        status: 'قيد المعالجة'
      });
      
      // إعادة جلب البيانات من الخادم للتأكد من التحديث
      await refreshData();
      
      setWithdrawOpen(false);
      withdrawForm.reset({ amount: 100 });
      
      toast({
        title: "تم طلب السحب",
        description: `تم طلب سحب ${values.amount.toLocaleString('ar-SA')} ريال. سيتم معالجة طلبك قريباً.`,
      });
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      toast({
        title: "خطأ في السحب",
        description: "فشل في طلب السحب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state only while checking authentication, not while loading data
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-headline mb-2">المحفظة المالية</h1>
          <p className="text-muted-foreground">إدارة أموالك، الإيداع، والسحب.</p>
        </div>
        
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Balance Card Skeleton */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardHeader>
            </Card>
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
        
        {/* Transactions Skeleton */}
        <div className="mt-8">
          <Card className="shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-4 sm:p-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            <p className="text-muted-foreground mb-4">يجب عليك تسجيل الدخول للوصول إلى محفظتك.</p>
            <Button onClick={() => window.location.href = '/login'}>
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-headline mb-2">المحفظة المالية</h1>
          <p className="text-muted-foreground">إدارة أموالك، الإيداع، والسحب.</p>
          {user && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span>مرحباً، {user.name || `المستخدم ${user.id}`}</span>
            </div>
          )}
          {isLoading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>جاري تحديث البيانات...</span>
            </div>
          )}
        </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4 lg:space-y-6">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg lg:text-xl">الرصيد المتاح</CardTitle>
              <CardDescription className="text-sm">هذا هو المبلغ المتاح للاستثمار أو السحب.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-lg text-muted-foreground">جاري التحميل...</p>
                </div>
              ) : (
                <p className="text-2xl lg:text-4xl font-bold font-mono">
                  {(balance || 0).toLocaleString('ar-SA')} ريال
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg lg:text-xl">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto" 
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`ml-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/> 
                تحديث البيانات
              </Button>
              
              <Dialog open={isDepositOpen} onOpenChange={setDepositOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full sm:w-auto"><Plus className="ml-2 h-4 w-4"/> إيداع أموال</Button>
                </DialogTrigger>
                <DialogContent>
                  <Form {...depositForm}>
                    <form onSubmit={depositForm.handleSubmit(handleDeposit)}>
                      <DialogHeader className="text-right">
                        <DialogTitle>إيداع أموال</DialogTitle>
                        <DialogDescription>أدخل المبلغ الذي تود إيداعه في محفظتك.</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <FormField
                          control={depositForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>المبلغ</FormLabel>
                              <FormControl>
                                <Input type="number" step="1" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline" size="lg">إلغاء</Button></DialogClose>
                        <Button type="submit" size="lg">تأكيد الإيداع</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog open={isWithdrawOpen} onOpenChange={setWithdrawOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto"><Minus className="ml-2 h-4 w-4"/> سحب أموال</Button>
                </DialogTrigger>
                <DialogContent>
                  <Form {...withdrawForm}>
                    <form onSubmit={withdrawForm.handleSubmit(handleWithdraw)}>
                      <DialogHeader className="text-right">
                        <DialogTitle>سحب أموال</DialogTitle>
                        <DialogDescription>أدخل المبلغ الذي تود سحبه من محفظتك.</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                         <FormField
                          control={withdrawForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>المبلغ</FormLabel>
                              <FormControl>
                                <Input type="number" step="1" min="1" max={balance} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline" size="lg">إلغاء</Button></DialogClose>
                        <Button type="submit" size="lg">تأكيد السحب</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg lg:text-xl">سجل المعاملات</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] sm:h-[400px] w-full overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/30">
                    <TableRow>
                      <TableHead className="text-right text-xs sm:text-sm">العملية</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm">المبلغ</TableHead>
                      <TableHead className="text-center hidden sm:table-cell text-xs sm:text-sm">التاريخ</TableHead>
                      <TableHead className="text-left text-xs sm:text-sm">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(Array.isArray(transactions) ? transactions : []).map((txn) => (
                      <TableRow key={txn.id} className="odd:bg-muted/50 hover:bg-muted/50">
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="flex items-center gap-1 sm:gap-2">
                            {transactionDetails[txn.type as keyof typeof transactionDetails]?.icon}
                            <span className="truncate">{txn.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className={`${transactionDetails[txn.type as keyof typeof transactionDetails]?.color} text-center font-mono text-xs sm:text-sm`}>
                          <span className="truncate">{`${txn.type === 'إيداع' || txn.type === 'أرباح' || txn.type === 'deposit' || txn.type === 'refund' ? '+' : '-'}${(txn.amount || 0).toLocaleString('ar-SA')} ريال`}</span>
                        </TableCell>
                        <TableCell className="text-center font-mono hidden sm:table-cell text-xs sm:text-sm">{new Date(txn.date).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell className="text-left">
                          <Badge variant={statusVariant[txn.status]} className="text-xs">{txn.status}</Badge>
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
    </div>
  );
}
