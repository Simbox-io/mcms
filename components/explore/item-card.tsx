'use client'
import { useState } from "react";
import {
    CardTitle,
    CardHeader,
    CardContent,
    CardFooter,
    Card
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent
} from "../ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Interweave } from 'interweave';
import { CalendarDays } from "lucide-react";
import { FaConfluence, FaFileAlt, FaJira, FaPollH, FaUserAlt } from 'react-icons/fa';
import { User } from "@/lib/prisma";
import { useRouter } from "next/navigation";
import { Toggle } from "../ui/toggle";
import { Separator } from "../ui/separator";

export default function ItemCard({
    title,
    type,
    description,
    creationDate,
    author,
    initialIsBookmarked
}: {
    title: string;
    type: string;
    description: string;
    creationDate: string;
    author: User;
    initialIsBookmarked: boolean;
}) {
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked || false);
    const router = useRouter();

    const handleBookmarkClick = () => {
        setIsBookmarked(!isBookmarked);
        // Add your logic to handle bookmark action here
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex flex-row justify-between items-start">
                    {title}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                {type === "post" && <FaPollH />}
                                {type === "project" && <FaJira />}
                                {type === "file" && <FaFileAlt />}
                                {type === "space" && <FaConfluence />}
                            </TooltipTrigger>
                            <TooltipContent side="bottom" collisionPadding={2}>
                                {type === "post" && "Post"}
                                {type === "project" && "Project"}
                                {type === "file" && "File"}
                                {type === "space" && "Space"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                <Interweave content={description} />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Created on: {creationDate} by </span>
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <span onClick={() => router.push(`/users/${author?.username}`)}><u>{author?.username}</u></span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex align-middle space-x-4">
                                <Avatar>
                                    <AvatarImage src={author?.avatar || undefined} />
                                    <AvatarFallback><FaUserAlt /></AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">{author?.username}</h4>
                                    <p className="text-md">{author?.firstName} {author?.lastName}</p>
                                    <p className="text-sm">
                                        <Interweave content={author?.bio || ''} />
                                    </p>
                                    <Separator />
                                    <div className="flex items-center">
                                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                        <span className="text-xs text-muted-foreground">
                                            Joined {new Date(author?.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Toggle variant="outline" defaultPressed={isBookmarked} onPressedChange={handleBookmarkClick}>
                                <BookmarkIcon className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" collisionPadding={2}>
                            <p>Add to bookmarks</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardFooter>
        </Card>
    )
}

function BookmarkIcon(props: any) {
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
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
    )
}