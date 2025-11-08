import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // 如果用户未登录且不在登录页面，重定向到登录页
  if (!req.auth && !pathname.startsWith("/login")) {
    const url = new URL("/login", req.url)
    return NextResponse.redirect(url)
  }
  
  // 如果用户已登录且在登录页面，重定向到仪表板
  if (req.auth && pathname.startsWith("/login")) {
    const url = new URL("/dashboard", req.url)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}