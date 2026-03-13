import { User } from '@/prisma/generated/client';
import 'server-only'

type RawUserFromList = Pick<User, 
  'id' | 'name' | 'lastname' | 'phone' | 'email' | 
  'showPhoneDirectory' | 'showEmailDirectory' | 'role' | 'status' | 'createdAt'
>;

export type PublicUserDTO = Pick<User, 'id' | 'name' | 'lastname'> & {
}

export type AdminUserDTO = Omit<User, 'password' | 'updatedAt' | 'createdAt'> & {
  createdAt: string;
};

export type CurrentUser = Pick<User, 'id' | 'email' | 'role' | 'name' | 'lastname'>


export type UserDTO = PublicUserDTO | AdminUserDTO


export function toPublicListDTO(user: RawUserFromList): PublicUserDTO {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
  }
}

export function toAdminDTO(user: User): AdminUserDTO {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    birthdate: user.birthdate,
    phone: user.phone,
    email: user.email,
    address: user.address,
    zipCode: user.zipCode,
    city: user.city,
    status: user.status,
    showPhoneDirectory: user.showPhoneDirectory,
    showEmailDirectory: user.showEmailDirectory,
    emergencyName: user.emergencyName,
    emergencyLastName: user.emergencyLastName,
    emergencyPhone: user.emergencyPhone,
    role: user.role,
    createdAt: user.createdAt.toISOString()
  }
}