
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ThimarLogo } from '@/components/icons/thimar-logo';
import { Loader2 } from 'lucide-react';
import type { PhoneFormValues } from '@/types/forms';
import { phoneSchema } from '@/types/forms';
import authService from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

// =====================================================================
// Login Form Component
// =====================================================================
function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const handleSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true);
    try {
      // Admin backdoor login
      if (values.phone === '500000000') {
        router.push('/admin');
        return;
      }
      
      // Use authService for login
      const response = await authService.login({
        phone: values.phone,
        password: 'default_password' // You might need to adjust this based on your backend
      });

      if (response.user) {
        console.log("Logging in user:", response.user.name);
        login(response.user);
        toast({
            title: `أهلاً بعودتك، ${response.user.name}!`,
            description: "تم تسجيل دخولك بنجاح.",
        });
        router.push('/dashboard');
      }

    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "خطأ في المصادقة",
        description: error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <CardHeader className="text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ThimarLogo className="w-16 h-16 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول أو إنشاء حساب</CardTitle>
          <CardDescription className="pt-2 text-base">أدخل رقم جوالك للمتابعة.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">رقم الجوال (SA)</FormLabel>
                <FormControl>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" dir="ltr">+966</span>
                    <Input
                      type="tel"
                      placeholder="5xxxxxxxx"
                      className="text-left pl-16 text-lg"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="px-6 pb-6">
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'تسجيل الدخول'}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

// =====================================================================
// Main Login Page Component
// =====================================================================
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl">
        <LoginForm />
      </Card>
    </div>
  );
}
