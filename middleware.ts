import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/explore", "/projects", "/files", "/learn", "/news", "/spaces", "/api", "/api/posts", "/api/projects", "/api/files", "/api/spaces", "/api/pages", "/api/lms/courses", "/monitoring"],
  ignoredRoutes: ["/api/user"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
