import 'server-only'

export type PublicUserDTO = {

  id: string
  name: string | null
  lastname: string | null
  phone: string | null
  email: string | null

}

export type AdminUserDTO = PublicUserDTO & {

  birthdate: string
  status: string
  role: string
  createdAt: string
  address: String
  zipCode: String
  city: String
  emergencyName: String
  emergencyLastName: String
  emergencyPhone: String
  showPhoneDirectory: boolean
  showEmailDirectory: boolean

}

export type UserDTO = PublicUserDTO | AdminUserDTO

export function toPublicDTO(user: any): PublicUserDTO {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    phone: user.showPhoneDirectory ? user.phone : null,
    email: user.showPhoneDirectory ? user.email : null,
  }
}

export function toAdminDTO(user: any): AdminUserDTO {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    birthdate: user.birthdate,
    phone: user.phone,
    email: user.email,
    address: user.adress,
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