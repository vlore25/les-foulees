import { prisma } from '../src/lib/prisma';
import { SignJWT } from 'jose';

async function testPasswordReset() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");

  const email = "test@example.com";
  console.log("1. Creating dummy user for test...");
  
  // Clean up if exists
  await prisma.user.deleteMany({ where: { email }});
  
  await prisma.user.create({
    data: {
      email,
      name: "Test",
      lastname: "User",
      password: "hashedpassword",
      address: "123 Test St",
      zipCode: "12345",
      city: "Testville",
    }
  });

  console.log("2. Generating token...");
  const secretKey = new TextEncoder().encode(secret);
  const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .sign(secretKey);

  console.log("Token:", token);

  const expires = new Date(new Date().getTime() + 3600 * 1000);
  
  console.log("3. Saving to DB...");
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  const savedToken = await prisma.passwordResetToken.findUnique({
    where: { token }
  });

  console.log("Saved Token in DB:", savedToken);

  console.log("4. Cleaning up...");
  await prisma.passwordResetToken.delete({ where: { token }});
  await prisma.user.delete({ where: { email }});
  
  console.log("Test OK!");
}

testPasswordReset().catch(console.error);
