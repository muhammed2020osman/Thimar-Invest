'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { opportunitySchema, type OpportunityFormValues } from '@/types/forms';
import { opportunityService } from '@/services/opportunity.service';
import { cityService, assetTypeService } from '@/services/settings.service';
import { developerService } from '@/services/developer.service';
import { useToast } from '@/hooks/use-toast';
import type { InvestmentOpportunity, City, AssetType, Developer } from '@/types';

const statusVariant: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
  "active": "default",
  "completed": "secondary",
  "inactive": "outline",
  "cancelled": "destructive"
};

const getStatusLabel = (status: string): string => {
  const statusLabels: { [key: string]: string } = {
    "active": "متاحة",
    "completed": "مكتملة",
    "inactive": "غير نشطة",
    "cancelled": "ملغية"
  };
  return statusLabels[status] || status;
};

const emptyOpportunity: OpportunityFormValues = {
  name: "",
  assetTypeId: 0,
  developerId: 0,
  cityId: 0,
  expectedReturn: 10,
  duration: "3 سنوات",
  status: "active",
  description: "",
  funded: 0,
  imageIds: "",
};

// Component that uses useSearchParams - needs to be wrapped in Suspense
function OpportunityFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [currentOpportunity, setCurrentOpportunity] = useState<InvestmentOpportunity | null>(null);
  
  const opportunityId = searchParams.get('id');
  const isEditMode = Boolean(opportunityId);

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: emptyOpportunity,
  });

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesData, assetTypesData, developersData] = await Promise.all([
          cityService.getCities(),
          assetTypeService.getAssetTypes(),
          developerService.getDevelopers()
        ]);

        setCities(citiesData?.payload?.data || citiesData?.data || citiesData || []);
        setAssetTypes(assetTypesData?.payload?.data || assetTypesData?.data || assetTypesData || []);
        setDevelopers(developersData?.payload?.data || developersData?.data || developersData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({ title: "خطأ", description: "فشل في جلب البيانات.", variant: "destructive" });
      }
    };

    fetchData();
  }, [toast]);

  // Fetch opportunity data if editing
  useEffect(() => {
    if (isEditMode && opportunityId) {
      const fetchOpportunity = async () => {
        setIsLoading(true);
        try {
          const opportunity = await opportunityService.getOpportunityById(parseInt(opportunityId));
          setCurrentOpportunity(opportunity);
          
          // Populate form with existing data
          form.reset({
            name: opportunity.name,
            description: opportunity.description,
            cityId: opportunity.city_id,
            assetTypeId: opportunity.asset_type_id,
            developerId: opportunity.developer_id,
            expectedReturn: parseFloat(opportunity.expected_return),
            duration: opportunity.duration,
            status: opportunity.status,
            funded: opportunity.funded || 0,
            imageIds: opportunity.image_ids || "",
          });
        } catch (error) {
          console.error('Error fetching opportunity:', error);
          toast({ title: "خطأ", description: "فشل في جلب بيانات الفرصة.", variant: "destructive" });
          router.push('/admin/opportunities');
        } finally {
          setIsLoading(false);
        }
      };

      fetchOpportunity();
    }
  }, [isEditMode, opportunityId, form, toast, router]);

  const onSubmit = async (data: OpportunityFormValues) => {
    setIsSubmitting(true);
    try {
      const opportunityData = {
        name: data.name,
        description: data.description,
        expected_return: data.expectedReturn,
        duration: data.duration,
        funded: data.funded,
        status: data.status,
        developer_id: data.developerId,
        city_id: data.cityId,
        asset_type_id: data.assetTypeId,
        image_ids: data.imageIds || null,
      };

      if (isEditMode && opportunityId) {
        // Update existing opportunity
        await opportunityService.updateOpportunity(parseInt(opportunityId), {
          name: data.name,
          description: data.description,
          expected_return: data.expectedReturn,
          duration: data.duration,
          funded: data.funded,
          status: data.status,
          developer_id: data.developerId,
          city_id: data.cityId,
          asset_type_id: data.assetTypeId,
          image_ids: data.imageIds || null,
        });
        toast({ title: "نجاح", description: "تم تحديث الفرصة بنجاح." });
      } else {
        // Create new opportunity
        await opportunityService.createOpportunity(opportunityData);
        toast({ title: "نجاح", description: "تم إنشاء الفرصة بنجاح." });
      }
      
      router.push('/admin/opportunities');
    } catch (error: any) {
      console.error('Error saving opportunity:', error);
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في حفظ الفرصة.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/opportunities')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          العودة
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'تعديل الفرصة' : 'إضافة فرصة جديدة'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? 'قم بتحديث تفاصيل الفرصة' : 'أدخل تفاصيل الفرصة الجديدة'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الفرصة</CardTitle>
          <CardDescription>
            {isEditMode ? 'قم بتحديث المعلومات المطلوبة' : 'املأ جميع الحقول المطلوبة'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">اسم الفرصة *</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: صندوق برج الرياض" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expectedReturn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">العائد المتوقع (%) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="15.5" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">الوصف *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="وصف مفصل للفرصة الاستثمارية وأهدافها" 
                        {...field} 
                        rows={4} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Selection Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">المدينة *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر مدينة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city.id} value={city.id.toString()}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assetTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">نوع الأصل *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الأصل" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assetTypes.map(assetType => (
                            <SelectItem key={assetType.id} value={assetType.id.toString()}>
                              {assetType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="developerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">المطور *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المطور" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {developers.map(developer => (
                            <SelectItem key={developer.id} value={developer.id.toString()}>
                              {developer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">المدة</FormLabel>
                      <FormControl>
                        <Input placeholder="3 سنوات" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="funded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">المبلغ الممول (ريال)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">الحالة</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">متاحة</SelectItem>
                          <SelectItem value="completed">مكتملة</SelectItem>
                          <SelectItem value="inactive">غير نشطة</SelectItem>
                          <SelectItem value="cancelled">ملغية</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditMode ? 'تحديث الفرصة' : 'إنشاء الفرصة'}
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/opportunities')}
                  disabled={isSubmitting}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading fallback component
function OpportunityFormLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

// Main page component with Suspense boundary
export default function OpportunityFormPage() {
  return (
    <Suspense fallback={<OpportunityFormLoading />}>
      <OpportunityFormContent />
    </Suspense>
  );
}
