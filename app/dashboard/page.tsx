import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import React from 'react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { User, Space, Course, File, Activity, Project, Notification } from '@/lib/prisma';
import { getProjects, getNotifications, getActivitiesByUser, getUser } from "@/lib/utils";

export default async function UserDashboard() {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const [projectsResponse, notificationsResponse, activitiesResponse, userData] = await Promise.all([
        await getProjects(),
        await getNotifications(user.id),
        await getActivitiesByUser(user.id),
        await getUser(user.username || "")
    ]);

    (projectsResponse);

    const projects = projectsResponse as unknown as Project[];
    const notifications = notificationsResponse as unknown as Notification[];
    const activities = activitiesResponse as unknown as Activity[];

    const itemsPerPage = 10;
    const totalPages = Math.ceil(projects?.length / itemsPerPage);
    const currentPage = 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageProjects = projects?.slice(startIndex, endIndex);

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <header className="p-4 sm:p-8">
                <h1 className="text-2xl sm:text-4xl font-bold">Welcome, {userData?.firstName || userData?.username}!</h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-8">
                <div>
                    <div className="bg-[#1E1E1E] p-4 rounded-md">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">Projects</h2>
                        <ul className="space-y-2">
                            {currentPageProjects?.map((project) => (
                                <li key={project.id}>{project.name}</li>
                            ))}
                        </ul>
                        <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">Create Project</Button>
                    </div>
                    <div className="bg-[#1E1E1E] p-4 rounded-md mt-8">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage alt={userData?.username || ''} src={userData?.avatar || ''} />
                                <AvatarFallback>{userData?.username?.charAt(0) || ''}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">{((userData?.firstName || "") + " " + (userData?.lastName || "")) || userData?.username}</h3>
                                <p>{userData?.email}</p>
                            </div>
                        </div>
                        <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">Edit Profile</Button>
                    </div>
                </div>
                <div className="bg-[#1E1E1E] p-4 rounded-md mt-8 md:mt-0">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Notifications</h2>
                    <div className="space-y-4">
                        {notifications?.map((notification) => (
                            <div key={notification.id}>
                                <p className="text-sm text-zinc-400">{notification.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#1E1E1E] p-4 rounded-md mt-8 md:mt-0">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">Activity</h2>
                        <div className="space-y-4">
                            {activities?.map((activity) => (
                                <div key={activity.id}>
                                    <p>{activity.activityType}</p>
                                    <p className="text-sm text-zinc-400">{activity.metadata}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#1E1E1E] p-4 rounded-md col-span-3 mt-8">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">Resources</h2>
                        <ul className="space-y-2">
                            <li>Documentation</li>
                            <li>Support</li>
                            <li>Settings</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}