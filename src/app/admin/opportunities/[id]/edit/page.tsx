'use client';

import { use } from 'react';
import { redirect } from 'next/navigation';

interface EditOpportunityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditOpportunityPage({ params }: EditOpportunityPageProps) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  // Redirect to the unified form page with the ID parameter
  redirect(`/admin/opportunities/new?id=${id}`);
}
