export { default } from "next-auth/middleware"

export const config = {matcher: ['/dashboard', '/play', '/profile', '/profile/:path*']}