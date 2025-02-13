export {}

// Create a type for the roles
export type Roles = 'booking_admin' | 'user'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}