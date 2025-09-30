"use client";

import { useState, useMemo, useEffect } from 'react';
import { OpportunityCard } from '@/components/opportunity-card';
import type { InvestmentOpportunity, AssetType, City } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AiRecommendations } from '@/components/ai-recommendations';
import { ListFilter } from 'lucide-react';
import { opportunityService } from '@/services/opportunity.service';
import { cityService, assetTypeService } from '@/services/settings.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function DashboardPage() {
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState(true);

  const [cityFilter, setCityFilter] = useState('0');
  const [assetTypeFilter, setAssetTypeFilter] = useState('0');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [opps, allCities, allAssetTypes] = await Promise.all([
          opportunityService.getOpportunities(),
          cityService.getCities(),
          assetTypeService.getAssetTypes()
        ]);
        
        // Ensure opportunities is an array
        const opportunitiesArray = Array.isArray(opps) ? opps : (opps?.data || opps?.payload?.data || []);
        setOpportunities(opportunitiesArray);
        
        // Ensure cities is an array
        const citiesArray = Array.isArray(allCities) ? allCities : (allCities?.data || allCities?.payload?.data || []);
        setCities([{ id: 0, name: 'كل المدن' }, ...citiesArray]);
        
        // Ensure assetTypes is an array
        const assetTypesArray = Array.isArray(allAssetTypes) ? allAssetTypes : (allAssetTypes?.data || allAssetTypes?.payload?.data || []);
        setAssetTypes([{ id: 0, name: 'كل الأنواع' }, ...assetTypesArray]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setOpportunities([]);
        setCities([{ id: 0, name: 'كل المدن' }]);
        setAssetTypes([{ id: 0, name: 'كل الأنواع' }]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statuses = useMemo(() => {
    if (!Array.isArray(opportunities)) return ['all'];
    return ['all', ...Array.from(new Set(opportunities.map(op => op.status)))];
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    if (!Array.isArray(opportunities)) return [];
    
    const filtered = opportunities.filter(op => {
      const cityMatch = cityFilter === 'all' || cityFilter === '0' || op.city_id === Number(cityFilter);
      const assetTypeMatch = assetTypeFilter === 'all' || assetTypeFilter === '0' || op.asset_type_id === Number(assetTypeFilter);
      const statusMatch = statusFilter === 'all' || op.status === statusFilter;
      return cityMatch && assetTypeMatch && statusMatch;
    });
    
    // Debug logging
    console.log('Filter values:', { cityFilter, assetTypeFilter, statusFilter });
    console.log('Total opportunities:', opportunities.length);
    console.log('Filtered opportunities:', filtered.length);
    
    return filtered;
  }, [opportunities, cityFilter, assetTypeFilter, statusFilter]);

  const statusMap: { [key: string]: string } = { 'all': 'كل الحالات', 'متاحة': 'متاحة', 'مكتملة': 'مكتملة', 'مغلقة': 'مغلقة'};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2">اكتشف الفرص</h1>
        <p className="text-muted-foreground">تصفح أحدث الفرص الاستثمارية المتاحة.</p>
      </div>

      <div className="mb-8 p-6 rounded-2xl bg-card border shadow-lg">
        <AiRecommendations />
      </div>

      <div className="mb-6 flex flex-col gap-4 p-4 bg-card rounded-2xl border shadow-lg">
        <div className="flex items-center gap-2 font-bold text-lg">
          <ListFilter className="w-5 h-5"/>
          <span>تصفية النتائج</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 w-full">
          <Select value={cityFilter} onValueChange={setCityFilter} disabled={loading}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="المدينة" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => <SelectItem key={city.id} value={String(city.id)}>{city.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter} disabled={loading}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="نوع الأصل" />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map(type => <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <Card key={i} className="flex flex-col h-full overflow-hidden rounded-2xl shadow-lg">
              <Skeleton className="h-48 w-full"/>
              <CardContent className="p-6 flex-grow space-y-4">
                <Skeleton className="h-6 w-3/4"/>
                <Skeleton className="h-4 w-1/2"/>
                 <Skeleton className="h-4 w-full"/>
              </CardContent>
              <CardFooter className="p-6 bg-muted/20 flex justify-between items-center">
                 <Skeleton className="h-8 w-1/3"/>
                 <Skeleton className="h-10 w-1/3"/>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl">
          <p className="text-muted-foreground">لا توجد فرص تطابق معايير البحث الحالية.</p>
        </div>
      )}
    </div>
  );
}
