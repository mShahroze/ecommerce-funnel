import { SeedDataService } from '@/services/seed/SeedDataService';
import { NextResponse } from 'next/server';

const seedService = new SeedDataService();

export async function GET(): Promise<NextResponse> {
  const hasSeedData = await seedService.genHasSeedData();
  return NextResponse.json({ seed_data_exists: hasSeedData });
}

export async function POST(): Promise<NextResponse> {
  await seedService.genWriteSeedData();
  return NextResponse.json({ seed_data_exists: true });
}

export async function DELETE(): Promise<NextResponse> {
  await seedService.genDeleteSeedData();
  return NextResponse.json({ seed_data_exists: false });
}
