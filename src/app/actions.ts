"use server";

import { getInvestmentRecommendations } from '@/ai/flows/ai-investment-recommendations';
import { z } from 'zod';
import type { FormState } from '@/types';

const FormSchema = z.object({
  userPreferences: z.string().min(10, "يرجى تقديم تفاصيل أكثر عن تفضيلاتك."),
  marketTrends: z.string(),
});

export async function getInvestmentRecommendationsAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    userPreferences: formData.get('userPreferences'),
    marketTrends: formData.get('marketTrends'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      error: validatedFields.error.flatten().fieldErrors.userPreferences?.[0] ?? "حدث خطأ غير متوقع.",
    };
  }

  try {
    const result = await getInvestmentRecommendations(validatedFields.data);
    return {
      recommendations: result.recommendations,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      ...prevState,
      error: "عذرًا، لم نتمكن من الحصول على توصيات في الوقت الحالي. يرجى المحاولة مرة أخرى.",
    };
  }
}
