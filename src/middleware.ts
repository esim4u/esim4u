import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const headersList = headers();
    const token = headersList.get("Authorization")?.split(" ")[1];
    if (token === process.env.NEXT_PUBLIC_ESIM4U_ACCESS_TOKEN) {
        return NextResponse.next();
    }
    return NextResponse.json({ message: "Who the fuck are you?!" }, {status: 401});
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/api/pay/tonconnect",
        "/api/pay/tonconnect/:path*",
    ],
};
