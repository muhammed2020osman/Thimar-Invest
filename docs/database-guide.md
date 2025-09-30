# دليل التعامل مع قاعدة البيانات - Thimar Investment Platform

## نظرة عامة على البنية

يستخدم هذا المشروع **Prisma ORM** مع قاعدة بيانات **MySQL** لإدارة البيانات. النظام مصمم لإدارة الفرص الاستثمارية والمستخدمين والمعاملات.

## هيكل قاعدة البيانات

### النماذج الأساسية (Models)

```prisma
// 1. أنواع الأصول
model AssetType {
  id                    Int                     @id @default(autoincrement())
  name                  String                  // اسم نوع الأصل (تجاري، سكني، صناعي)
  InvestmentOpportunity InvestmentOpportunity[]
}

// 2. المدن
model City {
  id                    Int                     @id @default(autoincrement())
  name                  String                  // اسم المدينة
  InvestmentOpportunity InvestmentOpportunity[]
}

// 3. المطورين
model Developer {
  id                    Int                     @id @default(autoincrement())
  name                  String                  // اسم المطور
  description           String                  @db.Text
  logoUrl               String                  // رابط الشعار
  InvestmentOpportunity InvestmentOpportunity[]
}

// 4. الفرص الاستثمارية
model InvestmentOpportunity {
  id             Int              @id @default(autoincrement())
  name           String           // اسم الفرصة
  expectedReturn Float            // العائد المتوقع
  duration       String           // مدة الاستثمار
  funded         Int              // نسبة التمويل
  status         String           // حالة الفرصة
  imageIds       String           @db.LongText  // معرفات الصور (JSON)
  description    String           @db.Text      // الوصف
  
  // Foreign Keys
  developerId    Int
  cityId         Int
  assetTypeId    Int
  
  // Relations
  assetType      AssetType        @relation(fields: [assetTypeId], references: [id], onDelete: Cascade)
  city           City             @relation(fields: [cityId], references: [id], onDelete: Cascade)
  developer      Developer        @relation(fields: [developerId], references: [id], onDelete: Cascade)
  UserInvestment UserInvestment[]
}

// 5. المستخدمين
model User {
  id             Int              @id @default(autoincrement())
  name           String           // اسم المستخدم
  email          String           @unique
  avatar         String?          // صورة المستخدم (اختيارية)
  type           String           // نوع المستخدم
  status         String           // حالة المستخدم
  joinDate       DateTime         @default(now())
  
  Transaction    Transaction[]
  UserInvestment UserInvestment[]
}

// 6. استثمارات المستخدمين
model UserInvestment {
  id                    Int                   @id @default(autoincrement())
  amount                Float                 // مبلغ الاستثمار
  status                String                // حالة الاستثمار
  profit                Float?                // الربح (اختياري)
  userId                Int
  opportunityId         Int
  
  InvestmentOpportunity InvestmentOpportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)
  User                  User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// 7. المعاملات
model Transaction {
  id     Int      @id @default(autoincrement())
  type   String   // نوع المعاملة
  amount Float    // المبلغ
  date   DateTime @default(now())
  status String   // حالة المعاملة
  userId Int
  
  User   User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## إعداد Prisma Client

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## أنواع TypeScript

```typescript
// src/types/index.ts
import type { 
  Prisma, 
  InvestmentOpportunity as PrismaInvestmentOpportunity,
  Developer as PrismaDeveloper,
  City as PrismaCity,
  AssetType as PrismaAssetType,
  UserInvestment as PrismaUserInvestment,
  User as PrismaUser,
  Transaction as PrismaTransaction 
} from '@prisma/client';

export type Developer = PrismaDeveloper & {
  opportunities?: InvestmentOpportunity[];
}

export type City = PrismaCity;
export type AssetType = PrismaAssetType;

export type InvestmentOpportunity = PrismaInvestmentOpportunity & {
  developer: Developer;
  city: City;
  assetType: AssetType;
  investments?: UserInvestment[];
}

export type UserInvestment = PrismaUserInvestment & {
  opportunity: InvestmentOpportunity;
}

export type User = PrismaUser & {
  investments?: UserInvestment[];
  transactions?: Transaction[];
}

export type Transaction = PrismaTransaction;
```

## خدمات قاعدة البيانات - أمثلة شاملة

### 1. الحصول على البيانات (Read Operations)

```typescript
// الحصول على جميع الفرص الاستثمارية مع العلاقات
export async function getOpportunities(): Promise<InvestmentOpportunity[]> {
  try {
    const opportunities = await prisma.investmentOpportunity.findMany({
      include: {
        developer: true,  // تضمين بيانات المطور
        city: true,       // تضمين بيانات المدينة
        assetType: true   // تضمين بيانات نوع الأصل
      },
      orderBy: { id: 'desc' }  // ترتيب تنازلي حسب ID
    });
    
    return opportunities.map(transformOpportunity);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    throw new Error('فشل في جلب الفرص الاستثمارية');
  }
}

