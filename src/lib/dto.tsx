import { User } from '@/prisma/generated/client';
import 'server-only'

export type BaseUser = Pick<User, 'id' | 'email' | 'role' | 'name' | 'lastname'>

type RawAdminInput = Omit<User, 'password' | 'updatedAt'>;

//-----------PUBLIC---------------------

type RawPublicUser = Pick<User,
  'id' | 'name' | 'lastname' | 'phone' | 'email' | 'status' |
  'showPhoneDirectory' | 'showEmailDirectory' | 'createdAt'
>;

export type PublicUserList = Pick<User, 'id' | 'name' | 'lastname' | 'status' >

export type PublicUserDetails = PublicUserList & {
  phone: string | null;
  email: string | null;
  createdAt: string;
  status: string;
}

//-----------ADMIN---------------------

type RawAdminList = Pick<User, 'id' | 'name' | 'lastname' | 'status' | 'createdAt'>;

export type AdminUserList = PublicUserList & {
  createdAt: string;
}

export type AdminUserDetails = Omit<User, 'password' | 'updatedAt' | 'createdAt'> & {
  createdAt: string;
};

type RawUserDetails = Pick<User, 
  'id' | 'name' | 'lastname' | 'phone' | 'email' |'status' |
  'showPhoneDirectory' | 'showEmailDirectory' | 'createdAt'
>;


//-----------PUBLIC---------------------

export async function publicUserDetails(user: RawUserDetails): Promise<PublicUserDetails> {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    status: user.status,
    phone: user.showPhoneDirectory ? user.phone : null,
    email: user.showEmailDirectory ? user.email : null,
    createdAt: user.createdAt.toLocaleString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric'})
  }
}

export function toPublicList(user: RawPublicUser): PublicUserList {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    status: user.status
  }
}

//-----------ADMIN---------------------

export function toAdminList(user: RawAdminList): AdminUserList {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    status: user.status,
    createdAt: user.createdAt.toLocaleString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric'})
  }
}


export function admindUserDetails(user: RawAdminInput): AdminUserDetails {
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
    createdAt: user.createdAt.toLocaleString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric'})
  }
}