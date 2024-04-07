export default function ExploreLayout({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col justify-between h-full text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900">
        {children}
    </div>
}