// الحصول على فرصة استثمارية واحدة بواسطة ID
export async function getOpportunityById(id: number): Promise<InvestmentOpportunity | null> {
  try {
    const opportunity = await prisma.investmentOpportunity.findUnique({
      where: { id },
      include: {
        developer: true,
        city: true,
        assetType: true,
        UserInvestment: {  // تضمين الاستثمارات المرتبطة
          include: {
            User: true
          }
        }
      }
    });
    
    return opportunity ? transformOpportunity(opportunity) : null;
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return null;
  }
}

// البحث في الفرص الاستثمارية
export async function searchOpportunities(searchQuery: string): Promise<InvestmentOpportunity[]> {
  try {
    const opportunities = await prisma.investmentOpportunity.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery } },
          { description: { contains: searchQuery } },
          { developer: { name: { contains: searchQuery } } },
          { city: { name: { contains: searchQuery } } }
        ]
      },
      include: {
        developer: true,
        city: true,
        assetType: true
      }
    });
    
    return opportunities.map(transformOpportunity);
  } catch (error) {
    console.error('Error searching opportunities:', error);
    throw new Error('فشل في البحث');
  }
}
```

### 2. إنشاء البيانات (Create Operations)

```typescript
// إنشاء فرصة استثمارية جديدة
export async function createOpportunity(data: OpportunityFormValues) {
  try {
    const trimmedName = data.name.trim();
    
    // التحقق من عدم وجود فرصة بنفس الاسم
    const existingOpportunity = await prisma.investmentOpportunity.findFirst({
      where: { name: trimmedName }
    });
    
    if (existingOpportunity) {
      throw new Error('هذه الفرصة موجودة بالفعل');
    }

    const opportunity = await prisma.investmentOpportunity.create({
      data: {
        name: trimmedName,
        description: data.description.trim(),
        expectedReturn: data.expectedReturn,
        duration: data.duration,
        status: data.status,
        funded: 0,
        imageIds: JSON.stringify(["office-tower"]), // تحويل المصفوفة إلى JSON
        developerId: data.developerId,
        cityId: data.cityId,
        assetTypeId: data.assetTypeId
      },
      include: {
        developer: true,
        city: true,
        assetType: true
      }
    });
    
    return transformOpportunity(opportunity);
  } catch (error: any) {
    console.error('Error creating opportunity:', error);
    
    // معالجة أخطاء Prisma المحددة
    if (error.code === 'P2002') {
      throw new Error('هذه الفرصة موجودة بالفعل');
    }
    
    throw new Error(error.message || 'فشل في إنشاء الفرصة');
  }
}

// إنشاء مستخدم جديد
export async function createUser(userData: {
  name: string;
  email: string;
  type: string;
  status: string;
  avatar?: string;
}) {
  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        type: userData.type,
        status: userData.status,
        avatar: userData.avatar || null,
        joinDate: new Date()
      }
    });
    
    return user;
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('البريد الإلكتروني مُستخدم بالفعل');
    }
    throw new Error('فشل في إنشاء المستخدم');
  }
}
```

### 3. تحديث البيانات (Update Operations)

```typescript
// تحديث فرصة استثمارية
export async function updateOpportunity(id: number, data: OpportunityFormValues) {
  try {
    const opportunity = await prisma.investmentOpportunity.update({
      where: { id },
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        expectedReturn: data.expectedReturn,
        duration: data.duration,
        status: data.status,
        developerId: data.developerId,
        cityId: data.cityId,
        assetTypeId: data.assetTypeId
      },
      include: {
        developer: true,
        city: true,
        assetType: true
      }
    });
    
    return transformOpportunity(opportunity);
  } catch (error: any) {
    console.error('Error updating opportunity:', error);
    
    if (error.code === 'P2025') {
      throw new Error('الفرصة غير موجودة');
    }
    
    throw new Error('فشل في تحديث الفرصة');
  }
}

