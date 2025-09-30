
"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { userService } from "@/services/user.service"
import authService from "@/services/auth.service"
import type { User } from "@/types"
import type { UserFormValues } from "@/types/forms"
import { userSchema } from "@/types/forms"
import { useToast } from "@/hooks/use-toast"

const emptyUser: UserFormValues = {
  name: "",
  email: "",
  type: "مستثمر",
  status: "نشط",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Ref to prevent double submissions
  const submissionInProgress = useRef(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: emptyUser,
  });

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في جلب المستخدمين.", variant: "destructive" });
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  const handleAddClick = () => {
    setDialogMode('add');
    form.reset(emptyUser);
    setDialogOpen(true);
  };

  const handleEditClick = (user: User) => {
    setDialogMode('edit');
    setCurrentUserId(user.id);
    form.reset({ 
      name: user.name, 
      email: user.email, 
      type: user.type as UserFormValues["type"],
      status: user.status as UserFormValues["status"]
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await userService.deleteUser(userToDelete.id);
        await fetchUsers();
        toast({ title: "نجاح", description: "تم حذف المستخدم بنجاح." });
      } catch (error) {
        toast({ title: "خطأ", description: (error as Error).message || "فشل حذف المستخدم.", variant: "destructive" });
      } finally {
        setDeleteAlertOpen(false);
        setUserToDelete(null);
      }
    }
  }

  const handleSave = async (values: UserFormValues) => {
    if (isLoading || submissionInProgress.current) return;

    submissionInProgress.current = true;
    setIsLoading(true);
    try {
      if (dialogMode === 'add') {
        await userService.createUser(values);
        toast({ title: "نجاح", description: "تمت إضافة المستخدم بنجاح." });
      } else if (currentUserId) {
        await userService.updateUser(currentUserId, values);
        toast({ title: "نجاح", description: "تم تحديث المستخدم بنجاح." });
      }
      await fetchUsers();
      setDialogOpen(false);
    } catch (error) {
      toast({ title: "خطأ", description: (error as Error).message || "فشلت العملية.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      submissionInProgress.current = false;
    }
  };


  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="active">نشط</TabsTrigger>
          <TabsTrigger value="blocked">محظور</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            مؤرشف
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  تصفية
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>تصفية حسب</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                نشط
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>محظور</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              تصدير
            </span>
          </Button>
          <Button size="sm" className="h-7 gap-1" onClick={handleAddClick}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              إضافة مستخدم
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>المستخدمون</CardTitle>
            <CardDescription>
                إدارة المستخدمين في المنصة.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[65vh] w-full overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/30">
                  <TableRow>
                     <TableHead className="w-[100px] text-right">
                      <span className="sr-only">إجراءات</span>
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-center">
                      تاريخ الانضمام
                    </TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Avatar</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                  <TableRow key={user.id} className="odd:bg-muted/50">
                     <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditClick(user)}>تعديل</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(user)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                     <TableCell className="hidden md:table-cell text-center" dir="ltr">
                      {new Date(user.joinDate).toLocaleDateString('ar-SA')}
                    </TableCell>
                     <TableCell className="text-center">
                      <Badge variant={user.status === 'نشط' ? 'secondary' : 'destructive'}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="font-medium">{user.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {user.email}
                      </div>
                    </TableCell>
                     <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Avatar"
                        className="aspect-square rounded-full object-cover"
                        height="40"
                        src={user.avatar || 'https://picsum.photos/seed/placeholder/40/40'}
                        width="40"
                      />
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              عرض <strong>{users.length}</strong> من <strong>{users.length}</strong> مستخدمين
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)}>
              <DialogHeader className="text-right mb-6">
                <DialogTitle className="text-2xl font-bold">{dialogMode === 'add' ? 'إضافة مستخدم جديد' : 'تعديل المستخدم'}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground mt-2">
                  {dialogMode === 'add' ? 'أدخل تفاصيل المستخدم الجديد هنا.' : 'قم بتحديث تفاصيل المستخدم.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">اسم المستخدم</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: عبدالله العامري" {...field} />
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
                      <FormLabel className="text-sm">البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">نوع المستخدم</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="اختر نوع المستخدم" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="مستثمر">مستثمر</SelectItem>
                            <SelectItem value="مطور">مطور</SelectItem>
                            <SelectItem value="مدير">مدير</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">حالة المستخدم</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="اختر حالة المستخدم" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="نشط">نشط</SelectItem>
                            <SelectItem value="محظور">محظور</SelectItem>
                            <SelectItem value="مؤرشف">مؤرشف</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المستخدم بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}
