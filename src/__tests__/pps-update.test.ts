import { updatePPSCertificateAction } from '../features/membership/memberships.actions';
import { prisma } from '../lib/prisma';
import { getSession } from '../lib/session';
import { getProfile } from '../features/account/dal';
import { getActiveSeasonData } from '../features/season/dal';
import { saveUploadedFile, deleteUploadedFile } from '../lib/file-storage';

jest.mock('../lib/prisma', () => ({
  prisma: {
    membership: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../lib/session', () => ({
  getSession: jest.fn(),
}));

jest.mock('../features/account/dal', () => ({
  getProfile: jest.fn(),
}));

jest.mock('../features/season/dal', () => ({
  getActiveSeasonData: jest.fn(),
}));

jest.mock('../lib/file-storage', () => ({
  saveUploadedFile: jest.fn(),
  deleteUploadedFile: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('updatePPSCertificateAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update the PPS certificate and reset status to PENDING', async () => {
    // 1. Mock session & user profile
    (getSession as jest.Mock).mockResolvedValue({ userId: 'user-123' });
    (getProfile as jest.Mock).mockResolvedValue({ id: 'user-123', lastname: 'Dupont' });

    // 2. Mock active season
    (getActiveSeasonData as jest.Mock).mockResolvedValue({ id: 'season-456', name: '2026-2027' });

    // 3. Mock existing membership
    (prisma.membership.findUnique as jest.Mock).mockResolvedValue({
      id: 'membership-789',
      userId: 'user-123',
      seasonId: 'season-456',
      certificateUrl: 'old-cert-url.pdf',
    });

    // 4. Mock file upload
    (saveUploadedFile as jest.Mock).mockResolvedValue('new-cert-url.pdf');

    const formData = new FormData();
    const fakeFile = new File(['hello'], 'certif.pdf', { type: 'application/pdf' });
    formData.append('medicalCertificate', fakeFile);

    const result = await updatePPSCertificateAction(null, formData);

    expect(result?.success).toBe(true);
    expect(saveUploadedFile).toHaveBeenCalledWith(
      fakeFile,
      'uploads/docs/certificates',
      'certif_Dupont_user-123'
    );
    expect(prisma.membership.update).toHaveBeenCalledWith({
      where: { id: 'membership-789' },
      data: {
        certificateUrl: 'new-cert-url.pdf',
        status: 'PENDING',
      },
    });
    expect(deleteUploadedFile).toHaveBeenCalledWith('old-cert-url.pdf');
  });

  it('should return error if no file is provided', async () => {
    (getSession as jest.Mock).mockResolvedValue({ userId: 'user-123' });
    (getProfile as jest.Mock).mockResolvedValue({ id: 'user-123', lastname: 'Dupont' });

    const formData = new FormData();

    const result = await updatePPSCertificateAction(null, formData);

    expect(result?.message).toBe('Aucun fichier fourni.');
    expect(result?.errors?.medicalCertificate).toBeDefined();
  });
});
