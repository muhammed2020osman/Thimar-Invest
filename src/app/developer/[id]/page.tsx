import { notFound } from 'next/navigation';
import { getDeveloperById } from '@/services/developer.service';
import { Card } from '@/components/ui/card';
import { OpportunityCard } from '@/components/opportunity-card';
import { ThimarLogo } from '@/components/icons/thimar-logo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { InvestmentOpportunity } from '@/types';

export default async function DeveloperProfilePage({ params }: { params: { id: string } }) {
  const developerId = parseInt(params.id, 10);
  const developer = await getDeveloperById(developerId);

  if (!developer) {
    notFound();
  }

  const developerOpportunities = (developer.opportunities || []) as InvestmentOpportunity[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/dashboard`} passHref>
            <Button variant="outline">
                <ArrowLeft className="ml-2 h-4 w-4"/>
                العودة إلى الفرص
            </Button>
        </Link>
      </div>
      <Card className="mb-8 overflow-hidden">
        <div className="bg-secondary/50 p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 bg-background rounded-lg border shadow-sm">
                 <ThimarLogo className="h-16 w-16 text-primary" />
            </div>
          <div>
            <h1 className="text-3xl font-bold font-headline mb-2">{developer.name}</h1>
            <p className="text-muted-foreground max-w-2xl">{developer.description}</p>
          </div>
        </div>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold font-headline mb-6">مشاريع المطور</h2>
        {developerOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developerOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg">
            <p className="text-muted-foreground">لا توجد مشاريع متاحة لهذا المطور حاليًا.</p>
          </div>
        )}
      </div>
    </div>
  );
}
