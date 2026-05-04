import { ENDPOINT } from "@/constants/api.constant"
import { authApi, publicApi } from "@/lib/axios"
import type { User } from "../types/auth.types"

export async function login(payload: unknown): Promise<User> {
    const response = await publicApi.post(ENDPOINT.AUTH.LOGIN, payload)
    return response.data
}

export async function logout() {
    const response = await publicApi.post(ENDPOINT.AUTH.LOGOUT)
    return response.data
}

export async function getUser(): Promise<User> {
    const response = await authApi.post(ENDPOINT.AUTH.ME)
    return response.data
}