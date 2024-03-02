import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/users")) 
        return token?.role === "admin";

      return !!token;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
});

export const config = {
  matcher: ["/users"]
};
