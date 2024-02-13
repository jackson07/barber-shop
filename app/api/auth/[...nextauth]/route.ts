import { authOption } from "@/app/_lib/auth";
import NextAuth from "next-auth"

const handler = NextAuth(authOption);

export { handler as GET, handler as POST }