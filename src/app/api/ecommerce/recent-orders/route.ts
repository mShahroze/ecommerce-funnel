import EntityCommerceUserEventService from '@/services/ecommerce/EntityCommerceUserEventService';
import { NextResponse } from 'next/server';

const commerceUserEventService = new EntityCommerceUserEventService();

export async function GET(): Promise<NextResponse> {
  const recentOrders = await commerceUserEventService.genRecentOrderDetails();

  return NextResponse.json({
    recent_orders: recentOrders,
  });
}
