export { default } from "next-auth/middleware"

export const config = {matcher: ['/UserPost', '/dashboard', '/play', '/profile', '/profile/:path*']}