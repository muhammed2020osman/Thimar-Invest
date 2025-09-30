'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { InvestmentOpportunity } from '@/types';
import { opportunityService } from '@/services/opportunity.service';
import { useToast } from '@/hooks/use-toast';

const statusVariant: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
  "active": "default",
  "completed": "secondary",
  "inactive": "outline",
  "cancelled": "destructive"
};

const getStatusLabel = (status: string): string => {
  const statusLabels: { [key: string]: string } = {
    "active": "متاحة",
    "completed": "مكتملة",
    "inactive": "غير نشطة",
    "cancelled": "ملغية"
  };
  return statusLabels[status] || status;
};

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<InvestmentOpportunity | null>(null);
  const { toast } = useToast();

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/opportunities');
      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }
      const data = await response.json();
      const opportunitiesData = data?.payload || data?.data || data || [];
      setOpportunities(opportunitiesData);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({ title: "خطأ", description: "فشل في جلب الفرص.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleDelete = async (opportunity: InvestmentOpportunity) => {
    setOpportunityToDelete(opportunity);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!opportunityToDelete) return;

    try {
      await opportunityService.deleteOpportunity(opportunityToDelete.id);
      toast({ title: "نجاح", description: "تم حذف الفرصة بنجاح." });
      await fetchOpportunities();
    } catch (error: any) {
      console.error('Error deleting opportunity:', error);
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في حذف الفرصة.", 
        variant: "destructive" 
      });
    } finally {
      setDeleteDialogOpen(false);
      setOpportunityToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الفرص...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">الفرص الاستثمارية</h1>
        <div className="mr-auto flex items-center gap-2">
          <Link href="/admin/opportunities/new">
            <Button className="h-12 px-8 rounded-xl text-base gap-2">
              <PlusCircle className="h-5 w-5" />
              <span className="hidden sm:inline">إضافة فرصة</span>
            </Button>
          </Link>
        </div>
      </div>

      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>قائمة الفرص</CardTitle>
          <CardDescription>إدارة الفرص الاستثمارية المتاحة والمكتملة.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <PlusCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">لا توجد فرص استثمارية</h3>
                <p className="text-sm">ابدأ بإنشاء فرصة استثمارية جديدة</p>
              </div>
              <Link href="/admin/opportunities/new">
                <Button>إضافة أول فرصة</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الفرصة</TableHead>
                    <TableHead className="hidden sm:table-cell text-right">المدينة</TableHead>
                    <TableHead className="hidden sm:table-cell text-right">نوع الأصل</TableHead>
                    <TableHead className="hidden md:table-cell text-center">العائد المتوقع</TableHead>
                    <TableHead className="hidden md:table-cell text-center">التمويل</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="w-[100px] text-right">
                      <span className="sr-only">إجراءات</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((op) => (
                    <TableRow key={op.id} className="odd:bg-muted/50">
                      <TableCell className="font-medium">
                        <Link href={`/opportunity/${op.id}`} className="hover:underline">
                          {op.name}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{op.city?.name || 'غير محدد'}</TableCell>
                      <TableCell className="hidden sm:table-cell">{op.asset_type?.name || 'غير محدد'}</TableCell>
                      <TableCell className="hidden md:table-cell text-center" dir="ltr">{op.expected_return}%</TableCell>
                      <TableCell className="hidden md:table-cell text-center" dir="ltr">{op.funded}%</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={statusVariant[op.status]}>{getStatusLabel(op.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">فتح القائمة</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/opportunities/${op.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                تعديل
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(op)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الفرصة "{opportunityToDelete?.name}"؟ 
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}