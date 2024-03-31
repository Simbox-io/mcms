'use client'
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Comment, Post } from "@/lib/prisma"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useUser } from "@clerk/nextjs"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Toggle } from "../ui/toggle"

const FormSchema = z.object({
  comment: z
    .string()
    .min(10, {
      message: "Comment must be at least 10 characters.",
    })
    .max(160, {
      message: "Comment must not be longer than 30 characters.",
    }),
})

interface PostCommentsProps {
  post: Post | null;
}

export const PostComments: React.FC<PostCommentsProps> = ({ post }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const { user } = useUser();
  const username = user?.username || '';

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({ content: data.comment, postId: post?.id }),
    })
    const json = await res.json()
    if (json.error) {
      toast({
        title: "Error",
        description: json.error
      })
    }
  }

  const toggleLike = async (comment: Comment) => {
    const response = await fetch(`/api/comments/${comment.id}/upvote`, {
      method: 'POST',
    })
    const json = await response.json()
    if (json.error) {
      toast({
        title: "Error",
        description: json.error
      })
    }
  }

  const reportComment = async (commentId: string) => {
    const response = await fetch(`/api/comments/${commentId}/report`, {
      method: 'POST',
    })
  }

  return (
    <div className="grid gap-6">
      {post?.comments.length === 0 ? (
        <div className="text-sm flex items-start gap-4">
          <div className="font-semibold">No comments yet</div>
        </div>
      ) : (
      post?.comments.map((comment) => (
        <div key={comment.id} className="text-sm flex items-start gap-4 border border-zinc-200 dark:border-zinc-700 rounded-md p-4">
          <Avatar className="w-10 h-10 border">
            <AvatarImage alt={`@${comment.author?.username}`} src={comment.author?.avatar || ''} />
            <AvatarFallback>{comment.author?.username.slice(0, 1) || ''}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2">
              <div className="font-semibold">@{comment.author?.username}</div>
              <div className="text-zinc-500 text-xs dark:text-zinc-400">{new Date(comment.createdAt).toLocaleDateString()}</div>
            </div>
            <div>{comment.content}</div>
            <div className="flex items-center gap-2">
              <Toggle size='sm' pressed={comment.likedBy?.map(user => user.username).includes(username)} onClick={() => toggleLike(comment)}>
                <ArrowUpIcon className="h-4 w-4" />
              </Toggle>
              {/*<Button size="icon" variant="ghost" onClick={() => reportComment(comment.id)}>
              <FlagIcon className="h-4 w-4" />
            </Button>*/}
            </div>
          </div>
        </div>
      )))}
      <Separator className="my-4" />
      <div className="grid w-full gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a comment..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can <span>@mention</span> other users and organizations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

function ArrowUpIcon(props: any) {
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
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  )
}


function ArrowDownIcon(props: any) {
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
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  )
}


function FlagIcon(props: any) {
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
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}
