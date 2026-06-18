import { SignJWT, jwtVerify } from 'jose' 

export const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET manquant");
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload){
    return new SignJWT(payload)
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime("1 day")
      .sign(getSecretKey())
}

export async function decrypt(session: string | undefined = ''){
  try{
    const {payload} = await jwtVerify(session, getSecretKey(), {
      algorithms: ['HS256']
    })
    return payload;
  }catch (error){
    return null;
  }
}
