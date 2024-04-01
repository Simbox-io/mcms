'use client'
import React, { useEffect, useState, useRef } from "react"
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
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { File, Project, Space, User, Course, Notification } from "@/lib/prisma"
import useSWR from 'swr';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [courses, setcourses] = useState([]);
    const [files, setFiles] = useState([]);
    const menuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user } = useUser();

    const fetcher = async (url: string) => {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    };

    const { data: notificationsData, error, mutate } = useSWR('/api/notifications', fetcher);
    const notifications = notificationsData?.notifications?.filter((notification: Notification) => !notification.isRead) || [];
    const unreadCount = notificationsData?.notifications?.filter((notification: Notification) => !notification.isRead).length || 0;

    useEffect(() => {
        fetch('/api/projects').then(async res => setProjects(await res.json()));
        fetch('/api/spaces').then(async res => setSpaces(await res.json()));
        fetch('/api/lms/courses').then(async res => setcourses(await res.json()));
        fetch('/api/files').then(async res => setFiles(await res.json()));
    }, []);

    const markNotificationAsRead = async (notificationId: string) => {
        try {
            mutate(
                (prevData: any) => ({
                    ...prevData,
                    notifications: prevData.notifications.map((notification: Notification) =>
                        notification.id === notificationId ? { ...notification, isRead: true } : notification
                    ),
                }),
                false
            );
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isRead: true }),
            });
            mutate();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleClearNotifications = async () => {
        try {
            if (!notifications || notifications.length === 0) return;
            mutate(
                (prevData: any) => ({
                    ...prevData,
                    notifications: prevData.notifications.map((notification: Notification) =>
                        notifications.some((notification: Notification) => notification.id === notification.id)
                            ? { ...notification, isRead: true }
                            : notification
                    ),
                }),
                false
            );
            for (const notification of notifications) {
                await fetch(`/api/notifications/${notification.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ isRead: true }),
                });
            }
            mutate();
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const handleSearch = async (query: string) => {
    if (query.trim() !== '') {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }
};

    const handleToggle = (
        isOpen: boolean,
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node) &&
            isMenuOpen
        ) {
            setIsMenuOpen(false);
        }
        if (
            searchRef.current &&
            !searchRef.current.contains(event.target as Node) &&
            isSearchOpen
        ) {
            setIsSearchOpen(false);
        }
        if (
            notificationsRef.current &&
            !notificationsRef.current.contains(event.target as Node) &&
            isNotificationsOpen
        ) {
            setIsNotificationsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleClickOutside);
        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
        };
    });

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
                                <nav className="grid gap-6 text-lg font-medium">
                                    <Link href="/explore">Explore</Link>
                                    <Link href="/news">News</Link>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="projects">
                                            <AccordionTrigger>Projects</AccordionTrigger>
                                            <AccordionContent asChild>
                                                <span className="text-lg" onClick={() => router.push('/projects')}>
                                                    All projects
                                                </span>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push(`/projects/${user?.username}`)}>
                                                    My projects
                                                </span>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push('/projects/create')}>
                                                    Create project
                                                </span>
                                            </AccordionContent>
                                            {projects.length > 0 && projects?.map((project: Project) => (
                                                <AccordionContent key={project.id}>
                                                    <span className="ml-4 text-lg" key={project.name} onClick={() => router.push(`/projects/${project.id}`)}>
                                                        {project.description}
                                                    </span>
                                                </AccordionContent>
                                            ))}

                                        </AccordionItem>
                                        <AccordionItem value="files">
                                            <AccordionTrigger>Files</AccordionTrigger>
                                            <AccordionContent>

                                                <span className="text-lg" onClick={() => router.push('/files')}>
                                                    All files
                                                </span>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push(`/files/${user?.username}`)}>
                                                    My files
                                                </span>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push('/files/upload')}>
                                                    Upload file
                                                </span>
                                            </AccordionContent>
                                            {files.length > 0 && files?.map((file: File) => (
                                                <AccordionContent key={file.id}>
                                                    <span className="ml-4 text-lg" key={file.name} onClick={() => router.push(`/files/${file.id}`)}>
                                                        {file.description}
                                                    </span>
                                                </AccordionContent>
                                            ))}

                                        </AccordionItem>
                                        <AccordionItem value="spaces">
                                            <AccordionTrigger>Spaces</AccordionTrigger>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push('/spaces')}>
                                                    All spaces
                                                </span>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push(`/spaces/${user?.username}`)}>
                                                    My spaces
                                                </span>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push('/spaces/create')}>
                                                    Create space
                                                </span>
                                            </AccordionContent>
                                            {spaces.length > 0 && spaces?.map((space: Space) => (
                                                <AccordionContent key={space.id}>
                                                    <span className="ml-4 text-lg" key={space.name} onClick={() => router.push(`/spaces/${space.id}`)}>
                                                        {space.description}
                                                    </span>
                                                </AccordionContent>
                                            ))}
                                        </AccordionItem>
                                        <AccordionItem value="courses">
                                            <AccordionTrigger>Courses</AccordionTrigger>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push('/courses')}>
                                                    All courses
                                                </span>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push(`/courses/${user?.username}`)}>
                                                    My courses
                                                </span>
                                            </AccordionContent>
                                            <AccordionContent>
                                                <span className="text-lg" onClick={() => router.push('/courses/create')}>
                                                    Create course
                                                </span>
                                            </AccordionContent>

                                            {courses.length > 0 && courses?.map((course: Course) => (
                                                <AccordionContent key={course.id}>
                                                    <span className="ml-4 text-lg" key={course.id} onClick={() => router.push(`/courses/${course.id}`)}>
                                                        {course.description}
                                                    </span>
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
                        <NavigationMenu className="hidden md:block mt-2">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <Link href="/explore" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Explore
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/news" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
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
                                                <ListItem title="My projects" href={`/projects/${user?.username}`} />
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
                                                <ListItem title="My files" href={`/files/${user?.username}`} />
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
                                                <ListItem title="My spaces" href={`/spaces/${user?.username}`} />
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
                                                <ListItem title="My courses" href={`/courses/${user?.username}`} />
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
                            <button
                                className="lg:hidden text-zinc-500 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-500 focus:outline-none ml-2"
                                onClick={() => handleToggle(isSearchOpen, setIsSearchOpen)}
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                            <div className="hidden flex-grow lg:block md:w-48 xl:w-80">
                                <SearchBar onSearch={handleSearch} />
                            </div>
                            <SignedIn>
                                <div className="relative flex justify-between items-center md:ml-4">
                                    <button
                                        className="relative z-10 mx-3 text-zinc-500 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-500 px-0 py-2 rounded-md text-sm font-medium flex items-left"
                                        onClick={() => handleToggle(isNotificationsOpen, setIsNotificationsOpen)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                            />
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span className="absolute top-2 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {isNotificationsOpen && (
                                        <div
                                            ref={notificationsRef}
                                            className="origin-top-right ml-24 absolute right-0 top-full w-80 rounded-md shadow-xl bg-white dark:bg-zinc-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        >
                                            <div className="py-1">
                                                {(!notifications || notifications.length === 0) && (
                                                    <div className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200">
                                                        No notifications
                                                    </div>
                                            
                                                )}
                                                {notifications.length > 1 && (
                                                    <Button
                                                        variant="outline"
                                                        size='sm'
                                                        onClick={() => handleClearNotifications()}
                                                        className="flex justify-end w-full px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 hover:dark:bg-zinc-600 dark:focus:ring-0"
                                                    >
                                                        Mark all as read
                                                    </Button>
                                                )}
                                                <div className="overflow-y-auto max-h-96">
                                                    {notifications.map((notification: Notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className={`z-1 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 ${!notification.isRead && !notification.isHidden
                                                                ? 'bg-blue-50 dark:bg-blue-900'
                                                                : ''
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <span>{notification.message}</span>
                                                                <button
                                                                    className="ml-2 focus:outline-none"
                                                                    onClick={() => markNotificationAsRead(notification.id)}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            {notification.link && (
                                                                <Link href={notification.link}>
                                                                    <span className="block mt-1 text-xs text-blue-600 dark:text-blue-400">
                                                                        View
                                                                    </span>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </SignedIn>
                            <UserButton />
                        </div>
                        <SignedOut>
                            <SignInButton/>
                        </SignedOut>
                    </div>
                </div>
            </div>
             {isSearchOpen && (
    <div ref={searchRef} className="px-4 py-2 md:hidden">
        <SearchBar onSearch={handleSearch} />
    </div>
)}
        </header>
    )
    }
 

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
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
})
ListItem.displayName = "ListItem"
