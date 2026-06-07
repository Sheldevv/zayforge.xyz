import { NextResponse } from 'next/server';
import { getLauncherRelease, getGameRelease } from '@/lib/github';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';

  const results: Record<string, unknown> = {};

  if (type === 'all' || type === 'launcher') {
    results.launcher = await getLauncherRelease();
  }

  if (type === 'all' || type === 'game') {
    results.game = await getGameRelease();
  }

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
