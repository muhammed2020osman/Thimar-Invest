import { NextRequest, NextResponse } from 'next/server';
import { opportunityService } from '@/services/opportunity.service';
import type { OpportunityFormValues } from '@/types/forms';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID' },
        { status: 400 }
      );
    }

    const opportunity = await opportunityService.getOpportunityById(id);
    if (!opportunity) {
      return NextResponse.json(
        { error: 'الفرصة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID' },
        { status: 400 }
      );
    }

    const data: OpportunityFormValues = await request.json();
    
    // Validate required fields
    if (!data.name || !data.description || !data.developerId || !data.cityId || !data.assetTypeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const opportunity = await opportunityService.updateOpportunity(id, data);
    return NextResponse.json(opportunity);
  } catch (error: any) {
    console.error('Error updating opportunity:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'الفرصة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID' },
        { status: 400 }
      );
    }

    await opportunityService.deleteOpportunity(id);
    return NextResponse.json({ message: 'تم حذف الفرصة بنجاح' });
  } catch (error: any) {
    console.error('Error deleting opportunity:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'الفرصة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}