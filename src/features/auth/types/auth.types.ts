import type { RoleEnum } from "@/enums/role.enum"

export type Role = {
    id: number
    name: RoleEnum
}

export type User = {
    id: number
    name: string
    email: string
    mobile: string
    roles: Role[]
    isEnabled: boolean
}