// تحديث نسبة التمويل
export async function updateFundingPercentage(opportunityId: number, newFunded: number) {
  try {
    const opportunity = await prisma.investmentOpportunity.update({
      where: { id: opportunityId },
      data: { funded: newFunded }
    });
    
    return opportunity;
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('الفرصة غير موجودة');
    }
    throw new Error('فشل في تحديث نسبة التمويل');
  }
}
```

### 4. حذف البيانات (Delete Operations)

```typescript
// حذف فرصة استثمارية
export async function deleteOpportunity(id: number) {
  try {
    const opportunity = await prisma.investmentOpportunity.delete({
      where: { id },
      include: {
        developer: true,
        city: true,
        assetType: true
      }
    });
    
    return transformOpportunity(opportunity);
  } catch (error: any) {
    console.error('Error deleting opportunity:', error);
    
    if (error.code === 'P2025') {
      throw new Error('الفرصة غير موجودة');
    }
    
    throw new Error('فشل في حذف الفرصة');
  }
}
```

### 5. العمليات المعقدة (Complex Operations)

```typescript
// الحصول على إحصائيات المستخدم
export async function getUserStatistics(userId: number) {
  try {
    const [user, investments, transactions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId }
      }),
      prisma.userInvestment.findMany({
        where: { userId },
        include: {
          InvestmentOpportunity: {
            include: {
              developer: true,
              city: true,
              assetType: true
            }
          }
        }
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      })
    ]);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalProfit = investments.reduce((sum, inv) => sum + (inv.profit || 0), 0);

    return {
      user,
      investments,
      transactions,
      statistics: {
        totalInvested,
        totalProfit,
        totalReturn: totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0,
        activeInvestments: investments.filter(inv => inv.status === 'active').length
      }
    };
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw new Error('فشل في جلب إحصائيات المستخدم');
  }
}

// إنشاء استثمار جديد مع معاملة
export async function createInvestment(data: {
  userId: number;
  opportunityId: number;
  amount: number;
}) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // إنشاء الاستثمار
      const investment = await prisma.userInvestment.create({
        data: {
          userId: data.userId,
          opportunityId: data.opportunityId,
          amount: data.amount,
          status: 'active',
          profit: 0
        }
      });

      // إنشاء معاملة مالية
      const transaction = await prisma.transaction.create({
        data: {
          userId: data.userId,
          type: 'investment',
          amount: data.amount,
          status: 'completed'
        }
      });

      // تحديث نسبة التمويل في الفرصة
      const opportunity = await prisma.investmentOpportunity.findUnique({
        where: { id: data.opportunityId }
      });

      if (opportunity) {
        const newFunded = opportunity.funded + Math.round((data.amount / 1000000) * 100);
        await prisma.investmentOpportunity.update({
          where: { id: data.opportunityId },
          data: { funded: Math.min(newFunded, 100) }
        });
      }

      return { investment, transaction };
    });

    return result;
  } catch (error) {
    console.error('Error creating investment:', error);
    throw new Error('فشل في إنشاء الاستثمار');
  }
}
```

## دالة التحويل (Transformation Function)

```typescript
// دالة مساعدة لتحويل البيانات من قاعدة البيانات إلى النوع المطلوب في الواجهة
function transformOpportunity(dbOpportunity: any): InvestmentOpportunity {
  return {
    ...dbOpportunity,
    imageIds: typeof dbOpportunity.imageIds === 'string' 
      ? JSON.parse(dbOpportunity.imageIds) 
      : dbOpportunity.imageIds
  };
}
```

## معالجة الأخطاء

### أخطاء Prisma الشائعة:

- **P2002**: انتهاك قيد الفريد (Unique constraint violation)
- **P2025**: السجل غير موجود (Record not found)
- **P2003**: انتهاك قيد المفتاح الخارجي (Foreign key constraint violation)

```typescript
function handlePrismaError(error: any) {
  switch (error.code) {
    case 'P2002':
      return 'هذا العنصر موجود بالفعل';
    case 'P2025':
      return 'العنصر المطلوب غير موجود';
    case 'P2003':
      return 'لا يمكن حذف هذا العنصر لأنه مرتبط بعناصر أخرى';
    default:
      return 'حدث خطأ في قاعدة البيانات';
  }
}
```

## أوامر Prisma المفيدة

```bash
# إنشاء الـ Client
npx prisma generate

# إنشاء migration جديد
npx prisma migrate dev --name add_new_field

# تطبيق migrations على الإنتاج
npx prisma migrate deploy

# إعادة تعيين قاعدة البيانات
npx prisma migrate reset

# فتح Prisma Studio
npx prisma studio

# تحديث قاعدة البيانات من Schema
npx prisma db push
```

## نصائح مهمة

1. **استخدم المعاملات**: للعمليات المعقدة التي تتطلب تحديث أكثر من جدول
2. **تضمين العلاقات**: استخدم `include` لجلب البيانات المرتبطة
3. **معالجة الأخطاء**: تعامل مع أخطاء Prisma بشكل صحيح
4. **التحقق من البيانات**: تأكد من صحة البيانات قبل الإدراج
5. **الفهرسة**: استخدم الفهارس للاستعلامات السريعة
6. **التحويل**: استخدم دوال التحويل للحقول الخاصة مثل JSON

هذا الدليل يوفر أساساً قوياً للتعامل مع قاعدة البيانات في مشروع Thimar Investment Platform.