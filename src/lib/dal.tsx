import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt, getSession } from '@/src/lib/session'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export type UserListEntry = {
  name: string;
  lastname: string;
};


export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('lesFoulees')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    redirect('/login')
  }
 
  return { isAuth: true, userId: session.userId }
})


