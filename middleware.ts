import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
 
// 1. Specify protected and public routes
const protectedPaths = ['/dashboard', '/admin']
const publicPaths = ['/login', '/']
 
export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedPaths.some(prefix => path.startsWith(prefix))
  const isPublicRoute = publicPaths.includes(path)
 
  // 3. Decrypt the session from the cookie
  const cookie = req.cookies.get('lesFoulees')?.value
  const session = await decrypt(cookie)
 
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}