'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Post } from "@/lib/prisma"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PostCard({ post }: { post: Post }) {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/news/${post.id}`)
    }

    return (
        <Card onClick={handleClick}>
            <CardHeader>
                <CardTitle className="text-2xl font-extrabold tracking-tight lg:text-3xl lg:leading-[3.5rem]">
                    {post.title}
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400">
                    Posted on {new Date(post.createdAt).toLocaleDateString()} by {post.author.username}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    <span dangerouslySetInnerHTML={{ __html: post.content.slice(0, 100) }} />
                </p>
                {post.content.length > 100 && (
                    <Link className="text-blue-500 underline" href={`/news/${post.id}`}>
                        <a>Read more</a>
                    </Link>
                )}
            </CardContent>
        </Card>
    )
}

