export const USER_ROLE = {
    Admin: "Admin",
    Customer: "Customer"
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];