import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { InvestmentOpportunity } from '@/types';
import { Home, Building, Factory, MapPin } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const assetIcons: { [key: string]: React.ReactNode } = {
  'سكني': <Home className="h-4 w-4 text-muted-foreground" />,
  'تجاري': <Building className="h-4 w-4 text-muted-foreground" />,
  'صناعي': <Factory className="h-4 w-4 text-muted-foreground" />,
};

export function OpportunityCard({ opportunity }: { opportunity: InvestmentOpportunity }) {
  const { id, name, asset_type, city, expected_return, funded, status, image_ids } = opportunity;
  const imageId = Array.isArray(image_ids) && image_ids.length > 0 ? image_ids[0] as string : "office-tower";
  const image = PlaceHolderImages.find(img => img.id === imageId);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 rounded-2xl shadow-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/opportunity/${id}`} passHref>
          <div className="overflow-hidden">
            <Image
              alt={name}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
              height={225}
              src={image?.imageUrl || ''}
              width={400}
              data-ai-hint={image?.imageHint}
            />
          </div>
        </Link>
        <Badge className="absolute top-4 right-4" variant={status === 'متاحة' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Link href={`/opportunity/${id}`} passHref>
          <CardTitle className="font-headline text-xl mb-2 hover:text-primary transition-colors">{name}</CardTitle>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4">
          <div className="flex items-center gap-1">
            {assetIcons[asset_type?.name || '']}
            <span>{asset_type?.name || 'غير محدد'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{city?.name || 'غير محدد'}</span>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">التمويل</span>
            <span className="font-bold" dir="ltr">{funded}%</span>
          </div>
          <Progress value={funded} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-muted/20 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">العائد المتوقع</p>
          <p className="font-bold text-lg text-primary" dir="ltr">{expected_return}%</p>
        </div>
        <Link href={`/opportunity/${id}`} passHref>
          <Button>عرض التفاصيل</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
