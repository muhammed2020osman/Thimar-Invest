import { NextRequest, NextResponse } from 'next/server';
import type { OpportunityFormValues } from '@/types/forms';

export async function GET() {
  try {
    console.log('Fetching opportunities...');
    
    // Fetch directly from Laravel backend
    const response = await fetch('http://localhost:8000/api/v1/test/investment/opportunities');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const opportunities = await response.json();
    console.log('Opportunities fetched:', opportunities);
    return NextResponse.json(opportunities);
  } catch (error: any) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Creating opportunity...');
    const data: OpportunityFormValues = await request.json();
    console.log('Opportunity data received:', data);
    
    // Validate required fields
    if (!data.name || !data.description || !data.developerId || !data.cityId || !data.assetTypeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Transform data to match backend expectations
    const opportunityData = {
      name: data.name,
      description: data.description,
      expected_return: data.expectedReturn || 0,
      duration: data.duration || 'غير محدد',
      funded: data.funded || 0,
      status: data.status || 'active',
      developer_id: data.developerId,
      city_id: data.cityId,
      asset_type_id: data.assetTypeId,
      image_ids: data.imageIds || null,
    };

    // Send directly to Laravel backend
    const response = await fetch('http://localhost:8000/api/v1/test/investment/opportunities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(opportunityData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const opportunity = await response.json();
    console.log('Opportunity created:', opportunity);
    return NextResponse.json(opportunity, { status: 201 });
  } catch (error: any) {
    console.error('Error creating opportunity:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}