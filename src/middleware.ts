import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (!req.auth && !pathname.startsWith("/login")) {
    const url = new URL("/login", req.url)
    return NextResponse.redirect(url)
  }

  if (req.auth && pathname.startsWith("/login")) {
    const url = new URL("/dashboard", req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}