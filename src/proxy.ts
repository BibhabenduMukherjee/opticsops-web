import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('oo_session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('oo_session');
    return response;
  }
}

export const config = {
  matcher: ['/portal/:path*'],
};
