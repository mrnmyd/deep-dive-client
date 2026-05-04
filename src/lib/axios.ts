import { ENDPOINT } from "@/constants/api.constant"
import { useAuthStore } from "@/stores/auth.store"
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios"
import { queryClient } from "./query-client"
import { ROUTES } from "@/constants/routes.constant"

declare module "axios" {
    interface AxiosRequestConfig {
        _retry?: boolean
        skipAuthRefresh?: boolean
    }
}

type QueueItem = {
    resolve: (value: unknown) => void
    reject: (error: unknown) => void
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const DEFAULT_TIMEOUT_MS = 15_000

if (!BASE_URL) {
    throw new Error("Missing VITE_API_BASE_URL environment variable.")
}

type RetryableRequestConfig = AxiosRequestConfig

type AuthFailureHandler = (error: unknown) => void | Promise<void>

export const publicApi: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: DEFAULT_TIMEOUT_MS,
    headers: {
        "Content-Type": "application/json",
    }
})

export const authApi: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: DEFAULT_TIMEOUT_MS,
    headers: {
        "Content-Type": "application/json",
    }
})

let refreshing = false
let queue: QueueItem[] = []

let onAuthFailure: AuthFailureHandler = () => {
    const { setUnauthenticated } = useAuthStore.getState()
    setUnauthenticated()
    queryClient.clear()
    window.location.href = ROUTES.AUTH.LOGIN
}

export function setAuthFailureHandler(handler: AuthFailureHandler) {
    onAuthFailure = handler
}

function processQueue(error?: unknown) {
    queue.forEach(({ resolve, reject }) => {
        if (error) reject(error)
        else resolve(undefined)
    })
    queue = []
}

async function refreshAccessToken() {
    await publicApi.post(ENDPOINT.AUTH.REFRESH, undefined, { skipAuthRefresh: true })
}

function shouldAttemptRefresh(error: AxiosError, original: RetryableRequestConfig) {
    return (
        error.response?.status === 401 &&
        !original._retry &&
        !original.skipAuthRefresh &&
        original.url !== ENDPOINT.AUTH.REFRESH
    )
}

authApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as RetryableRequestConfig | undefined

        if (!original || !shouldAttemptRefresh(error, original)) {
            return Promise.reject(error)
        }

        original._retry = true

        if (refreshing) {
            return new Promise((resolve, reject) => {
                queue.push({ resolve, reject })
            }).then(() => authApi(original))
        }

        refreshing = true

        try {
            await refreshAccessToken()
            processQueue()
            return authApi(original)
        } catch (refreshError) {
            processQueue(refreshError)
            await onAuthFailure(refreshError)
            return Promise.reject(refreshError)
        } finally {
            refreshing = false
        }
    }
)
