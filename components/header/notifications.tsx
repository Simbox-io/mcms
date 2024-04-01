'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover"
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Notification } from "@/lib/prisma"
import { FaTrash } from "react-icons/fa"
import useSWR from "swr"

export default function Notifications() {
    const fetcher = async (url: string) => {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    };

    const { data: notificationsData, error, mutate } = useSWR('/api/notifications', fetcher);
    const notifications = notificationsData?.notifications?.filter((notification: Notification) => !notification.isRead) || [];
    const unreadCount = notificationsData?.notifications?.filter((notification: Notification) => !notification.isRead).length || 0;

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

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="relative rounded-full" size="icon" variant="ghost">
                    <BellIcon className="w-4 h-4" />
                    {notifications?.length > 0 && <Badge className="absolute -top-1 -right-1 text-xs h-4 w-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                        {notifications.length}
                    </Badge>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Card className="shadow-none border-0">
                    <CardHeader className="border-b p-3">
                        <CardTitle className="text-md">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {notifications?.map((notification: Notification) => (
                            <div key={notification.id} className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0">
                                {notification.isRead === false && <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-green-500" />}
                                <div className="flex flex-row gap-4 justify-between">
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium">{notification.content}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
                                    </div>
                                    <Button variant='ghost' className="px-4 py-0" onClick={() => markNotificationAsRead(notification.id)}>
                                        <FaTrash className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {notifications?.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>}
                    </CardContent>
                    {notifications?.length > 0 && <CardFooter className="border-t py-1">
                        <Button variant="ghost" className="py-0" onClick={() => handleClearNotifications()}>
                            Clear all
                        </Button>
                        {/*}Link
              className="w-full flex justify-center py-2 text-sm font-medium text-gray-900 dark:text-gray-50"
              href="#"
            >
              View All
          </Link>*/}
                    </CardFooter>}
                </Card>
            </PopoverContent>
        </Popover>
    )
}

function BellIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    )
}
