
"use client";

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { opportunityService } from '@/services/opportunity.service';
import { investmentService, transactionService } from '@/services/investment.service';
import type { InvestmentOpportunity } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Confetti } from '@/components/confetti';
import { ArrowRight, Check, CreditCard, Loader2 } from 'lucide-react';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function InvestPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(1000);
  const [agreed, setAgreed] = useState(false);
  const [opportunity, setOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [investmentId, setInvestmentId] = useState<number | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();
  
  const resolvedParams = React.use(params);
  const opportunityId = parseInt(resolvedParams.id, 10);

  useEffect(() => {
    const fetchOpportunity = async () => {
      const opp = await opportunityService.getOpportunityById(opportunityId);
      if (!opp) {
        notFound();
      }
      setOpportunity(opp);
      setLoading(false);
    };
    fetchOpportunity();
  }, [opportunityId]);

  // Show loading state while checking authentication
  if (authLoading || loading) {
     return (
      <div className="container mx-auto max-w-2xl py-12">
        <Card className="shadow-xl rounded-2xl">
          <CardHeader className="p-8 space-y-4">
             <Skeleton className="h-10 w-3/4 mx-auto" />
             <Skeleton className="h-4 w-1/2 mx-auto" />
          </CardHeader>
          <CardContent className="px-6 py-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-2xl py-12">
        <Card className="shadow-xl rounded-2xl">
          <CardHeader className="p-8 space-y-4">
            <h2 className="text-2xl font-bold text-center">يجب تسجيل الدخول</h2>
            <p className="text-muted-foreground text-center">يجب عليك تسجيل الدخول للاستثمار في الفرص.</p>
          </CardHeader>
          <CardContent className="px-6 py-8">
            <Button onClick={() => router.push('/login')} className="w-full" size="lg">
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!opportunity) {
    return notFound();
  }


  const steps = [
    { id: 1, name: 'تحديد المبلغ' },
    { id: 2, name: 'توثيق وموافقة' },
    { id: 3, name: 'الدفع' },
    { id: 4, name: 'تأكيد' },
  ];

  const handleNext = async () => {
    if (step === 3) {
      // Handle payment and create investment
      if (processing) return;
      
      setProcessing(true);
      try {
        // Create the investment record
        const investment = await investmentService.createInvestment({
          opportunity_id: opportunityId,
          amount
        });
        
        // Create the transaction record
        await transactionService.createTransaction({
          type: 'استثمار',
          amount,
          status: 'مكتمل'
        });
        
        setInvestmentId(investment.id);
        setStep(4);
        
        toast({
          title: "نجاح",
          description: "تم إنشاء استثمارك بنجاح!"
        });
      } catch (error: any) {
        console.error('Investment creation error:', error);
        
        let errorMessage = "فشل في إنشاء الاستثمار. يرجى المحاولة مرة أخرى.";
        
        // Handle specific error cases
        if (error.message?.includes('استثمار مكرر')) {
          errorMessage = "لديك استثمار موجود في هذه الفرصة بالفعل.";
        } else if (error.message?.includes('P2025')) {
          errorMessage = "لم تعد هذه الفرصة متاحة.";
        }
        
        toast({
          title: "خطأ",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setProcessing(false);
      }
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-6 sm:py-12">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex items-center">
              {steps.map((s, index) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-sm sm:text-lg font-bold transition-colors ${
                        step >= s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step > s.id ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : s.id}
                    </div>
                     <p className={`mt-1 sm:mt-2 text-xs font-semibold ${step >= s.id ? 'text-primary' : 'text-muted-foreground'}`}>{s.name}</p>
                  </div>
                  {index < steps.length - 1 && <div className={`h-1 w-8 sm:w-16 mx-1 sm:mx-2 mt-[-1rem] sm:mt-[-1.25rem] transition-colors ${step > s.id ? 'bg-primary' : 'bg-muted'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <CardTitle className="text-center font-headline text-xl sm:text-2xl lg:text-3xl">
            {step === 4 ? 'تهانينا! اكتمل استثمارك بنجاح' : `استثمار في ${opportunity.name}`}
          </CardTitle>
          {step < 4 && (
             <CardDescription className="text-center pt-2 text-sm sm:text-base">
                {`الخطوة ${step} من 3: ${steps[step - 1].name}`}
             </CardDescription>
          )}
        </CardHeader>
        <CardContent className="px-4 sm:px-6 py-6 sm:py-8">
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-base sm:text-lg font-medium">أدخل المبلغ الذي تريد استثماره</label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={1000}
                  step={1000}
                  className="py-4 sm:py-7 text-lg sm:text-2xl text-center font-bold"
                />
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm text-center">الحد الأدنى للاستثمار هو 1,000 ريال.</p>
              <Button onClick={handleNext} disabled={amount < 1000} className="w-full" size="lg">متابعة <ArrowRight /></Button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h3 className="font-bold text-base sm:text-lg mb-2">توثيق الهوية (KYC)</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">لأول استثمار لك، نحتاج لتوثيق هويتك عبر نفاذ.</p>
                <Button variant="outline" className="w-full" size="lg">التوثيق عبر نفاذ الوطني الموحد</Button>
                 <p className="text-center text-xs text-muted-foreground mt-2">(هذه نسخة تجريبية، التوثيق غير مطلوب)</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-bold text-base sm:text-lg text-center mb-2">الموافقة على الشروط</h3>
                <div className="flex items-center justify-center space-x-2 space-x-reverse border p-3 sm:p-4 rounded-lg">
                  <Checkbox id="terms" checked={agreed} onCheckedChange={(c) => setAgreed(c as boolean)} className="w-4 h-4 sm:w-5 sm:h-5"/>
                  <label htmlFor="terms" className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    أوافق على <Link href="#" className="underline text-primary hover:text-primary/80">الشروط والأحكام</Link> و <Link href="#" className="underline text-primary hover:text-primary/80">نشرة الطرح</Link>.
                  </label>
                </div>
              </div>
              <Button onClick={handleNext} disabled={!agreed} className="w-full" size="lg">تأكيد والمتابعة للدفع <ArrowRight/></Button>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <p className="text-center text-muted-foreground text-sm sm:text-base">سيتم تحويلك إلى بوابة دفع آمنة لإتمام العملية.</p>
              <div className="p-4 sm:p-6 border rounded-lg bg-secondary/50 space-y-3">
                <p className="font-bold text-base sm:text-lg">ملخص العملية</p>
                <div className="flex justify-between text-muted-foreground text-sm sm:text-base"><span>المبلغ:</span> <span className="font-mono">{amount.toLocaleString('ar-SA')} ريال</span></div>
                <div className="flex justify-between text-muted-foreground text-sm sm:text-base"><span>الرسوم:</span> <span className="font-mono">0 ريال</span></div>
                <hr/>
                <div className="flex justify-between font-bold text-base sm:text-lg mt-2"><span>الإجمالي:</span> <span className="font-mono">{amount.toLocaleString('ar-SA')} ريال</span></div>
              </div>
              <Button onClick={handleNext} disabled={processing} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                <CreditCard />
                {processing ? 'جاري معالجة الدفع...' : 'إتمام الدفع'}
              </Button>
            </div>
          )}
          {step === 4 && (
            <div className="text-center relative py-6 sm:py-8">
              <Confetti />
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium mb-2 text-sm sm:text-base">تم إنشاء استثمارك بنجاح!</p>
                {investmentId && (
                  <p className="text-green-600 text-xs sm:text-sm">رقم الاستثمار: #{investmentId}</p>
                )}
                <p className="text-green-600 text-xs sm:text-sm">مبلغ الاستثمار: {amount.toLocaleString('ar-SA')} ريال</p>
              </div>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">تم إضافة استثمارك في "{opportunity.name}" إلى محفظتك. ستتلقى تحديثات دورية حول تقدم المشروع.</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button onClick={() => router.push('/portfolio')} className="flex-1" size="lg">الذهاب إلى محفظتي</Button>
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="flex-1" size="lg">اكتشاف فرص أخرى</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
