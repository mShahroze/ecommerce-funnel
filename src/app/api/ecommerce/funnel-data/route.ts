import EntityCommerceUserEventService from '@/services/ecommerce/EntityCommerceUserEventService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const service = new EntityCommerceUserEventService();

    // Get counts for each funnel step that takes place
    const sessionCount = await service.genNumRecentEventByType('session');
    const productViewCount =
      await service.genNumRecentEventByType('product_view');
    const checkoutCount = await service.genNumRecentEventByType('checkout');
    const purchaseCount = await service.genNumRecentEventByType('purchase');

    return NextResponse.json({
      funnel_data: {
        steps: [
          { type: 'session', count: sessionCount },
          { type: 'product_view', count: productViewCount },
          { type: 'checkout', count: checkoutCount },
          { type: 'purchase', count: purchaseCount },
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funnel data' },
      { status: 500 }
    );
  }
}
