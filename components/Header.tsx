import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "./ui/navigation-menu"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "./ui/accordion"
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "./ui/sheet"
import { Menu } from 'lucide-react'
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import SearchBar from "./SearchBar"
import { cn, getProjects, getSpaces, getCourses, getFiles } from "@/lib/utils"
import Link from "next/link"
import { File, Project, Space, User, Course, Notification } from "@/lib/prisma"
import useSWR from 'swr';
import { SignInButton, SignedIn, SignedOut, UserButton, auth } from '@clerk/nextjs';
import Notifications from "./header/notifications";

async function getData() {
    const projects = await getProjects() as unknown as Project[]
    const spaces = await getSpaces() as unknown as Space[]
    const courses = await getCourses() as unknown as Course[]
    const files = await getFiles() as unknown as File[]
    const { userId } = auth();
    return { projects, spaces, courses, files, userId }
}


export default async function Header() {
    const { projects, spaces, courses, files, userId } = await getData();

    return (
        <header className="bg-white dark:bg-black border-zinc-200 dark:border-zinc-700 shadow z-10 w-full">
            <div className="max-w-8xl mx-auto px-2 lg:px-12">
                <div className="flex justify-between items-center h-16">
                    <div className='flex justify-between'>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 md:hidden mt-2 bg-zinc-200 dark:bg-zinc-800"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <nav className="grid gap-6 text-md font-medium">
                                    <Link href="/explore">Explore</Link>
                                    <Link href="/news">News</Link>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="projects">
                                            <AccordionTrigger>Projects</AccordionTrigger>
                                            <AccordionContent asChild>
                                                <Link href="/projects">All projects</Link>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link href={`/projects/${userId}`}>My projects</Link>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link href="/projects/create">Create project</Link>
                                            </AccordionContent>
                                            {projects?.length > 0 && projects?.map((project: Project) => (
                                                <AccordionContent key={project.id}>
                                                    <Link href={`/projects/${project.id}`}>
                                                        {project.description}
                                                    </Link>
                                                </AccordionContent>
                                            ))}

                                        </AccordionItem>
                                        <AccordionItem value="files">
                                            <AccordionTrigger>Files</AccordionTrigger>
                                            <AccordionContent>

                                                <Link href="/files">All files</Link>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link href={`/files/${userId}`}>My files</Link>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link href="/files/upload">Upload file</Link>
                                            </AccordionContent>
                                            {files?.length > 0 && files?.map((file: File) => (
                                                <AccordionContent key={file.id}>
                                                    <Link href={`/files/${file.id}`}>
                                                        {file.description}
                                                    </Link>
                                                </AccordionContent>
                                            ))}

                                        </AccordionItem>
                                        <AccordionItem value="spaces">
                                            <AccordionTrigger>Spaces</AccordionTrigger>
                                            <AccordionContent>
                                                <Link href="/spaces">All spaces</Link>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link href={`/spaces/${userId}`}>My spaces</Link>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link href="/spaces/create">Create space</Link>
                                            </AccordionContent>
                                            {spaces?.length > 0 && spaces?.map((space: Space) => (
                                                <AccordionContent key={space.id}>
                                                    <Link href={`/spaces/${space.id}`}>
                                                        {space.description}
                                                    </Link>
                                                </AccordionContent>
                                            ))}
                                        </AccordionItem>
                                        <AccordionItem value="courses">
                                            <AccordionTrigger>Courses</AccordionTrigger>
                                            <AccordionContent>
                                                <Link href="/courses">All courses</Link>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link href={`/courses/${userId}`}>My courses</Link>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link href="/courses/create">Create course</Link>
                                            </AccordionContent>

                                            {courses?.length > 0 && courses?.map((course: Course) => (
                                                <AccordionContent key={course.id}>
                                                    <Link href={`/courses/${course.id}`}>
                                                        {course.description}
                                                    </Link>
                                                </AccordionContent>
                                            ))}
                                        </AccordionItem>
                                    </Accordion>

                                </nav>
                            </SheetContent>
                        </Sheet>
                        <Link href="/">
                            <div className='flex items-center'>
                                <img src="/logo.png" alt="" className="h-14 w-14" />
                                <span className="hidden xl:block mx-1 mr-4 text-xl font-bold text-blue-600 dark:text-blue-400">MCMS</span>
                            </div>
                        </Link>
                        <NavigationMenu className="hidden md:block mt-2 text-sm">
                            <NavigationMenuList>
                                <NavigationMenuItem className="px-4 rounded-md py-2 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                    <Link href="/explore" legacyBehavior passHref>
                                        <NavigationMenuLink >
                                            Explore
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="px-4 rounded-md py-2 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                    <Link href="/news" legacyBehavior passHref>
                                        <NavigationMenuLink>
                                            News
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className={'w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] grid grid-cols-2'}>
                                            <ul className="grid gap-2">
                                                <ListItem title="All projects" href="/projects" />
                                                <ListItem title="My projects" href={`/projects/${userId}`} />
                                                <ListItem title="Create project" href="/projects/create" />
                                            </ul>
                                            {projects?.length > 0 ? (
                                                <ul className="grid gap-2 border-l border-zinc-300 dark:border-zinc-700">
                                                    <ScrollArea className="h-72 w-48 rounded-md border">
                                                        {projects?.map((project: Project) => (
                                                            <ListItem className="ml-4" key={project.name} href={`/projects/${project.id}`} title={project.name}>
                                                                {project.description}
                                                            </ListItem>
                                                        ))}
                                                    </ScrollArea>
                                                </ul>
                                            ) : (
                                                <ul className="grid gap-2 border-l border-zinc-300 dark:border-zinc-700">
                                                    <ListItem className="ml-4" title="No projects saved" />
                                                </ul>
                                            )}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Files</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className={'w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] grid grid-cols-2'}>
                                            <ul className="grid gap-2">
                                                <ListItem title="All files" href="/files" />
                                                <ListItem title="My files" href={`/files/${userId}`} />
                                                <ListItem title="Upload file" href="/files/upload" />
                                            </ul>
                                            {files?.length > 0 ? (
                                                <ul className="grid gap-2 border-l border-zinc-300 dark:border-zinc-700">
                                                    <ScrollArea className="h-72 w-48 rounded-md border">
                                                        {files?.map((file: File) => (
                                                            <ListItem className="ml-4" key={file.name} href={`/files/${file.id}`} title={file.name}>
                                                                {file.description}
                                                            </ListItem>
                                                        ))}
                                                    </ScrollArea>
                                                </ul>
                                            ) : (
                                                <ul className="grid gap-2 border-l border-zinc-300 dark:border-zinc-700">
                                                    <ListItem className="ml-4" title="No files saved" />
                                                </ul>
                                            )}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Spaces</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className={'w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] grid grid-cols-2'}>
                                            <ul className="grid gap-2">
                                                <ListItem title="All spaces" href="/spaces" />
                                                <ListItem title="My spaces" href={`/spaces/${userId}`} />
                                                <ListItem title="Create spaces" href="/spaces/create" />
                                            </ul>
                                            {spaces?.length > 0 ? (
                                                <ul className="grid gap-2 border-l border-zinc-300 dark:border-zinc-700">
                                                    <ScrollArea className="h-72 w-48 rounded-md border">
                                                        {spaces?.map((space: Space) => (
                                                            <ListItem className="ml-4" key={space.name} href={`/spaces/${space.id}`} title={space.name}>
                                                                {space.description}
                                                            </ListItem>
                                                        ))}
                                                    </ScrollArea>
                                                </ul>
                                            ) : (
                                                <ul className="grid gap-2 border-l border-zinc-300 dark:border-zinc-700">
                                                    <ListItem className="ml-4" title="No spaces saved" />
                                                </ul>
                                            )}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className={'w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] grid grid-cols-2'}>
                                            <ul className="grid gap-2">
                                                <ListItem title="All courses" href="/courses" />
                                                <ListItem title="My courses" href={`/courses/${userId}`} />
                                                <ListItem title="Create course" href="/courses/create" />
                                            </ul>
                                            {courses?.length > 0 ? (
                                                <ul className="grid gap-2 border-l border-zinc-300 dark:border-zinc-700">
                                                    <ScrollArea className="h-72 w-48 rounded-md border">
                                                        {courses?.map((course: Course) => (
                                                            <ListItem className="ml-4" key={course.id} href={`/courses/${course.id}`} title={course.title}>
                                                                {course.description}
                                                            </ListItem>
                                                        ))}
                                                    </ScrollArea>
                                                </ul>
                                            ) : (
                                                <ul className="grid gap-2 border-l border-zinc-300 dark:border-zinc-700">
                                                    <ListItem className="ml-4" title="No courses saved" />
                                                </ul>
                                            )}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className="flex items-center align-middle">
                        <div className="flex items-center mr-6">
                            <div className="hidden flex-grow lg:block md:w-48 xl:w-80">

                            </div>
                            <SignedIn>
                                <div className="relative flex justify-between items-center mx-4">
                                    <Notifications />
                                </div>
                            </SignedIn>
                            <UserButton />
                        </div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                    </div>
                </div>
            </div>
        </header>
    )
}


const ListItem = ({ className, title, children, href, ...props }: { className?: string, title: string, children?: React.ReactNode, href?: string }) => {
    return (
        <li>
            <NavigationMenuLink asChild href={href}>
                <a
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
}