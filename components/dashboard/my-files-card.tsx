import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"

export function MyFilesCard() {
  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      <CardHeader>
        <CardTitle>My Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          <Card className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center gap-4 p-4">
              <FolderIcon className="w-12 h-12 text-yellow-500" />
              <CardTitle>Project Files</CardTitle>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">5 items, modified 20 mins ago</p>
            </CardContent>
          </Card>
          <Card className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center gap-4 p-4">
              <FileIcon className="w-12 h-12 text-blue-500" />
              <CardTitle>Report.docx</CardTitle>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">2 MB, modified 1 hour ago</p>
            </CardContent>
          </Card>
          <Card className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center gap-4 p-4">
              <ImageIcon className="w-12 h-12 text-pink-500" />
              <CardTitle>Design.png</CardTitle>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">3 MB, modified 2 days ago</p>
            </CardContent>
          </Card>
          <Card className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center gap-4 p-4">
              <VideoIcon className="w-12 h-12 text-red-500" />
              <CardTitle>Presentation.mp4</CardTitle>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">15 MB, modified 1 week ago</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}


function FolderIcon(props: any) {
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
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  )
}


function FileIcon(props: any) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}


function ImageIcon(props: any) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}


function VideoIcon(props: any) {
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
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  )
}
