import { sendInviteAction } from '../features/users/user.action';
import { registerUser } from '../features/auth/auth.actions';
import { prisma } from '../lib/prisma';
import { SignJWT } from 'jose';

jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    invitation: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(async (cb) => cb(prisma)),
  },
}));

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'test-id' }),
    },
  })),
}));

jest.mock('@react-email/render', () => ({
  render: jest.fn().mockResolvedValue('<html>Email HTML</html>'),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mocked-token'),
  })),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('../lib/session', () => ({
  getSession: jest.fn().mockResolvedValue({ userId: 'admin-id' }),
  createSession: jest.fn(),
}));

jest.mock('../features/account/dal', () => ({
  getProfile: jest.fn().mockResolvedValue({ role: 'ADMIN' }),
}));

describe('Invitation and Registration flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendInviteAction', () => {
    it('should successfully invite a new user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.invitation.upsert as jest.Mock).mockResolvedValue({});

      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const response = await sendInviteAction({ message: null, success: false }, formData);

      expect(response.success).toBe(true);
      expect(prisma.invitation.upsert).toHaveBeenCalled();
    });

    it('should return error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing-id' });

      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const response = await sendInviteAction({ message: null, success: false }, formData);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Un compte est déjà associé à cette adresse e-mail.');
    });
  });

  describe('registerUser', () => {
    it('should successfully register a user with a valid token', async () => {
      (prisma.invitation.findUnique as jest.Mock).mockResolvedValue({ email: 'test@example.com', token: 'valid-token' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const formData = new FormData();
      formData.append('token', 'valid-token');
      formData.append('name', 'John');
      formData.append('lastname', 'Doe');
      formData.append('genre', 'MALE');
      formData.append('phone', '0123456789');
      formData.append('birthdate', '1990-01-01');
      formData.append('address', '1 rue de la Paix');
      formData.append('zip-code', '75000');
      formData.append('city', 'Paris');
      formData.append('emergencyName', 'Jane');
      formData.append('emergencyLastName', 'Doe');
      formData.append('emergencyPhone', '0987654321');
      formData.append('password', 'Password123!');
      formData.append('confirmPassword', 'Password123!');
      formData.append('terms-conditions', 'on');
      formData.append('profileImage', new File([], 'test.jpg', { type: 'image/jpeg' }));

      const response = await registerUser(undefined, formData);

      if (!response?.success) {
        console.log(JSON.stringify(response, null, 2));
      }
      expect(response?.success).toBe(true);
      expect(response?.message).toBe('Inscription réussie !');
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.invitation.delete).toHaveBeenCalled();
    });

    it('should fail if token is missing', async () => {
      const formData = new FormData();
      const response = await registerUser(undefined, formData);

      expect(response?.success).toBeUndefined();
      expect(response?.message).toBe("Token d'invitation manquant ou invalide.");
    });

    it('should fail if token is invalid or expired', async () => {
      // Simulate token not found in database
      (prisma.invitation.findUnique as jest.Mock).mockResolvedValue(null);

      const formData = new FormData();
      formData.append('token', 'expired-or-invalid-token');

      const response = await registerUser(undefined, formData);

      expect(response?.success).toBeUndefined();
      expect(response?.message).toBe("Cette invitation est invalide ou a expiré.");
    });
  });
});
