import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/explore", "/api", "/api/posts", "/api/projects", "/api/files", "/api/spaces", "/api/pages", "/api/lms/courses", "/monitoring"],
  afterAuth(auth, req, evt) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};