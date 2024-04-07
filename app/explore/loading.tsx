import Spinner from "@/components/Spinner";

export default function Loading() {
    return <div className="flex justify-center items-center h-full">
        <div className="flex justify-center items-center h-full">
            <Spinner />
        </div>
    </div>
}

