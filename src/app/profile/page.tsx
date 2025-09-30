
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Calendar, LogOut, Edit, Save, X, Loader2, Phone } from "lucide-react";
import Link from "next/link";
import authService from "@/services/auth.service";
import type { User as UserType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { user: authUser, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && authUser) {
      setUser(authUser);
      setName(authUser.name);
      setIsLoading(false);
    } else if (!authLoading && !isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, authUser, authLoading]);

  // Show loading state while checking authentication
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل الملف الشخصي...</p>
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
            <p className="text-muted-foreground mb-4">يجب عليك تسجيل الدخول للوصول إلى ملفك الشخصي.</p>
            <Button onClick={() => {
              try {
                window.location.href = '/login';
              } catch (error) {
                console.error('Navigation error:', error);
                window.location.replace('/login');
              }
            }}>
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </div>
    );
  }


  const handleSaveName = async () => {
    if (!user || !name.trim() || name.trim() === (user.name || "")) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = await authService.updateProfile({ name: name.trim() });
      if (updatedUser) {
        setUser(updatedUser);
        // Update the auth context with the new user data
        updateUser(updatedUser);
        toast({ title: "نجاح", description: "تم تحديث اسمك بنجاح." });
        setIsEditingName(false);
      }
    } catch (error) {
       toast({ title: "خطأ", description: "فشل تحديث الاسم.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if(user) setName(user.name || "");
    setIsEditingName(false);
  };
  
  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader className="flex flex-col items-center text-center p-6 bg-secondary/10">
                    <Skeleton className="h-24 w-24 rounded-full mb-4" />
                    <Skeleton className="h-8 w-40" />
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center p-8">
          <CardTitle>تعذر العثور على المستخدم</CardTitle>
          <CardDescription>لم نتمكن من العثور على بيانات هذا المستخدم.</CardDescription>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2">الملف الشخصي</h1>
        <p className="text-muted-foreground">إدارة معلومات حسابك.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center text-center p-4 sm:p-6 bg-secondary/10">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mb-3 sm:mb-4">
            <AvatarImage src={user.avatar || ""} alt={user.name || "المستخدم"} data-ai-hint="man portrait"/>
            <AvatarFallback>{user.name?.charAt(0) || "م"}</AvatarFallback>
          </Avatar>
          {!isEditingName ? (
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg sm:text-2xl font-bold">{user.name || "المستخدم"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingName(true)}>
                <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">تعديل الاسم</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="text-center text-lg sm:text-2xl font-bold"
                disabled={isSaving}
              />
              <Button size="icon" onClick={handleSaveName} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin"/> : <Save className="h-4 w-4 sm:h-5 sm:w-5" />}
                <span className="sr-only">حفظ</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancelEdit} disabled={isSaving}>
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">إلغاء</span>
              </Button>
            </div>
          )}
           <Button variant="link" size="sm" className="mt-2 text-muted-foreground text-xs sm:text-sm">
            تغيير الصورة
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 sm:gap-4 p-3 bg-muted rounded-lg">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="font-medium text-sm sm:text-base" dir="ltr">{user.phone}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 p-3 bg-muted rounded-lg">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="font-medium text-sm sm:text-base">{user.email || 'لا يوجد بريد إلكتروني'}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 p-3 bg-muted rounded-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="font-medium text-sm sm:text-base">تاريخ الانضمام: {new Date(user.joinDate).toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 p-3 bg-muted rounded-lg">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="font-medium text-sm sm:text-base">{user.type}</span>
          </div>
           <div className="pt-3 sm:pt-4">
                <Button 
                  variant="outline" 
                  className="w-full text-sm sm:text-base"
                  onClick={async () => {
                    try {
                      await authService.logout();
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                  }}
                >
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
