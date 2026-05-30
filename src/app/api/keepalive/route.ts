import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Supabase credentials are missing' },
      { status: 500 }
    );
  }

  try {
    // Ping the Supabase REST API base endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok || response.status === 400) {
      return NextResponse.json({
        success: true,
        message: 'Successfully pinged Supabase to keep it alive.',
        status: response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to ping Supabase', status: response.status },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error pinging Supabase', details: error.message },
      { status: 500 }
    );
  }
}
