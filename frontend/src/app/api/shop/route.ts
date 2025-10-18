import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/shop-api';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const cookie = req.headers.get('cookie') || '';
  const res = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    body,
  });

  // Stream through the backend response including headers and status
  const resBody = await res.text();
  const headers = new Headers(res.headers);
  if (!headers.has('content-type')) headers.set('content-type', 'application/json');
  return new Response(resBody, { status: res.status, headers });
}


