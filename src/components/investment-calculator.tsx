
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function InvestmentCalculator({ expectedReturn }: { expectedReturn: number }) {
  const [amount, setAmount] = useState(10000);

  const calculateReturn = (investmentAmount: number) => {
    return (investmentAmount * expectedReturn) / 100;
  };

  const totalReturn = amount + calculateReturn(amount);

  return (
    <Card className="bg-primary/5 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl">حاسبة الاستثمار</CardTitle>
        <CardDescription>أدخل المبلغ الذي تريد استثماره لترى عائدك المتوقع.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="investment-amount">مبلغ الاستثمار (ريال)</Label>
            <Input
              id="investment-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="text-lg mt-1"
              min="1000"
              step="1000"
            />
          </div>
          <div className="flex justify-between items-center p-4 bg-background rounded-lg">
            <span className="text-muted-foreground">العائد المتوقع</span>
            <span className="font-bold text-green-600 text-lg" dir="ltr">
              {calculateReturn(amount).toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-background rounded-lg border-t">
            <span className="font-bold">إجمالي المبلغ بعد المدة</span>
            <span className="font-bold text-primary text-xl" dir="ltr">
              {totalReturn.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
