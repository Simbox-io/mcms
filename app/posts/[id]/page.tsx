'use client'
import { useState } from "react";
import { PostComments } from "@/components/news/post-comments"
import { Comment, Post } from "@/lib/prisma"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import useSWR from "swr"
import { Separator } from "@/components/ui/separator"
import { Interweave } from "interweave"

export default function ViewPost({ params }: { params: { id: string } }) {
    const fetcher = async (url: string) => {
        const res = await fetch(url);
        return res.json();
    };
    const { data: post, isLoading, mutate: mutatePost } = useSWR<Post>(`/api/posts/${params.id}`, fetcher, {
        keepPreviousData: true,
    });

    if (isLoading || !post) {
        return <div>Loading...</div>
    }

    return (
        <div className="container px-4 py-4 md:px-6 md:py-6 lg:py-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/news">News</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{post.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <article className="prose prose-zinc max-w-6xl mx-auto dark:prose-invert my-8 mb-12">
                <div className="space-y-2 not-prose mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                        {post.title}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Posted on {new Date(post.createdAt).toLocaleDateString()} by {post.author.username}</p>
                </div>
                <Interweave
                    content={post.content}
                    className="prose prose-zinc max-w-6xl mx-auto dark:prose-invert mt-4 mb-12"
                />
            </article>
            <Separator className="my-12" />
            <PostComments post={post} />
        </div>
    )
}
