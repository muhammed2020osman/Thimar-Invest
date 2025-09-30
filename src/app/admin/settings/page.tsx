
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { assetTypeService, cityService } from "@/services/settings.service";
import type { AssetType, City } from "@/types";
import { settingSchema, type SettingFormValues } from "@/types/forms";
import { useToast } from "@/hooks/use-toast";


type DialogMode = {
    type: 'city' | 'assetType';
    action: 'add' | 'edit';
    data?: AssetType | City;
};

export default function AdminSettingsPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{type: 'city' | 'assetType', value: number} | null>(null);
  const { toast } = useToast();
  
  // Ref to prevent double submissions
  const submissionInProgress = useRef(false);

  const fetchAllData = async () => {
    try {
      const [citiesResponse, assetTypesResponse] = await Promise.all([
        cityService.getCities(),
        assetTypeService.getAssetTypes(),
      ]);
      setCities(citiesResponse.data || []);
      setAssetTypes(assetTypesResponse.data || []);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في جلب البيانات.", variant: "destructive" });
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(settingSchema),
    defaultValues: { name: "" },
  });
  
  const handleOpenDialog = (mode: DialogMode) => {
    setDialogMode(mode);
    form.reset({ name: mode.data ? mode.data.name : "" });
    setDialogOpen(true);
  };
  
  const handleOpenDeleteAlert = (type: 'city' | 'assetType', id: number) => {
    setItemToDelete({ type, value: id });
    setDeleteAlertOpen(true);
  };
  
  const handleSave = async (values: SettingFormValues) => {
    if (!dialogMode || isLoading || submissionInProgress.current) return;

    submissionInProgress.current = true;
    setIsLoading(true);
    try {
      if (dialogMode.type === 'city') {
        if (dialogMode.action === 'add') {
          await cityService.createCity(values.name);
          toast({ title: "نجاح", description: "تمت إضافة المدينة." });
        } else if (dialogMode.action === 'edit' && dialogMode.data) {
          await cityService.updateCity(dialogMode.data.id, values.name);
          toast({ title: "نجاح", description: "تم تحديث المدينة." });
        }
      } else if (dialogMode.type === 'assetType') {
        if (dialogMode.action === 'add') {
          await assetTypeService.createAssetType(values.name);
           toast({ title: "نجاح", description: "تمت إضافة نوع الأصل." });
        } else if (dialogMode.action === 'edit' && dialogMode.data) {
          await assetTypeService.updateAssetType(dialogMode.data.id, values.name);
          toast({ title: "نجاح", description: "تم تحديث نوع الأصل." });
        }
      }
      await fetchAllData();
      setDialogOpen(false);
      setDialogMode(null);
    } catch (error) {
       toast({ title: "خطأ", description: (error as Error).message || "فشلت العملية.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      submissionInProgress.current = false;
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'city') {
        await cityService.deleteCity(itemToDelete.value);
        toast({ title: "نجاح", description: "تم حذف المدينة." });
      } else {
        await assetTypeService.deleteAssetType(itemToDelete.value);
        toast({ title: "نجاح", description: "تم حذف نوع الأصل." });
      }
      await fetchAllData();
    } catch (error) {
       toast({ title: "خطأ", description: (error as Error).message || "فشلت عملية الحذف.", variant: "destructive" });
    }
    
    setDeleteAlertOpen(false);
    setItemToDelete(null);
  };

  const renderList = (items: (City | AssetType)[], type: 'city' | 'assetType') => (
     <ul className="space-y-2">
        {items.map(item => (
            <li key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{item.name}</span>
                <div className="flex gap-2">
                    <Button key={`edit-${item.id}`} variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog({type, action: 'edit', data: item})}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button key={`delete-${item.id}`} variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleOpenDeleteAlert(type, item.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </li>
        ))}
    </ul>
  );


  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center">
            <div>
                <CardTitle>المدن</CardTitle>
                <CardDescription>إدارة المدن المتاحة في المنصة.</CardDescription>
            </div>
            <Button size="sm" className="mr-auto gap-1" onClick={() => handleOpenDialog({type: 'city', action: 'add'})}>
                <PlusCircle className="h-4 w-4"/>
                إضافة
            </Button>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-72 pr-4">
                {renderList(cities, 'city')}
            </ScrollArea>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center">
            <div>
                <CardTitle>أنواع العقارات</CardTitle>
                <CardDescription>إدارة أنواع العقارات المتاحة للاستثمار.</CardDescription>
            </div>
            <Button size="sm" className="mr-auto gap-1" onClick={() => handleOpenDialog({type: 'assetType', action: 'add'})}>
                <PlusCircle className="h-4 w-4"/>
                إضافة
            </Button>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-72 pr-4">
                {renderList(assetTypes, 'assetType')}
            </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
           <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)}>
              <DialogHeader className="text-right mb-6">
                <DialogTitle className="text-2xl font-bold">
                    {dialogMode?.action === 'add' ? 'إضافة' : 'تعديل'} {dialogMode?.type === 'city' ? 'مدينة' : 'نوع عقار'}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  {dialogMode?.action === 'add' ? 'أدخل اسم العنصر الجديد.' : 'قم بتحديث اسم العنصر.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl>
                        <Input placeholder={dialogMode?.type === 'city' ? 'مثال: مكة المكرمة' : 'مثال: فندقي'} {...field} />
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
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف العنصر بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
