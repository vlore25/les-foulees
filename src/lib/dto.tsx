import 'server-only'


export type PublicUserDTO = {
  id: string
  name: string | null
  lastname: string | null
  status: string 
}

export type AdminUserDTO = PublicUserDTO & {
  phone: string | null
  email: string | null
  role: string
}

export type UserDTO = PublicUserDTO | AdminUserDTO


export function toPublicDTO(user: any): PublicUserDTO {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    status: user.status,
  }
}

export function toAdminDTO(user: any): AdminUserDTO {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    status: user.status,
    phone: user.phone,
    email: user.email,
    role: user.role,
  }
}