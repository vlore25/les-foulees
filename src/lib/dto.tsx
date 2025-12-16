import 'server-only'

export type PublicUserDTO = {
  id: string
  name: string | null
  lastname: string | null
  status: string
  showPhoneDirectory: boolean
  phone: string | null
  email: string | null
}

export type AdminUserDTO = PublicUserDTO & {
  role: string
  birthdate: string
}

export type UserDTO = PublicUserDTO | AdminUserDTO

export function toPublicDTO(user: any): PublicUserDTO {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    
    status: user.status,
    showPhoneDirectory: user.showPhoneDirectory,
    phone: user.showPhoneDirectory ? user.phone : null,
    email: user.showPhoneDirectory ? user.email : null,
  }
}

export function toAdminDTO(user: any): AdminUserDTO {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    birthdate: user.birthday,
    status: user.status,
    showPhoneDirectory: user.showPhoneDirectory,
    role: user.role,
    phone: user.phone, 
    email: user.email, 
  }
}