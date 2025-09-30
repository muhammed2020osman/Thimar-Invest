
import { opportunityService } from '@/services/opportunity.service';
import authService from '@/services/auth.service';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { InvestmentCalculator } from '@/components/investment-calculator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { BarChart, Clock, Home, Building, Factory, FileText, MapPin } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const assetIcons: { [key: string]: React.ReactNode } = {
  'سكني': <Home className="h-5 w-5" />,
  'تجاري': <Building className="h-5 w-5" />,
  'صناعي': <Factory className="h-5 w-5" />,
};

export default async function OpportunityPage({ params }: { params: { id: string } }) {
  const opportunityId = parseInt(params.id, 10);
  const opportunity = await opportunityService.getOpportunityById(opportunityId);

  if (!opportunity) {
    notFound();
  }
  
  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);
  const imageIds = Array.isArray(opportunity.image_ids) ? opportunity.image_ids as string[] : [];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-headline mb-3">{opportunity.name}</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-muted-foreground text-sm sm:text-base">
            <div className="flex items-center gap-2">
              {assetIcons[opportunity.asset_type?.name || '']}
              <span>{opportunity.asset_type?.name || 'غير محدد'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{opportunity.city?.name || 'غير محدد'}</span>
            </div>
            <Badge variant={opportunity.status === 'متاحة' ? 'default' : 'secondary'} className="bg-green-100 text-green-800 text-xs sm:text-sm">
              {opportunity.status}
            </Badge>
          </div>
        </div>

        {/* Carousel and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
          <div className="lg:col-span-3 order-2 lg:order-1">
             <Carousel className="w-full" dir="ltr">
              <CarouselContent>
                {imageIds.map((id, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden rounded-2xl">
                      <Image
                        alt={`صورة ${opportunity.name} ${index + 1}`}
                        className="aspect-video w-full object-cover"
                        height={250}
                        src={getImage(id)?.imageUrl || ''}
                        width={500}
                        data-ai-hint={getImage(id)?.imageHint}
                      />
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="right-2 sm:right-4 lg:right-16" />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 order-1 lg:order-2">
             <Card>
                <CardHeader className="pb-3">
                    <h2 className="font-headline text-lg sm:text-xl">مؤشرات الفرصة</h2>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                    <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-secondary/10 rounded-lg">
                        <BarChart className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-primary"/>
                        <p className="text-xs sm:text-sm text-muted-foreground">العائد المتوقع</p>
                        <p className="text-base sm:text-lg font-bold" dir="ltr">{opportunity.expected_return}%</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-secondary/10 rounded-lg">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-primary"/>
                        <p className="text-xs sm:text-sm text-muted-foreground">المدة</p>
                        <p className="text-base sm:text-lg font-bold">{opportunity.duration}</p>
                    </div>
                </CardContent>
            </Card>
            <InvestmentCalculator expectedReturn={opportunity.expected_return} />
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="hidden sm:inline">نظرة عامة</span>
              <span className="sm:hidden">نظرة</span>
            </TabsTrigger>
            <TabsTrigger value="financials" className="text-xs sm:text-sm py-2 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="hidden sm:inline">التفاصيل المالية</span>
              <span className="sm:hidden">مالية</span>
            </TabsTrigger>
            <TabsTrigger value="developer" className="text-xs sm:text-sm py-2 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="hidden sm:inline">المطور</span>
              <span className="sm:hidden">مطور</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs sm:text-sm py-2 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="hidden sm:inline">المستندات</span>
              <span className="sm:hidden">مستندات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="bg-card p-4 sm:p-6 rounded-lg border">
            <h3 className="text-lg sm:text-xl font-bold font-headline mb-3 sm:mb-4">لماذا نستثمر في هذه الفرصة؟</h3>
            <p className="text-muted-foreground text-sm sm:text-base">{opportunity.description}</p>
          </TabsContent>

          <TabsContent value="financials" className="bg-card p-4 sm:p-6 rounded-lg border">
            <h3 className="text-lg sm:text-xl font-bold font-headline mb-3 sm:mb-4">التفاصيل المالية</h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between border-b pb-3">
                <span className="font-medium text-muted-foreground">حجم الصندوق</span>
                <span className="font-bold">25,000,000 ريال</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="font-medium text-muted-foreground">سعر الوحدة</span>
                <span className="font-bold">1,000 ريال</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="font-medium text-muted-foreground">الحد الأدنى للاستثمار</span>
                <span className="font-bold">1,000 ريال</span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="font-medium text-muted-foreground">رسوم الإدارة</span>
                <span className="font-bold">1.5% سنويًا</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="developer" className="bg-card p-4 sm:p-6 rounded-lg border">
             <h3 className="text-lg sm:text-xl font-bold font-headline mb-3 sm:mb-4">
              عن المطور: <Link href={`/developer/${opportunity.developerId}`} className="text-primary hover:underline">{opportunity.developer.name}</Link>
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
                {opportunity.developer.description}
            </p>
          </TabsContent>

          <TabsContent value="documents" className="bg-card p-4 sm:p-6 rounded-lg border">
            <h3 className="text-lg sm:text-xl font-bold font-headline mb-3 sm:mb-4">المستندات القانونية</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="outline" asChild className="text-xs sm:text-sm">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <FileText className="ml-2 h-4 w-4" />
                        نشرة الطرح
                    </a>
                </Button>
                <Button variant="outline" asChild className="text-xs sm:text-sm">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <FileText className="ml-2 h-4 w-4" />
                        الشروط والأحكام
                    </a>
                </Button>
            </div>
          </TabsContent>
        </Tabs>

      </div>
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm p-3 sm:p-4 border-t w-full shadow-lg">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="text-center sm:text-right flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground">جاهز للاستثمار؟</p>
            <p className="font-bold text-sm sm:text-lg truncate">{opportunity.name}</p>
          </div>
          <Link href={`/invest/${opportunity.id}`} passHref className="w-full sm:w-auto">
            <Button size="lg" className="font-bold w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              استثمر الآن
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
