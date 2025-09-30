
"use client";

import { useActionState } from 'react';
import { getInvestmentRecommendationsAction } from '@/app/actions';
import type { FormState } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wand2, AlertCircle, Loader2, Building, DollarSign, Zap } from 'lucide-react';

const initialState: FormState = {
  recommendations: [],
  error: null,
};

export function AiRecommendations() {
  const [state, formAction, pending] = useActionState(getInvestmentRecommendationsAction, initialState);

  return (
    <div>
      <h2 className="text-xl font-bold font-headline mb-4 flex items-center gap-2"><Wand2 className="text-primary"/> توصيات استثمارية بالذكاء الاصطناعي</h2>
      <form action={formAction} className="space-y-4">
        <Textarea
          name="userPreferences"
          placeholder="أدخل تفضيلاتك الاستثمارية هنا. مثال: 'مستثمر متحفظ، أبحث عن نمو طويل الأمد في العقارات السكنية بمدينة الرياض'"
          rows={3}
          required
          className="text-base"
        />
         <input type="hidden" name="marketTrends" value="نمو قوي في قطاع العقارات التجارية والسكنية في المدن الرئيسية، مع زيادة الطلب على الوحدات الصغيرة والمتوسطة." />
        <Button type="submit" disabled={pending} size="lg">
          {pending ? <Loader2 className="animate-spin" /> : <Zap />}
          احصل على توصيات
        </Button>
      </form>

      {state.error && (
        <Alert variant="destructive" className="mt-4 rounded-xl shadow-lg">
          <AlertCircle />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">أفضل الفرص لك:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.recommendations.map((rec, index) => (
              <Card key={index} className="shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>{rec.opportunityName}</CardTitle>
                  <CardDescription className="flex items-center gap-4 pt-2">
                    <span className="flex items-center gap-1"><Building /> {rec.assetType} - {rec.city}</span>
                    <span className="flex items-center gap-1"><DollarSign /> عائد متوقع {rec.expectedReturn}%</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{rec.justification}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
