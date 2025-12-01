"use server"

import {SignJWT, jwtVerify} from 'jose' 
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key')


type SessionPayload = {
  userId: string
  expiresAt: Date
}
type Token = {
  token: String
}

const cookie = {
  name: 'lesFoulees',
  options: { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'lax' as const, 
    path: '/' 
  },
  duration: 24 * 60 * 60 * 1000,
}

export async function encrypt(payload: SessionPayload){
    return new SignJWT(payload)
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime("1 day")
      .sign(secretKey)
}

export async function decrypt(session: string | undefined = ''){
  try{
    const {payload} = await jwtVerify(session, secretKey, {
      algorithms: ['HS256']
    })
    return payload;
  }catch (error){
    return null;
  }
  
}

export async function createSession(userId: string){

  const expiresAt = new Date(Date.now() + cookie.duration)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()
  cookieStore.set(cookie.name, session, {...cookie.options, expires: expiresAt})

}


export async function verifySession(){

  const token = (await cookies()).get(cookie.name)?.value
  const session = await decrypt(token)

  if(!session?.userId){
    redirect('/login')
  }
  return { userId: session.userId }

}


export async function deleteSession() {

  const cookieStore = await cookies()
  cookieStore.delete(cookie.name)
}