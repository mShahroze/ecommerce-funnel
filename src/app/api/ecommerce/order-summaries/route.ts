import EntityCommerceUserEventService from '@/services/ecommerce/EntityCommerceUserEventService';
import { NextResponse } from 'next/server';

const commerceUserEventService = new EntityCommerceUserEventService();

export async function GET(): Promise<NextResponse> {
  const numSessions =
    await commerceUserEventService.genNumRecentEventByType('session');
  const numPurchases =
    await commerceUserEventService.genNumRecentEventByType('purchase');
  const numDollarRevenue = await commerceUserEventService.genNumRecentRevenue();
  return NextResponse.json({
    num_sessions: numSessions,
    num_purchases: numPurchases,
    num_dollar_revenue: numDollarRevenue,
  });
}
