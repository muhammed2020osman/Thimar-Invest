
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Target, LineChart } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: 'عرض الفرص',
    description: 'نطرح فرصاً استثمارية مدروسة ومُجازة من هيئة السوق المالية في قطاعات عقارية متنوعة.',
  },
  {
    icon: <LineChart className="h-8 w-8 text-primary" />,
    title: 'تسهيل القرار',
    description: 'نوفر كل المعلومات بشفافية تامة، بما في ذلك حاسبة تفاعلية للعائد المتوقع والمستندات القانونية.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'تمكين الاستثمار',
    description: 'استثمر بسهولة عبر خطوات رقمية بالكامل، بدءاً من التوثيق عبر "النفاذ الوطني" وانتهاءً بالدفع الإلكتروني الآمن.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-1 lg:gap-12 xl:grid-cols-1">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-secondary/10 px-3 py-1 text-sm text-secondary font-headline">
                    مرخص من هيئة السوق المالية
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    امتلك عقارات متنوعة تبدأ من 1000 ريال
                  </h1>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    تطبيق "ثمار" هو منصة تقنية مالية تهدف إلى دمقرطة الاستثمار العقاري في المملكة العربية السعودية بجعله متاحاً، شفافاً، وسهلاً للجميع.
                  </p>
                </div>
                <div className="w-full max-w-sm sm:max-w-md mx-auto">
                   <Link href="/dashboard" passHref>
                    <Button size="lg" className="w-full font-bold text-lg py-7">
                      اكتشف الفرص
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">كيف نعمل؟</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  في 3 خطوات بسيطة، يمكنك البدء في بناء محفظتك العقارية.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-3 md:gap-12">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-center bg-primary/10 rounded-full w-16 h-16 mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
