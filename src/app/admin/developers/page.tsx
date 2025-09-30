"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { developerService } from "@/services/developer.service";
import { PlusCircle, MoreHorizontal, X } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Developer } from "@prisma/client";
import type { DeveloperFormValues } from "@/types/forms";
import { developerSchema } from "@/types/forms";
import { useToast } from "@/hooks/use-toast";

const emptyDeveloper: Omit<Developer, 'id' | 'logoUrl'> = {
  name: "",
  email: "",
  description: "",
  phone: "",
};

export default function AdminDevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [developerToDelete, setDeveloperToDelete] = useState<Developer | null>(null);
  const [currentDeveloperId, setCurrentDeveloperId] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Ref to prevent double submissions
  const submissionInProgress = useRef(false);

  useEffect(() => {
    // Add mock data first to test rendering
    setDevelopers([
      {
        id: 1,
        name: "شركة الرياض للاستثمار العقاري",
        description: "شركة رائدة في مجال التطوير العقاري في المملكة العربية السعودية",
        email: "info@riyadh-realestate.com",
        phone: "+966112345678",
        website: "https://riyadh-realestate.com",
        logo_url: "https://via.placeholder.com/150x150/0066CC/FFFFFF?text=الرياض",
        created_at: "2025-09-29T09:05:45.000000Z",
        updated_at: "2025-09-29T09:05:45.000000Z"
      }
    ]);
    
    // Then try to fetch real data
    fetchDevelopers();
  }, []);
  
  const fetchDevelopers = async () => {
    try {
      const response = await developerService.getDevelopers();
      console.log('Full response:', response);
      
      // Extract data from response - check both response.data and response.payload.data
      const developersData = response?.payload?.data || response?.data || [];
      console.log('Developers data:', developersData);
      
      // Force a plain object array for React state
      const cleanData = developersData.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        email: item.email || '',
        phone: item.phone || '',
        logo_url: item.logo_url || '',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      console.log('Clean data:', cleanData);
      setDevelopers([...cleanData]); // Force new array reference
    } catch (error) {
      console.error('Error fetching developers:', error);
      setDevelopers([]);
    }
  }

  const form = useForm<DeveloperFormValues>({
    resolver: zodResolver(developerSchema),
    defaultValues: emptyDeveloper,
  });

  const handleAddClick = () => {
    setDialogMode('add');
    form.reset(emptyDeveloper);
    setDialogOpen(true);
  };

  const handleEditClick = (developer: Developer) => {
    setDialogMode('edit');
    setCurrentDeveloperId(developer.id);
    form.reset({ 
      name: developer.name, 
      email: developer.email || '',
      description: developer.description || '',
      phone: developer.phone || ''
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (developer: Developer) => {
    setDeveloperToDelete(developer);
    setDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (developerToDelete) {
      try {
        await developerService.deleteDeveloper(developerToDelete.id);
        await fetchDevelopers();
        toast({ title: "نجاح", description: "تم حذف المطور بنجاح." });
      } catch (error) {
        toast({ title: "خطأ", description: "فشل حذف المطور.", variant: "destructive" });
      } finally {
        setDeleteAlertOpen(false);
        setDeveloperToDelete(null);
      }
    }
  }

  const handleSave = async (values: DeveloperFormValues) => {
    if (isLoading || submissionInProgress.current) return;

    submissionInProgress.current = true;
    setIsLoading(true);
    try {
      console.log('Form values being sent:', values);
      if (dialogMode === 'add') {
        await developerService.createDeveloper(values);
        toast({ title: "نجاح", description: "تمت إضافة المطور بنجاح." });
      } else if (currentDeveloperId) {
        await developerService.updateDeveloper(currentDeveloperId, values);
        toast({ title: "نجاح", description: "تم تحديث المطور بنجاح." });
      }
      await fetchDevelopers();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({ title: "خطأ", description: (error as Error).message || "فشلت العملية.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      submissionInProgress.current = false;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
       <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">المطورون العقاريون</h1>
        <div className="mr-auto flex items-center gap-2">
            <Button size="lg" className="gap-2" onClick={handleAddClick}>
                <PlusCircle />
                <span className="hidden sm:inline">
                    إضافة مطور
                </span>
            </Button>
        </div>
      </div>

      <Card className="shadow-lg rounded-2xl flex-grow">
        <CardHeader className="border-b">
            <CardTitle>قائمة المطورين</CardTitle>
            <CardDescription>إدارة المطورين العقاريين المسجلين في المنصة.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/30">
                <TableRow>
                  <TableHead className="w-[100px] text-right">
                      <span className="sr-only">إجراءات</span>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="hidden md:table-cell text-right">الهاتف</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">الوصف</TableHead>
                  <TableHead className="text-right">اسم المطور</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {developers.length > 0 ? (
                  developers.map((dev) => (
                    <TableRow key={dev.id} className="odd:bg-muted/50">
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(dev)}>تعديل</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(dev)} className="text-destructive focus:text-destructive focus:bg-destructive/10">حذف</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate hidden lg:table-cell">{dev.email || '-'}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate hidden md:table-cell">{dev.phone || '-'}</TableCell>
                      <TableCell className="text-muted-foreground max-w-sm truncate hidden sm:table-cell">{dev.description}</TableCell>
                      <TableCell className="font-medium">
                        {dev.name}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      لا توجد مطورين مسجلين
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)}>
              <DialogHeader className="text-right mb-6">
                <DialogTitle className="text-2xl font-bold">{dialogMode === 'add' ? 'إضافة مطور جديد' : 'تعديل المطور'}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground mt-2">
                  {dialogMode === 'add' ? 'أدخل تفاصيل المطور الجديد هنا.' : 'قم بتحديث تفاصيل المطور.'}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    الحقول المميزة بـ <span className="text-red-500">*</span> إجبارية
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        اسم المطور <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: شركة التطوير العمراني" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        البريد الإلكتروني <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">الوصف (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="صف بإيجاز خبرة الشركة ومشاريعها السابقة" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        رقم الهاتف <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+966501234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-8">
                 <DialogClose asChild>
                    <Button type="button" variant="outline" size="lg">إلغاء</Button>
                </DialogClose>
                 <Button type="submit" size="lg" disabled={isLoading}>
                   {isLoading ? "جاري الحفظ..." : "حفظ"}
                 </Button>
              </DialogFooter>
            </form>
          </Form>
           <DialogClose className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المطور بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
