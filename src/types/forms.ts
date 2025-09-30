
import { z } from "zod";

export const developerSchema = z.object({
  name: z.string()
    .min(2, { message: "اسم المطور يجب أن يكون على الأقل 2 أحرف." })
    .max(100, { message: "اسم المطور يجب أن يكون أقل من 100 حرف." })
    .transform(val => val.trim())
    .refine(val => val.length >= 2, { message: "اسم المطور يجب أن يتكون من حرفين على الأقل بعد إزالة المسافات." }),
  description: z.string()
    .max(500, { message: "الوصف يجب أن يكون أقل من 500 حرف." })
    .optional()
    .or(z.literal(''))
    .transform(val => val ? val.trim() : null),
  email: z.string()
    .email({ message: "يرجى إدخال بريد إلكتروني صحيح." })
    .transform(val => val.trim().toLowerCase()),
  phone: z.string()
    .min(10, { message: "رقم الهاتف يجب أن يكون على الأقل 10 أرقام." })
    .max(20, { message: "رقم الهاتف يجب أن يكون أقل من 20 رقم." })
    .transform(val => val.trim()),
});

export type DeveloperFormValues = z.infer<typeof developerSchema>;


export const opportunitySchema = z.object({
  name: z.string()
    .min(2, "اسم الفرصة يجب أن يكون على الأقل 2 أحرف.")
    .max(100, "اسم الفرصة يجب أن يكون أقل من 100 حرف.")
    .transform(val => val.trim())
    .refine(val => val.length >= 2, "اسم الفرصة يجب أن يتكون من حرفين على الأقل بعد إزالة المسافات."),
  description: z.string()
    .min(10, "الوصف يجب أن يكون على الأقل 10 أحرف.")
    .max(1000, "الوصف يجب أن يكون أقل من 1000 حرف.")
    .transform(val => val.trim())
    .refine(val => val.length >= 10, "الوصف يجب أن يتكون من 10 أحرف على الأقل بعد إزالة المسافات."),
  cityId: z.coerce.number({ required_error: "الرجاء اختيار مدينة." }).positive(),
  assetTypeId: z.coerce.number({ required_error: "الرجاء اختيار نوع الأصل." }).positive(),
  developerId: z.coerce.number({ required_error: "الرجاء اختيار المطور." }).positive(),
  expectedReturn: z.coerce.number().positive("العائد المتوقع يجب أن يكون رقمًا موجبًا."),
  duration: z.string().min(1, "الرجاء إدخال المدة."),
  status: z.enum(["active", "inactive", "completed", "cancelled"], { required_error: "الرجاء اختيار الحالة." }),
  funded: z.coerce.number().min(0, "المبلغ الممول يجب أن يكون رقمًا موجبًا.").default(0),
  imageIds: z.string().optional().default(""),
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;


export const phoneSchema = z.object({
  phone: z.string().min(9, { message: "رقم الجوال يجب أن يتكون من 9 أرقام." }).max(9, { message: "رقم الجوال يجب أن يتكون من 9 أرقام." }),
});

export type PhoneFormValues = z.infer<typeof phoneSchema>;

export const passwordSchema = z.object({
    password: z.string().min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل." }),
});

export type PasswordFormValues = z.infer<typeof passwordSchema>;


export const amountSchema = (maxAmount?: number) => z.object({
  amount: z.coerce.number()
    .min(100, { message: "الحد الأدنى هو 100 ريال." })
    .max(maxAmount || 1000000, { message: `الحد الأقصى للسحب هو ${maxAmount?.toLocaleString()} ريال.` })
    .positive("الرجاء إدخال مبلغ صحيح.")
});

export type AmountFormValues = z.infer<ReturnType<typeof amountSchema>>;

export const settingSchema = z.object({
  name: z.string()
    .min(2, { message: "الاسم يجب أن يتكون من حرفين على الأقل." })
    .max(50, { message: "الاسم يجب أن يكون أقل من 50 حرف." })
    .transform(val => val.trim())
    .refine(val => val.length >= 2, { message: "الاسم يجب أن يتكون من حرفين على الأقل بعد إزالة المسافات." }),
});
export type SettingFormValues = z.infer<typeof settingSchema>;

export const userSchema = z.object({
  name: z.string()
    .min(2, { message: "اسم المستخدم يجب أن يكون على الأقل 2 أحرف." })
    .max(100, { message: "اسم المستخدم يجب أن يكون أقل من 100 حرف." })
    .transform(val => val.trim())
    .refine(val => val.length >= 2, { message: "اسم المستخدم يجب أن يتكون من حرفين على الأقل بعد إزالة المسافات." }),
  email: z.string()
    .email({ message: "يرجى إدخال بريد إلكتروني صحيح." })
    .optional()
    .or(z.literal(''))
    .transform(val => val ? val.trim().toLowerCase() : null),
  type: z.enum(["مستثمر", "مطور", "مدير"], { required_error: "يرجى اختيار نوع المستخدم." }),
  status: z.enum(["نشط", "محظور", "مؤرشف"], { required_error: "يرجى اختيار حالة المستخدم." }),
});
export type UserFormValues = z.infer<typeof userSchema>;
