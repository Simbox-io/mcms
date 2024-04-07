import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import PostCard from "@/components/news/post-card"
import { getPosts } from "@/app/actions/actions"
import { Post } from "@/lib/prisma"
import { CreateButton } from "@/components/news/create-button"

export default async function Posts() {
  const posts = await getPosts();

  return (  
    <div className="container flex flex-col justify-between h-full text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900">
    <div className="grid lg:grid-cols-1 gap-6 px-4 py-2 md:px-6 lg:py-10 md:py-10">
      <h1 className="text-4xl font-bold">News</h1>
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Input className="flex-grow" placeholder="Filter..." type="search" />
          <Select>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
          <CreateButton />
        </div>
        <div className="grid lg:grid-cols-1 gap-6">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

