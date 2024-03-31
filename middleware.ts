import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/explore", "/api", "/api/posts", "/api/projects", "/api/files", "/api/spaces", "/api/pages", "/api/lms/courses", "/monitoring"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
