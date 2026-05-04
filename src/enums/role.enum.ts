export const RoleEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
} as const;

export type RoleEnum = keyof typeof RoleEnum;