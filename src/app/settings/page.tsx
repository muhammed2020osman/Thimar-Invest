
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newOpportunities: true,
    investmentUpdates: true,
    accountActivity: false,
  });

  const handleNotificationChange = (id: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2">الإعدادات</h1>
        <p className="text-muted-foreground">تحكم في تفضيلات حسابك ومظهر التطبيق.</p>
      </div>

      <div className="space-y-6 lg:space-y-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg lg:text-xl">مظهر التطبيق</CardTitle>
            <CardDescription className="text-sm">اختر المظهر الذي تفضله.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="light" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Sun className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-sm sm:text-base">فاتح</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Moon className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-sm sm:text-base">داكن</span>
                </Label>
              </div>
               <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6">💻</div>
                  <span className="text-sm sm:text-base">نظام</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg lg:text-xl">تفضيلات الإشعارات</CardTitle>
            <CardDescription className="text-sm">اختر الإشعارات التي تود استقبالها.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <Label htmlFor="new-opportunities" className="font-medium text-sm sm:text-base">فرص استثمارية جديدة</Label>
              <Switch
                id="new-opportunities"
                checked={notifications.newOpportunities}
                onCheckedChange={() => handleNotificationChange('newOpportunities')}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <Label htmlFor="investment-updates" className="font-medium text-sm sm:text-base">تحديثات على استثماراتك</Label>
              <Switch
                id="investment-updates"
                checked={notifications.investmentUpdates}
                onCheckedChange={() => handleNotificationChange('investmentUpdates')}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <Label htmlFor="account-activity" className="font-medium text-sm sm:text-base">نشاط الحساب</Label>
              <Switch
                id="account-activity"
                checked={notifications.accountActivity}
                onCheckedChange={() => handleNotificationChange('accountActivity')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
